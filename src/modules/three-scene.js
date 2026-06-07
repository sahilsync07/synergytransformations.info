/* ========================================================
   Three.js Scene Manager
   Sets up the WebGL scene, camera, renderer
   ======================================================== */
import * as THREE from 'three';

export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');

  // Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a10, 0.0008);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 300);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // Performance: skip AA for particles
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Simple elapsed time tracker (avoids deprecated THREE.Clock)
  const startTime = performance.now();
  const clock = {
    getElapsedTime() {
      return (performance.now() - startTime) / 1000;
    },
  };

  return { scene, camera, renderer, clock, canvas };
}
