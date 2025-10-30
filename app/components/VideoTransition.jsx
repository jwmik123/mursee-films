import { useEffect, useRef } from 'react';
import * as THREE from 'three/webgpu';
import { texture, uniform, vec2, vec4, mix, smoothstep, Fn, uv } from 'three/tsl';

/**
 * WebGPU Video Transition Component using TSL
 * 
 * @param {Object} props
 * @param {HTMLVideoElement} props.video1 - First video element
 * @param {HTMLVideoElement} props.video2 - Second video element
 * @param {number} props.progress - Transition progress (0 to 1)
 * @param {string} props.transitionType - Type of transition ('dissolve', 'wipe', 'slide')
 * @param {Function} props.onReady - Callback when WebGPU is initialized
 */
export default function VideoTransition({ 
  video1, 
  video2, 
  progress = 0, 
  transitionType = 'dissolve',
  onReady 
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const materialRef = useRef(null);
  const texture1Ref = useRef(null);
  const texture2Ref = useRef(null);
  const progressUniformRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !video1 || !video2) {
      console.log('[VideoTransition] Missing dependencies:', {
        hasContainer: !!containerRef.current,
        hasVideo1: !!video1,
        hasVideo2: !!video2
      });
      return;
    }

    console.log('[VideoTransition] Initializing with videos:', {
      video1: video1,
      video2: video2,
      video1TagName: video1.tagName,
      video2TagName: video2.tagName,
      video1ReadyState: video1.readyState,
      video2ReadyState: video2.readyState,
      video1VideoWidth: video1.videoWidth,
      video1VideoHeight: video1.videoHeight,
      isVideo1HTMLVideo: video1 instanceof HTMLVideoElement,
      isVideo2HTMLVideo: video2 instanceof HTMLVideoElement
    });

    let isCleanedUp = false;

    // Async initialization for WebGPU
    const initWebGPU = async () => {
      // Create canvas element explicitly
      const canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';

      if (!containerRef.current || isCleanedUp) return;

      containerRef.current.appendChild(canvas);
      canvasRef.current = canvas;
      console.log('[VideoTransition] Canvas created');

      // Setup scene
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      // Create renderer with our canvas
      const renderer = new THREE.WebGPURenderer({
        canvas: canvas,
        antialias: false
      });

      try {
        await renderer.init();
        console.log('[VideoTransition] WebGPU renderer initialized');
      } catch (e) {
        console.error('[VideoTransition] Failed to initialize WebGPU:', e);
        return;
      }

      if (isCleanedUp || !containerRef.current) return;

      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Wait for videos to have data before creating textures
      const waitForVideo = (video) => {
        return new Promise((resolve) => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            resolve();
          } else {
            const onCanPlay = () => {
              video.removeEventListener('loadeddata', onCanPlay);
              video.removeEventListener('canplay', onCanPlay);
              resolve();
            };
            video.addEventListener('loadeddata', onCanPlay);
            video.addEventListener('canplay', onCanPlay);
          }
        });
      };

      console.log('[VideoTransition] Waiting for videos to load...');
      await Promise.all([waitForVideo(video1), waitForVideo(video2)]);
      console.log('[VideoTransition] Videos ready, creating textures');

      if (isCleanedUp) return;

      // Create video textures
      const videoTexture1 = new THREE.VideoTexture(video1);
      videoTexture1.minFilter = THREE.LinearFilter;
      videoTexture1.magFilter = THREE.LinearFilter;
      videoTexture1.format = THREE.RGBAFormat;
      console.log('[VideoTransition] Created texture1:', videoTexture1);

      const videoTexture2 = new THREE.VideoTexture(video2);
      videoTexture2.minFilter = THREE.LinearFilter;
      videoTexture2.magFilter = THREE.LinearFilter;
      videoTexture2.format = THREE.RGBAFormat;
      console.log('[VideoTransition] Created texture2:', videoTexture2);

      // Progress uniform
      const progressUniform = uniform(0);

      // Create transition material using TSL
      const transitionMaterial = createTransitionMaterial(
        videoTexture1,
        videoTexture2,
        progressUniform,
        transitionType
      );
      console.log('[VideoTransition] Created material with type:', transitionType);

      // Create fullscreen quad
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, transitionMaterial);
      scene.add(mesh);

      // Store refs
      rendererRef.current = renderer;
      sceneRef.current = scene;
      materialRef.current = transitionMaterial;
      texture1Ref.current = videoTexture1;
      texture2Ref.current = videoTexture2;
      progressUniformRef.current = progressUniform;

      // Animation loop
      function animate() {
        if (!rendererRef.current || isCleanedUp) return;

        // Update textures if videos are playing
        if (texture1Ref.current) texture1Ref.current.needsUpdate = true;
        if (texture2Ref.current) texture2Ref.current.needsUpdate = true;

        renderer.renderAsync(scene, camera);
      }

      renderer.setAnimationLoop(animate);
      console.log('[VideoTransition] Animation loop started');

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current || !rendererRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        rendererRef.current.setSize(width, height);
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);

      // Notify parent component
      if (onReady) {
        console.log('[VideoTransition] Calling onReady callback');
        onReady();
      }

      console.log('[VideoTransition] Setup complete');

      // Store cleanup data
      return { geometry, videoTexture1, videoTexture2, handleResize };
    };

    // Start initialization
    let cleanupData;
    initWebGPU().then(data => {
      cleanupData = data;
    });

    // Cleanup
    return () => {
      console.log('[VideoTransition] Cleaning up');
      isCleanedUp = true;

      if (cleanupData?.handleResize) {
        window.removeEventListener('resize', cleanupData.handleResize);
      }

      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null);
        try {
          rendererRef.current.dispose();
        } catch (e) {
          console.warn('[VideoTransition] Error disposing renderer:', e);
        }
        rendererRef.current = null;
      }

      if (canvasRef.current && containerRef.current && containerRef.current.contains(canvasRef.current)) {
        try {
          containerRef.current.removeChild(canvasRef.current);
        } catch (e) {
          console.warn('[VideoTransition] Error removing canvas:', e);
        }
        canvasRef.current = null;
      }

      if (cleanupData?.geometry) cleanupData.geometry.dispose();
      if (cleanupData?.videoTexture1) cleanupData.videoTexture1.dispose();
      if (cleanupData?.videoTexture2) cleanupData.videoTexture2.dispose();

      // Clear refs
      sceneRef.current = null;
      materialRef.current = null;
      texture1Ref.current = null;
      texture2Ref.current = null;
      progressUniformRef.current = null;
    };
  }, [video1, video2, transitionType, onReady]);

  // Update progress uniform when prop changes
  useEffect(() => {
    if (progressUniformRef.current) {
      console.log('[VideoTransition] Progress updated to:', progress);
      progressUniformRef.current.value = progress;
    }
  }, [progress]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }} 
    />
  );
}

