/* ========================================================
   Three.js Scene Manager — True 3D Z-Axis Camera
   Sets up scene, camera, renderer, and lighting
   ======================================================== */
import * as THREE from 'three';

export function initThreeScene() {
  const canvas = document.getElementById('webgl');

  // Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.0015);

  // Camera - we will move this along Z axis!
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(0, 0, 0); // Start at Z=0

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x050508, 1);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xd4a44a, 2);
  directionalLight.position.set(100, 200, 100);
  scene.add(directionalLight);

  // Simple performance.now timer
  const startTime = performance.now();
  const clock = {
    getElapsedTime() {
      return (performance.now() - startTime) / 1000;
    },
  };

  return { scene, camera, renderer, clock, canvas };
}
