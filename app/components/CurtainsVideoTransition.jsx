"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Curtains, Plane } from "curtainsjs";
import { gsap } from "gsap";
import Hls from "hls.js";

const vertexShader = `
precision mediump float;

// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// our texture matrices
// displacement texture does not need to use them
uniform mat4 firstTextureMatrix;
uniform mat4 secondTextureMatrix;

// custom variables
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec2 vFirstTextureCoord;
varying vec2 vSecondTextureCoord;

// custom uniforms
uniform float uTransitionTimer;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    // varyings
    // use original texture coords for our displacement
    vTextureCoord = aTextureCoord;
    // use texture matrices for our videos
    vFirstTextureCoord = (firstTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vSecondTextureCoord = (secondTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vVertexPosition = aVertexPosition;
}
`;

const fragmentShader = `
precision mediump float;

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec2 vFirstTextureCoord;
varying vec2 vSecondTextureCoord;

// custom uniforms
uniform float uTransitionTimer;
uniform float uTimer;
uniform float uTo;
uniform float uFrom;
uniform float uFadeIn;
uniform float uTransitionMode; // 0.0: warp, 1.0: perlin
uniform float uNoiseScale;
uniform float uNoiseEdge;
uniform float uBandWidth; // half-width of diagonal band for perlinLine
uniform float uNoiseScaleLine; // perlin scale for diagonal band
uniform float uBandNoiseAmp; // diagonal band edge noise amplitude (in UV distance units)
uniform float uChromAberration; // RGB shift amplitude along edge (UV units)
uniform float uEdgeDistort; // additional UV distortion amplitude along edge

// our textures samplers
// notice how it matches our data-sampler attributes
uniform sampler2D firstTexture;
uniform sampler2D secondTexture;
uniform sampler2D thirdTexture;
uniform sampler2D fourthTexture;
uniform sampler2D displacement;

const float PI = 3.141592653589793;

vec4 getTextureByIndex(float index, vec2 vUv){
    vec4 result;
    if(index==0.){
        result = texture2D(firstTexture,vUv);
    }
    if(index==1.){
        result = texture2D(secondTexture,vUv);
    }
    if(index==2.){
        result = texture2D(thirdTexture,vUv);
    }
    if(index==3.){
        result = texture2D(fourthTexture,vUv);
    }
    return result;
}

mat2 rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

// Value noise helpers (Perlin-like)
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    float progress = fract(uTransitionTimer);
    float currentTexture = mod(floor(uTransitionTimer),3.);
    float nextTexture =  mod(floor(uTransitionTimer) +1., 3.);

    vec2 newUV = (vFirstTextureCoord - vec2(0.5))*(0.2 + 0.8*uFadeIn) + vec2(0.5) + 0.6*vec2(0.,1. - uFadeIn);

    float mask = step(vTextureCoord.y,uFadeIn);

    // Compute synchronized zoom: 1.0 -> 1.25 -> 1.0 with eased progress
    float peaseZoom = smoothstep(0.0, 1.0, progress);
    float zoomAmount = 1.0 + 0.25 * (1.0 - abs(2.0 * peaseZoom - 1.0));
    vec2 uvBase = (newUV - vec2(0.5)) / zoomAmount + vec2(0.5);

    // Common UV based on zoomed sampling coords
    vec2 uvDivided = fract(uvBase*vec2(40.,1.));

    // Warp-specific displaced UVs
    vec2 uvWarp1 = uvBase + rotate(PI/4.)*uvDivided*progress*0.1;
    vec2 uvWarp2 = uvBase + rotate(PI/4.)*uvDivided*(1. - progress)*0.1;

    // Plain UVs for perlin path (no warp displacement), zoomed sampling
    vec2 uvPlain = uvBase;

    // Sample sets
    vec4 currentWarp = getTextureByIndex(uFrom, uvWarp1);
    vec4 nextWarp = getTextureByIndex(uTo, uvWarp2);

    vec4 currentPlain = getTextureByIndex(uFrom, uvPlain);
    vec4 nextPlain = getTextureByIndex(uTo, uvPlain);

    // Existing warp transition (only active when selected)
    vec4 colorWarp = mix(currentWarp, nextWarp, progress);

    // Perlin/value-noise-driven organic wipe (only active when selected)
    // Gate the effect so at rest (progress ~ 0) it shows the current frame only
    float eps = 0.02;
    float active = step(eps, progress);
    float perlinT = clamp((progress - eps) / max(1.0 - 2.0 * eps, 0.0001), 0.0, 1.0);
    float n = valueNoise(newUV * uNoiseScale + vec2(perlinT * 2.0, perlinT * 0.5));
    float perlinBlend = active * smoothstep(perlinT - uNoiseEdge, perlinT + uNoiseEdge, n);
    vec4 colorPerlin = mix(nextPlain, currentPlain, perlinBlend);

    // Perlin diagonal edge reveal (top-left to bottom-right)
    // Define diagonal and its perpendicular axis
    vec2 axisDiag = normalize(vec2(1.0, 1.0));
    vec2 axisPerp = normalize(vec2(-axisDiag.y, axisDiag.x));
    float diagLen = 1.41421356237; // sqrt(2)
    float s = dot(newUV, axisDiag) / diagLen; // 0..1 along TL->BR
    // Move edge along diagonal with slight overscan; ease the motion for slow start/end
    float overscan = 0.1;
    float p = smoothstep(0.0, 1.0, progress);
    float center = mix(-overscan, 1.0 + overscan, p);
    // Sample noise along edge-perpendicular axis for visible edge detail
    vec2 noiseUV = vec2(dot(newUV, axisPerp), dot(newUV, axisDiag));
    float nEdge = valueNoise(noiseUV * uNoiseScaleLine + vec2(p * 2.0, p * 0.5));
    float d = center - s; // signed distance (positive when edge has passed this pixel)
    float t = d - (nEdge - 0.5) * uBandNoiseAmp; // noisy threshold
    // Single-edge reveal with soft/noisy boundary
    float edge = smoothstep(-uBandWidth, uBandWidth, t);
    // Center weight to localize chromatic shift and distortion at the edge
    float centerWeight = 1.0 - smoothstep(0.0, uBandWidth, abs(t));
    // Distortion along edge perpendicular
    float distort = (nEdge - 0.5) * uEdgeDistort * centerWeight;
    vec2 uvNext = uvPlain + axisPerp * distort;
    vec2 uvCur = uvPlain - axisPerp * distort * 0.5;
    // RGB channel offsets for next frame
    float ca = uChromAberration * centerWeight;
    vec4 nextR = getTextureByIndex(uTo, uvNext + axisPerp * ca);
    vec4 nextG = getTextureByIndex(uTo, uvNext);
    vec4 nextB = getTextureByIndex(uTo, uvNext - axisPerp * ca);
    vec4 nextShifted = vec4(nextR.r, nextG.g, nextB.b, 1.0);
    // Sample current (slight stability, less/no shift)
    vec4 currentStable = getTextureByIndex(uFrom, uvCur);
    vec4 colorPerlinLine = mix(currentStable, nextShifted, edge);

    // Select transition based on mode, never combine
    vec4 color;
    if (uTransitionMode < 0.5) {
        color = colorWarp;
    } else if (uTransitionMode < 1.5) {
        color = colorPerlin;
    } else {
        color = colorPerlinLine;
    }

    gl_FragColor = mix(vec4(0.,0.,0.,0), color, mask);
}
`;

