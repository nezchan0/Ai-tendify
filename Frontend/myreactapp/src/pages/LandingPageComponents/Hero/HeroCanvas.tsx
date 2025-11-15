import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // Increased particle count
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100; // Increased spread
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create multiple particle systems with different colors
    const particleGroups = [
      { color: 0x4f46e5, size: 0.2 }, // Indigo
      { color: 0x7c3aed, size: 0.15 }, // Purple
      { color: 0x2563eb, size: 0.18 }, // Blue
    ];

    const particleSystems = particleGroups.map(group => {
      const material = new THREE.PointsMaterial({
        size: group.size,
        color: new THREE.Color(group.color),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      
      return new THREE.Points(particlesGeometry.clone(), material);
    });

    particleSystems.forEach(system => scene.add(system));
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse interaction
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let frame = 0;
    const animate = () => {
      frame += 0.01;
      requestAnimationFrame(animate);
      
      particleSystems.forEach((system, index) => {
        system.rotation.x += 0.0003 * (index + 1);
        system.rotation.y += 0.0005 * (index + 1);
        system.rotation.z = Math.sin(frame) * 0.001;
        
        // Follow mouse with slight lag
        system.rotation.x += (mouse.y * 0.2 - system.rotation.x) * 0.02;
        system.rotation.y += (mouse.x * 0.2 - system.rotation.y) * 0.02;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return <div ref={canvasRef} className="absolute inset-0" />;
};

export default HeroCanvas;