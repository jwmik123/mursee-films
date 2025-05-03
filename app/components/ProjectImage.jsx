"use client";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export default function ProjectImage({ project }) {
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Initialize Three.js scene
  useEffect(() => {
    // Only run this once on component mount
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera (orthographic for 2D effect)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Create a plane geometry that fills the view
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Create a cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Clean up Three.js resources
      if (geometry) geometry.dispose();
      if (rendererRef.current) rendererRef.current.dispose();

      // Clean up material and texture if they exist
      if (materialRef.current) {
        if (materialRef.current.map) materialRef.current.map.dispose();
        materialRef.current.dispose();
      }
    };
  }, []);

  // Load texture and set up material when image URL changes
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current) return;

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

    // Create new texture loader
    const textureLoader = new THREE.TextureLoader();

    // Load image as texture
    textureLoader.load(
      project.imageUrl,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

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
            varying vec2 vUv;
            
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
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
              vec2 rgbShift = normalize(direction) * uIntensity * uHover * radiusInfluence * (1.0 + timeFactor);
              
              float r = texture2D(uTexture, vUv - rgbShift).r;
              float g = texture2D(uTexture, vUv).g;
              float b = texture2D(uTexture, vUv + rgbShift).b;
              float a = texture2D(uTexture, vUv).a;
              
              gl_FragColor = vec4(r, g, b, a);
            }
          `,
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
      },
      undefined, // onProgress callback is not needed
      (error) => {
        console.error("Error loading texture:", error);
      }
    );
  }, [project.imageUrl]);

  // Handle resize
  useEffect(() => {
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Animation loop
  const startAnimationLoop = () => {
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value =
          (Date.now() - startTimeRef.current) / 1000;
      }

      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();
  };

  // Update renderer size
  const updateSize = () => {
    if (!containerRef.current || !rendererRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  // Mouse handlers
  const handleMouseMove = (e) => {
    if (!materialRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;

    materialRef.current.uniforms.uMouse.value.set(x, y);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);

    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uHover, {
        value: 1.0,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uHover, {
        value: 0.0,
        duration: 0.7,
        ease: "power2.inOut",
      });
    }
  };

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

      {/* Canvas overlay for RGB effect */}
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

      {/* Project title with stagger animation */}
      <div
        className="absolute bottom-0 left-0 px-4 py-2"
        style={{
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="overflow-hidden">
          <h3 className="text-white text-xl font-medium">
            {project.title.split("").map((char, index) => (
              <span
                key={index}
                className="inline-block"
                style={{
                  transform: isHovering ? "translateY(0)" : "translateY(100%)",
                  opacity: isHovering ? 1 : 0,
                  transition: `transform 0.2s ease ${
                    index * 0.03
                  }s, opacity 0.2s ease ${index * 0.03}s`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h3>
        </div>
      </div>
    </div>
  );
}
