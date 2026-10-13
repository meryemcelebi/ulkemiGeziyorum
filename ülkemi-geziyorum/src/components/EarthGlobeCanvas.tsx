import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createProceduralEarthTexture, createCloudTexture } from './earthTexture';

interface EarthGlobeCanvasProps {
  scrollProgress: number; // 0 to 1
  onInspectTurkey?: () => void;
}

export const EarthGlobeCanvas: React.FC<EarthGlobeCanvasProps> = ({
  scrollProgress,
  onInspectTurkey,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const manualRotationRef = useRef({ x: 0, y: 0 });
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const cloudMeshRef = useRef<THREE.Mesh | null>(null);
  const beaconRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Group for Earth and its markers
    const earthGroup = new THREE.Group();
    earthGroupRef.current = earthGroup;
    scene.add(earthGroup);

    // Procedural Earth Textures
    const { map, bump } = createProceduralEarthTexture();
    const cloudTexture = createCloudTexture();

    // Earth Sphere
    const earthRadius = 2.2;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map,
      bumpMap: bump,
      bumpScale: 0.05,
      roughness: 0.42,
      metalness: 0.08,
      emissive: new THREE.Color(0x021526),
      emissiveIntensity: 0.2,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // Outer Cloud Sphere
    const cloudGeometry = new THREE.SphereGeometry(earthRadius + 0.035, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
      roughness: 1,
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMeshRef.current = cloudMesh;
    earthGroup.add(cloudMesh);

    // Atmosphere Glow Rim
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius + 0.12, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.35, 0.72, 1.0, 1.0) * intensity * 1.5;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // Turkey Pin Marker (Lat: ~39° N, Lon: ~35° E)
    // Spherical to Cartesian coordinate conversion
    const latRad = (39 * Math.PI) / 180;
    const lonRad = (35 * Math.PI) / 180;
    const markerRadius = earthRadius + 0.04;

    const x = markerRadius * Math.cos(latRad) * Math.sin(lonRad);
    const y = markerRadius * Math.sin(latRad);
    const z = markerRadius * Math.cos(latRad) * Math.cos(lonRad);

    const markerGroup = new THREE.Group();
    markerGroup.position.set(x, y, z);
    // Align marker with sphere normal
    markerGroup.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(x, y, z).normalize()
    );

    // Glowing core
    const coreGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    markerGroup.add(coreMesh);

    // Pulsing outer ring
    const ringGeo = new THREE.RingGeometry(0.06, 0.11, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    beaconRef.current = ringMesh;
    markerGroup.add(ringMesh);

    earthGroup.add(markerGroup);

    // Lighting
    // Warm Sun Light from Top Right (just like Image 1)
    const sunLight = new THREE.DirectionalLight(0xfff6dd, 2.2);
    sunLight.position.set(5, 6, 4.5);
    scene.add(sunLight);

    // Subtle space ambient fill
    const ambientLight = new THREE.AmbientLight(0x1a334d, 0.8);
    scene.add(ambientLight);

    // Atmospheric rim point light
    const rimLight = new THREE.PointLight(0x38bdf8, 1.4, 20);
    rimLight.position.set(-6, -2, 3);
    scene.add(rimLight);

    // Mouse Drag Rotation Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      manualRotationRef.current.y += deltaX * 0.005;
      manualRotationRef.current.x += deltaY * 0.005;

      // Limit pitch
      manualRotationRef.current.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, manualRotationRef.current.x)
      );

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      manualRotationRef.current.y += deltaX * 0.005;
      manualRotationRef.current.x += deltaY * 0.005;

      previousMousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow cloud spin
      if (cloudMeshRef.current) {
        cloudMeshRef.current.rotation.y = elapsedTime * 0.015;
      }

      // Beacon pulsing
      if (beaconRef.current) {
        const pulse = 1 + 0.3 * Math.sin(elapsedTime * 4);
        beaconRef.current.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
    };
  }, []);

  // Update Earth orientation and camera based on scroll progress
  useEffect(() => {
    if (!earthGroupRef.current || !cameraRef.current) return;

    // Initial orientation: Lat tilt ~ -0.15, Lon ~ -0.2 (showing Mediterranean and Africa nicely)
    // Target orientation: Turkey Lat ~ 39° (approx 0.68 rad), Lon ~ 35° (approx -0.61 rad)
    // As scroll goes from 0 -> 1:
    const t = Math.min(Math.max(scrollProgress, 0), 1);

    // Target rotation to bring Turkey right to front & center:
    // When rotY = -lonRad and rotX = latRad, Turkey faces camera (0, 0, 1)
    const baseRotY = -0.15;
    const targetRotY = -0.61; // 35 deg longitude

    const baseRotX = 0.12;
    const targetRotX = -0.48; // Tilt forward so Turkey sits prominently on the curved horizon

    // Interpolate with easeInOut
    const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const currentTargetY = baseRotY + (targetRotY - baseRotY) * easeT;
    const currentTargetX = baseRotX + (targetRotX - baseRotX) * easeT;

    // Apply manual drag offset on top of scroll target
    earthGroupRef.current.rotation.y = currentTargetY + manualRotationRef.current.y;
    earthGroupRef.current.rotation.x = currentTargetX + manualRotationRef.current.x;

    // Camera zooms in as scroll increases
    // At scroll = 0, z = 6.4
    // At scroll = 1, z = 4.2 (dramatic close-up of Anatolia)
    const targetCameraZ = 6.4 - easeT * 2.2;
    cameraRef.current.position.z = targetCameraZ;
  }, [scrollProgress]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      title="Döndürmek için tıklayıp sürükleyebilirsiniz"
    />
  );
};