export default function CurtainsVideoTransition({ projects, transitionType = 'warp', transitionDuration = 1 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const canvasRef = useRef(null);
  const planeRef = useRef(null);
  const curtainsRef = useRef(null);
  const planeInstanceRef = useRef(null);
  const contentRef = useRef(null);
  const touchStartRef = useRef(0);
  const isNavigatingRef = useRef(false);
  const hlsInstancesRef = useRef([]);
  const followerRef = useRef(null);
  const followerPosRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const followerRafRef = useRef(0);
  const [showFollower, setShowFollower] = useState(false);
  const router = useRouter();
  const progressRef = useRef(null);
  const progressRafRef = useRef(0);
  const progressSetterRef = useRef(null);

  const featuredProjects = projects?.filter(p => p.featured).slice(0, 4) || [];
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : (projects?.slice(0, 4) || []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse follower (desktop only)
  useEffect(() => {
    if (!mounted) return;
    const isCoarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    setShowFollower(true);

    const tick = () => {
      const dx = targetPosRef.current.x - followerPosRef.current.x;
      const dy = targetPosRef.current.y - followerPosRef.current.y;
      followerPosRef.current.x += dx * 0.15;
      followerPosRef.current.y += dy * 0.15;
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPosRef.current.x}px, ${followerPosRef.current.y}px, 0) translate(-6px, -6px)`;
      }
      followerRafRef.current = requestAnimationFrame(tick);
    };

    followerRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(followerRafRef.current);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !canvasRef.current || displayProjects.length === 0) return;

    console.log('[CurtainsVideoTransition] Initializing curtains');

    // Initialize Curtains
    const curtains = new Curtains({
      container: canvasRef.current,
      pixelRatio: Math.min(1.5, window.devicePixelRatio),
    });

    curtainsRef.current = curtains;

    // Wait for curtains to be ready first
    curtains.onSuccess(() => {
      console.log('[CurtainsVideoTransition] Curtains initialized successfully');

      const planeElement = planeRef.current;
      if (!planeElement) {
        console.error('[CurtainsVideoTransition] Plane element not found');
        return;
      }

      const videoElements = planeElement.querySelectorAll('video');
      console.log('[CurtainsVideoTransition] Found video elements:', videoElements.length);

      // Setup HLS for each video
      videoElements.forEach((video, index) => {
        const src = video.getAttribute('data-video-src');
        if (!src) return;

        console.log(`[CurtainsVideoTransition] Setting up video ${index}:`, src);

        if (Hls.isSupported()) {
          const hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90
          });

          hls.loadSource(src);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log(`[CurtainsVideoTransition] Video ${index} manifest parsed`);
            // Try to start playing as soon as the manifest is ready
            video.play().then(() => {
              video.isPlaying = true;
            }).catch(() => {
              // Autoplay may still be pending; plane.onReady will try again
            });
          });

          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              console.error(`[CurtainsVideoTransition] Fatal HLS error for video ${index}:`, data.type);
              switch(data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  console.error(`[CurtainsVideoTransition] Cannot recover from error`);
                  break;
              }
            }
          });

          hlsInstancesRef.current.push(hls);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS
          console.log(`[CurtainsVideoTransition] Video ${index} using native HLS`);
          video.src = src;
        }
      });

      console.log('[CurtainsVideoTransition] Creating plane');

      // Set up parameters
      const params = {
        vertexShader,
        fragmentShader,
        widthSegments: 20,
        heightSegments: 20,
        uniforms: {
          transitionTimer: {
            name: "uTransitionTimer",
            type: "1f",
            value: 0,
          },
          to: {
            name: "uTo",
            type: "1f",
            value: 0,
          },
          from: {
            name: "uFrom",
            type: "1f",
            value: 0,
          },
          timer: {
            name: "uTimer",
            type: "1f",
            value: 0,
          },
          fadeIn: {
            name: "uFadeIn",
            type: "1f",
            value: 1.0,
          },
          transitionMode: {
            name: "uTransitionMode",
            type: "1f",
            value: 0.0,
          },
          noiseScale: {
            name: "uNoiseScale",
            type: "1f",
            value: 12.0,
          },
          noiseEdge: {
            name: "uNoiseEdge",
            type: "1f",
            value: 0.15,
          },
          bandWidth: {
            name: "uBandWidth",
            type: "1f",
            value: 0.06,
          },
          noiseScaleLine: {
            name: "uNoiseScaleLine",
            type: "1f",
            value: 48.0,
          },
          bandNoiseAmp: {
            name: "uBandNoiseAmp",
            type: "1f",
            value: 0.06,
          },
          chromAberration: {
            name: "uChromAberration",
            type: "1f",
            value: 0.003,
          },
          edgeDistort: {
            name: "uEdgeDistort",
            type: "1f",
            value: 0.02,
          },
        },
      };

      const plane = new Plane(curtains, planeElement, params);
      planeInstanceRef.current = plane;

      plane.onReady(() => {
        console.log('[CurtainsVideoTransition] Plane ready');
        console.log('[CurtainsVideoTransition] Plane has', plane.videos?.length, 'videos');

        // Initialize transition mode uniform from prop
        if (plane.uniforms && plane.uniforms.transitionMode) {
          plane.uniforms.transitionMode.value = transitionType === 'perlin' ? 1.0 : (transitionType === 'perlinLine' ? 2.0 : 0.0);
        }

        // Ensure all videos are playing so textures stay fresh
        if (plane.videos && plane.videos.length) {
          plane.videos.forEach((vid, i) => {
            vid.play().then(() => {
              console.log(`[CurtainsVideoTransition] Video ${i} playing`);
              vid.isPlaying = true;
            }).catch(e => {
              console.warn(`[CurtainsVideoTransition] Video ${i} play attempt failed (will retry on transition):`, e);
            });
          });

          // Ensure the initial video's progress starts at 0
          const first = plane.videos[0];
          if (first) {
            if (first.readyState >= 1) {
              try { first.currentTime = 0; } catch (e) {}
            } else {
              first.addEventListener('loadedmetadata', () => {
                try { first.currentTime = 0; } catch (e) {}
              }, { once: true });
            }
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: 0 });
            }
          }
        }
      });
    })
    .onError(() => {
      console.error('[CurtainsVideoTransition] Curtains initialization failed');
    });

    // Cleanup
    return () => {
      console.log('[CurtainsVideoTransition] Cleaning up');

      hlsInstancesRef.current.forEach(hls => {
        if (hls) {
          hls.destroy();
        }
      });
      hlsInstancesRef.current = [];

      if (curtainsRef.current) {
        curtainsRef.current.dispose();
      }
    };
  }, [mounted]); // Only depend on mounted, not displayProjects

  // Update transition mode when prop changes
  useEffect(() => {
    const plane = planeInstanceRef.current;
    if (plane && plane.uniforms && plane.uniforms.transitionMode) {
      plane.uniforms.transitionMode.value = transitionType === 'perlin' ? 1.0 : (transitionType === 'perlinLine' ? 2.0 : 0.0);
    }
  }, [transitionType]);

  const handleWheel = (e) => {
    if (isNavigatingRef.current || !planeInstanceRef.current) return;

    console.log('[CurtainsVideoTransition] Wheel event');
    isNavigatingRef.current = true;
    const direction = e.deltaY > 0 ? 1 : -1;
    navigateProject(direction);
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isNavigatingRef.current) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 50) {
      isNavigatingRef.current = true;
      const direction = diff > 0 ? 1 : -1;
      navigateProject(direction);
    }
  };

  const handleMouseMove = (e) => {
    // Use coordinates relative to this component so the follower aligns correctly
    const rect = e.currentTarget.getBoundingClientRect();
    targetPosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    // Ensure follower is visible even if we didn't receive a mouseenter (e.g., page loads with cursor inside)
    if (showFollower && followerRef.current) {
      followerRef.current.style.opacity = '1';
    }
  };

  const handleMouseEnter = () => {
    if (showFollower && followerRef.current) {
      followerRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    if (followerRef.current) {
      followerRef.current.style.opacity = '0';
    }
  };

  const handleClick = () => {
    if (!displayProjects || !displayProjects.length) return;
    const project = displayProjects[currentIndex];
    const slug = project?.slug;
    if (typeof slug === 'string' && slug.length > 0) {
      router.push(`/projects/${slug}`);
    }
  };

  // Smooth progress bar driven by RAF for consistent updates
  useEffect(() => {
    if (!mounted || !progressRef.current) return;

    // QuickSetter is very fast for per-frame updates
    progressSetterRef.current = gsap.quickSetter(progressRef.current, 'scaleX');

    const tick = () => {
      const plane = planeInstanceRef.current;
      const setter = progressSetterRef.current;
      if (!setter) {
        progressRafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!plane || !plane.videos || !plane.videos[currentIndex]) {
        setter(0);
        progressRafRef.current = requestAnimationFrame(tick);
        return;
      }

      const vid = plane.videos[currentIndex];
      const dur = vid.duration || 0;
      const ct = vid.currentTime || 0;
      const frac = dur > 0 ? ct / dur : 0;
      setter(frac);

      // Auto-advance when progress reaches ~90% to avoid seeing looped frames
      if (frac >= 0.9 && !isNavigatingRef.current) {
        isNavigatingRef.current = true;
        navigateProject(1);
      }
      progressRafRef.current = requestAnimationFrame(tick);
    };

    progressRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRafRef.current);
  }, [mounted, currentIndex]);

  // Handle auto-advance on video end only
  useEffect(() => {
    const plane = planeInstanceRef.current;
    if (!mounted || !plane || !plane.videos || !plane.videos[currentIndex]) return;
    const vid = plane.videos[currentIndex];

    const handleEnded = () => {
      if (progressRef.current) gsap.set(progressRef.current, { scaleX: 1 });
      if (!isNavigatingRef.current) {
        isNavigatingRef.current = true;
        navigateProject(1);
      }
    };

    vid.addEventListener('ended', handleEnded);
    return () => vid.removeEventListener('ended', handleEnded);
  }, [mounted, currentIndex]);

  const navigateProject = (direction) => {
    const plane = planeInstanceRef.current;
    if (!plane || !plane.videos) {
      console.error('[CurtainsVideoTransition] Plane not ready');
      isNavigatingRef.current = false;
      return;
    }

    if (plane.transitionTween) {
      plane.transitionTween.kill();
    }
  
    setCurrentIndex(prevIndex => {
      const newIndex = (prevIndex + direction + displayProjects.length) % displayProjects.length;
      console.log(`[CurtainsVideoTransition] Transitioning ${prevIndex} -> ${newIndex}`);
  
      // Everything else (transition logic)
      plane.uniforms.to.value = newIndex;
      plane.uniforms.from.value = prevIndex;

     

  
      const fake = { progress: 0 };

      plane.uniforms.transitionTimer.value = 0;
      // Avoid manual GL clears that may introduce a blank frame
      
      gsap.to(fake, {
        duration: transitionDuration,
        progress: 1,
        ease: "sine.inOut",

        // --- Transition logic lives here ---
      onStart: () => {
        // Ensure next video is playing so its texture is ready when blending begins
        const nextVid = plane.videos[newIndex];
        if (!nextVid.isPlaying) {
          nextVid.play().then(() => {
            setTimeout(() => {
              if (nextVid.texture && nextVid.texture.needUpdate) {
                nextVid.texture.needUpdate();
              }
            }, 50);
          }).catch(console.error);
          nextVid.isPlaying = true;
        }
        // Reset next video to start so progress begins at 0 when it becomes current
        if (nextVid) {
          if (nextVid.readyState >= 1) {
            try { nextVid.currentTime = 0; } catch (e) {}
          } else {
            nextVid.addEventListener('loadedmetadata', () => {
              try { nextVid.currentTime = 0; } catch (e) {}
            }, { once: true });
          }
        }
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: 0 });
        }
      },

      onUpdate: () => {
        const clamped = Math.min(fake.progress, 0.999);
        plane.uniforms.transitionTimer.value = clamped;
      },

      onComplete: () => {
        // Do not pause other videos; keep all playing so textures never stall

        // Set final uniform
        plane.uniforms.from.value = newIndex;
        plane.uniforms.to.value = newIndex;
        plane.uniforms.transitionTimer.value = 0;

        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 500);
    
        },
      });
      
  
      return newIndex;
    });
  };
  
  useEffect(() => {
    if (!mounted) return;

    const wheelHandler = (e) => {
      e.preventDefault();
      handleWheel(e);
    };

    window.addEventListener('wheel', wheelHandler, { passive: false });
    return () => window.removeEventListener('wheel', wheelHandler);
  }, [mounted]);

  if (!displayProjects || displayProjects.length === 0) {
    return (
      <div className="h-[100svh] w-full bg-black flex items-center justify-center">
        <p className="text-white text-xl">No projects available</p>
      </div>
    );
  }

  const currentProject = displayProjects[currentIndex];

  return (
    <div
      className="relative min-h-[100svh] w-full bg-black overflow-hidden cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      aria-label="Open project"
    >
      {/* Canvas Container */}
      <div ref={canvasRef} id="canvas" className="absolute inset-0" />

      {/* Plane with videos - positioned offscreen but with proper dimensions */}
      {mounted && (
        <div className="wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <div ref={planeRef} className="plane" style={{ width: '100%', height: '100%' }}>
            {displayProjects.map((project, index) => (
              project.previewVideo?.playbackId && (
                <video
                  key={project._id}
                  data-sampler={`${['first', 'second', 'third', 'fourth'][index]}Texture`}
                  data-video-src={`https://stream.mux.com/${project.previewVideo.playbackId}.m3u8`}
                  playsInline
                  muted
                  
                  crossOrigin="anonymous"
                  style={{ display: 'none' }}
                />
              )
            ))}
          </div>
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 min-h-[100svh] flex flex-col p-8 md:p-12">
        <div className="flex-1" />
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-[6vw] font-bold text-white mb-4 font-franklin uppercase">
            Mursee Films
          </h1>

          {currentProject.client && (
            <p className="text-sm md:text-base text-white/70 uppercase tracking-wider font-franklin">
              Project: {currentProject.title} | {currentProject.client} | {currentProject.year} 
            </p>
          )}
          {(
            <div className="mt-6 text-[10px] absolute right-20 top-20 md:text-xs text-white/60 tracking-widest uppercase font-franklin animate-pulse">
              Scroll
            </div>
          )}
        </div>
      </div>

      {/* Project Indicator */}
      <div className="absolute bottom-8 md:bottom-12 right-8 md:right-12 z-20">
        <div className="flex flex-col items-end space-y-2">
          <div className="text-white text-2xl md:text-3xl font-franklin">
            {String(currentIndex + 1).padStart(2, '0')} / {String(displayProjects.length).padStart(2, '0')}
          </div>

          <div className="flex space-x-2">
            {displayProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isNavigatingRef.current && index !== currentIndex) {
                    const direction = index > currentIndex ? 1 : -1;
                    navigateProject(direction);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      
      {/* Mouse follower: dot + Play */}
      {showFollower && (
        <div
          ref={followerRef}
          className="absolute top-0 left-0 z-30 pointer-events-none select-none transition-opacity duration-200"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-white" />
            <span className="text-white uppercase tracking-widest text-xs font-franklin">Play</span>
          </div>
        </div>
      )}
      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] z-30 bg-white/10">
        <div
          ref={progressRef}
          className="h-full bg-transparent origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>

  );
}
