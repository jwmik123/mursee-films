"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export default function ProjectImage({ project }) {
  const [isHovering, setIsHovering] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const textureRef = useRef(null);

  // Check WebGL support
  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch (e) {
      return false;
    }
  }, []);

  // Handle WebGL context lost/restored
  const handleContextLost = useCallback((event) => {
    event.preventDefault();
    setContextLost(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const handleContextRestored = useCallback(() => {
    setContextLost(false);
    // Re-initialize the Three.js scene
    initializeScene();
  }, []);

  // Initialize Three.js scene
  const initializeScene = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas || !webglSupported || contextLost) return;

    try {
      // Set up scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Set up camera (orthographic for 2D effect)
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;
      cameraRef.current = camera;

      // Set up renderer with error handling
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false, // Disable for better performance
        powerPreference: "default", // Better compatibility
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      // Add context event listeners
      canvas.addEventListener("webglcontextlost", handleContextLost, false);
      canvas.addEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false
      );

      loadTexture();
    } catch (error) {
      console.warn("WebGL initialization failed:", error);
      setWebglSupported(false);
    }
  }, [webglSupported, contextLost, handleContextLost, handleContextRestored]);

  // Load texture and set up material
  const loadTexture = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current || !project.imageUrl) return;

    const scene = sceneRef.current;

    // Clear any existing meshes from the scene
    while (scene.children.length > 0) {
      const child = scene.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
      scene.remove(child);
    }

    // Create new texture loader with error handling
    const textureLoader = new THREE.TextureLoader();

    // Set crossOrigin for better compatibility
    textureLoader.setCrossOrigin("anonymous");

    // Load image as texture
    textureLoader.load(
      project.imageUrl,
      (texture) => {
        try {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.flipY = false; // Better compatibility

          textureRef.current = texture;

          // Create shader material with RGB shift effect
          const material = new THREE.ShaderMaterial({
            uniforms: {
              uTexture: { value: texture },
              uMouse: { value: new THREE.Vector2(0.5, 0.5) },
              uHover: { value: 0.0 },
              uTime: { value: 0.0 },
              uIntensity: { value: 0.02 },
              uRadius: { value: 0.3 },
            },
            vertexShader: `
              precision mediump float;
              varying vec2 vUv;
              
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              precision mediump float;
              uniform sampler2D uTexture;
              uniform vec2 uMouse;
              uniform float uHover;
              uniform float uTime;
              uniform float uIntensity;
              uniform float uRadius;
              varying vec2 vUv;
              
              void main() {
                vec2 direction = vUv - uMouse;
                float dist = length(direction);
                
                float timeFactor = sin(uTime * 0.5) * 0.1;
                float radiusInfluence = 1.0 - smoothstep(0.0, uRadius, dist);
                
                // Prevent division by zero and handle edge cases
                vec2 normalizedDirection = length(direction) > 0.0 ? normalize(direction) : vec2(0.0);
                vec2 rgbShift = normalizedDirection * uIntensity * uHover * radiusInfluence * (1.0 + timeFactor);
                
                float r = texture2D(uTexture, vUv - rgbShift).r;
                float g = texture2D(uTexture, vUv).g;
                float b = texture2D(uTexture, vUv + rgbShift).b;
                float a = texture2D(uTexture, vUv).a;
                
                gl_FragColor = vec4(r, g, b, a);
              }
            `,
            transparent: true,
            side: THREE.FrontSide,
          });

          materialRef.current = material;

          // Create mesh and add to scene
          const geometry = new THREE.PlaneGeometry(2, 2);
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          // Start animation loop if not already running
          if (!animationRef.current) {
            startAnimationLoop();
          }

          // Update size
          updateSize();
        } catch (shaderError) {
          console.warn("Shader compilation failed:", shaderError);
          setWebglSupported(false);
        }
      },
      undefined, // onProgress callback is not needed
      (error) => {
        console.warn("Error loading texture:", error);
        // Don't disable WebGL for texture loading errors, just log them
      }
    );
  }, [project.imageUrl]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => updateSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation loop with error handling
  const startAnimationLoop = useCallback(() => {
    if (animationRef.current) return; // Prevent multiple loops

    const animate = () => {
      if (contextLost || !webglSupported) return;

      animationRef.current = requestAnimationFrame(animate);

      try {
        if (materialRef.current && materialRef.current.uniforms.uTime) {
          materialRef.current.uniforms.uTime.value =
            (Date.now() - startTimeRef.current) / 1000;
        }

        if (rendererRef.current && cameraRef.current && sceneRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      } catch (renderError) {
        console.warn("Render error:", renderError);
        // Stop the animation loop on render errors
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
    };

    animate();
  }, [contextLost, webglSupported]);

  // Update renderer size
  const updateSize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current || contextLost) return;

    try {
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        rendererRef.current.setSize(width, height);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    } catch (error) {
      console.warn("Resize error:", error);
    }
  }, [contextLost]);

  // Initialize WebGL support check and scene
  useEffect(() => {
    const supported = checkWebGLSupport();
    setWebglSupported(supported);

    if (supported) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(initializeScene, 100);
      return () => clearTimeout(timer);
    }
  }, [checkWebGLSupport, initializeScene]);

  // Load texture when image URL changes
  useEffect(() => {
    if (webglSupported && !contextLost) {
      loadTexture();
    }
  }, [project.imageUrl, webglSupported, contextLost, loadTexture]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Clean up Three.js resources
      if (textureRef.current) {
        textureRef.current.dispose();
      }

      if (materialRef.current) {
        if (materialRef.current.map) materialRef.current.map.dispose();
        materialRef.current.dispose();
      }

      if (rendererRef.current) {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.removeEventListener("webglcontextlost", handleContextLost);
          canvas.removeEventListener(
            "webglcontextrestored",
            handleContextRestored
          );
        }
        rendererRef.current.dispose();
      }
    };
  }, [handleContextLost, handleContextRestored]);

  // Mouse handlers with safety checks
  const handleMouseMove = useCallback(
    (e) => {
      if (
        !materialRef.current ||
        !canvasRef.current ||
        contextLost ||
        !webglSupported
      )
        return;

      try {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;

        if (materialRef.current.uniforms.uMouse) {
          materialRef.current.uniforms.uMouse.value.set(x, y);
        }
      } catch (error) {
        console.warn("Mouse move error:", error);
      }
    },
    [contextLost, webglSupported]
  );

  const handleMouseEnter = useCallback(() => {
    if (!webglSupported || contextLost) return;

    setIsHovering(true);

    if (materialRef.current && materialRef.current.uniforms.uHover) {
      gsap.to(materialRef.current.uniforms.uHover, {
        value: 1.0,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  }, [webglSupported, contextLost]);

  const handleMouseLeave = useCallback(() => {
    if (!webglSupported || contextLost) return;

    setIsHovering(false);

    if (materialRef.current && materialRef.current.uniforms.uHover) {
      gsap.to(materialRef.current.uniforms.uHover, {
        value: 0.0,
        duration: 0.7,
        ease: "power2.inOut",
      });
    }
  }, [webglSupported, contextLost]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="aspect-video"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Base image */}
      <img
        src={project.imageUrl}
        alt={project.title}
        className="aspect-video"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Canvas overlay for RGB effect - only show if WebGL is supported */}
      {webglSupported && !contextLost && (
        <canvas
          ref={canvasRef}
          className="aspect-video"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: isHovering ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Debug info for development */}
      {process.env.NODE_ENV === "development" && !webglSupported && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(255,0,0,0.8)",
            color: "white",
            padding: "5px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          WebGL not supported
        </div>
      )}
    </div>
  );
}