/**
 * Creates a transition material using Three.js Shading Language (TSL)
 */
function createTransitionMaterial(texture1, texture2, progressUniform, transitionType) {
  console.log('[createTransitionMaterial] Creating material:', {
    transitionType,
    hasTexture1: !!texture1,
    hasTexture2: !!texture2
  });

  // Convert textures to TSL nodes
  const tex1 = texture(texture1);
  const tex2 = texture(texture2);

  let transitionShader;

  switch (transitionType) {
    case 'wipe':
      transitionShader = createWipeTransition(tex1, tex2, progressUniform);
      break;
    
    case 'slide':
      transitionShader = createSlideTransition(tex1, tex2, progressUniform);
      break;
    
    case 'dissolve':
    default:
      transitionShader = createDissolveTransition(tex1, tex2, progressUniform);
      break;
  }

  const material = new THREE.MeshBasicNodeMaterial();
  material.colorNode = transitionShader;
  console.log('[createTransitionMaterial] Material created:', material);

  return material;
}

/**
 * Dissolve transition - smooth crossfade
 */
function createDissolveTransition(tex1, tex2, progressUniform) {
  return Fn(() => {
    const uvCoord = uv(); // Get actual UV coordinates from fragment shader

    const color1 = tex1.uv(uvCoord);
    const color2 = tex2.uv(uvCoord);

    // Smooth crossfade
    const mixValue = smoothstep(0.0, 1.0, progressUniform);

    return mix(color1, color2, mixValue);
  })();
}

/**
 * Wipe transition - left to right
 */
function createWipeTransition(tex1, tex2, progressUniform) {
  return Fn(() => {
    const uvCoord = uv(); // Get actual UV coordinates from fragment shader

    const color1 = tex1.uv(uvCoord);
    const color2 = tex2.uv(uvCoord);

    // Add smooth edge to the wipe
    const edge = 0.05;
    const wipePosition = progressUniform;
    const mixValue = smoothstep(wipePosition.sub(edge), wipePosition.add(edge), uvCoord.x);

    return mix(color1, color2, mixValue);
  })();
}

/**
 * Slide transition - slides in from right
 */
function createSlideTransition(tex1, tex2, progressUniform) {
  return Fn(() => {
    const uvCoord = uv(); // Get actual UV coordinates from fragment shader

    // Offset UV for sliding effect
    const uv1 = uvCoord.add(vec2(progressUniform.negate(), 0));
    const uv2 = uvCoord.add(vec2(progressUniform.negate().add(1.0), 0));

    const color1 = tex1.uv(uv1);
    const color2 = tex2.uv(uv2);

    // Mix based on which video is visible at this UV coordinate
    const mixValue = smoothstep(0.0, 1.0, progressUniform);

    return mix(color1, color2, mixValue);
  })();
}