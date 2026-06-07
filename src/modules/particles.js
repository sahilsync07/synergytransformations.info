/* ========================================================
   Particle System with Scroll-Driven Morph Targets
   Creates particles that morph between shapes based on
   scroll progress through each section.
   ======================================================== */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---- Config ----
const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth < 1024;
const PARTICLE_COUNT = isMobile ? 800 : isTablet ? 1500 : 2500;

// ---- Shape Generators ----
function generateSphere(count, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = radius * (0.8 + Math.random() * 0.2);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function generateChaos(count, spread) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  return positions;
}

function generateStreams(count, length) {
  const positions = new Float32Array(count * 3);
  const numStreams = 5;
  for (let i = 0; i < count; i++) {
    const stream = i % numStreams;
    const t = (i / count) * length - length / 2;
    const angle = (stream / numStreams) * Math.PI * 2;
    const radius = 30 + Math.sin(t * 0.05) * 20;
    const wobble = Math.sin(t * 0.1 + stream) * 10;
    positions[i * 3]     = Math.cos(angle + t * 0.01) * radius + wobble;
    positions[i * 3 + 1] = t;
    positions[i * 3 + 2] = Math.sin(angle + t * 0.01) * radius + wobble;
  }
  return positions;
}

function generateGeometric(count, size) {
  const positions = new Float32Array(count * 3);
  // Icosahedron-like distribution
  const geo = new THREE.IcosahedronGeometry(size, 4);
  const geoPositions = geo.attributes.position.array;
  const geoCount = geoPositions.length / 3;
  for (let i = 0; i < count; i++) {
    const idx = (i % geoCount) * 3;
    const jitter = 2;
    positions[i * 3]     = geoPositions[idx]     + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 1] = geoPositions[idx + 1] + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 2] = geoPositions[idx + 2] + (Math.random() - 0.5) * jitter;
  }
  geo.dispose();
  return positions;
}

function generateTunnel(count, length, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * length - length / 2;
    const angle = (i / count) * Math.PI * 60;
    const r = radius + Math.sin(t * 0.02) * 15;
    positions[i * 3]     = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.sin(angle) * r;
    positions[i * 3 + 2] = t;
  }
  return positions;
}

function generateConstellation(count, spread) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    // Upward-rising spiral
    const angle = t * Math.PI * 8;
    const radius = 20 + t * 60;
    const y = t * spread - spread * 0.3;
    positions[i * 3]     = Math.cos(angle) * radius * (0.5 + Math.random() * 0.5);
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = Math.sin(angle) * radius * (0.5 + Math.random() * 0.5);
  }
  return positions;
}

function generateOrbit(count, radius) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const ring = Math.floor(Math.random() * 3);
    const r = radius * (0.6 + ring * 0.3) + (Math.random() - 0.5) * 10;
    const angle = Math.random() * Math.PI * 2;
    const tilt = (ring - 1) * 0.3;
    positions[i * 3]     = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.sin(angle) * r * tilt + (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }
  return positions;
}

function generateConverge(count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const angle = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = t * t * 3; // cluster tightly near center
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(angle);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(angle);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

// ---- Vertex Shader ----
const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  varying float vDist;
  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDist = -mvPosition.z;

    // Size attenuation
    float size = aSize * uPixelRatio;
    size *= (200.0 / -mvPosition.z);

    // Subtle pulse
    size *= 1.0 + sin(uTime * 2.0 + position.x * 0.1) * 0.1;

    gl_PointSize = clamp(size, 0.5, 40.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ---- Fragment Shader ----
const fragmentShader = `
  varying float vAlpha;
  varying float vDist;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;

  void main() {
    // Circular particle shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    // Soft glow falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vAlpha * uOpacity;

    // Depth-based color mix
    float colorMix = smoothstep(100.0, 600.0, vDist);
    vec3 color = mix(uColor1, uColor2, colorMix);

    // Add subtle glow at center
    float glow = exp(-dist * 6.0) * 0.4;
    color += glow;

    gl_FragColor = vec4(color, alpha);
  }
`;

// ---- Main Export ----
export function initParticles(scene, prefersReducedMotion = false) {
  // Generate all morph targets
  const targets = [
    generateSphere(PARTICLE_COUNT, 60),          // 0: Hero — sphere
    generateChaos(PARTICLE_COUNT, 400),           // 1: Problem — chaos
    generateStreams(PARTICLE_COUNT, 300),          // 2: Bridge — streams
    generateGeometric(PARTICLE_COUNT, 70),        // 3: Program — geometric
    generateTunnel(PARTICLE_COUNT, 600, 50),      // 4: Journey — tunnel
    generateConstellation(PARTICLE_COUNT, 200),   // 5: Results — constellation
    generateOrbit(PARTICLE_COUNT, 80),            // 6: Coach — orbit
    generateConverge(PARTICLE_COUNT),             // 7: CTA — converge
  ];

  // Create geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const alphas = new Float32Array(PARTICLE_COUNT);

  // Initialize with sphere (first shape)
  for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
    positions[i] = targets[0][i];
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    sizes[i] = 1.5 + Math.random() * 3.0;
    alphas[i] = 0.3 + Math.random() * 0.7;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

  // Material with custom shaders
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor1: { value: new THREE.Color(0xd4a44a) }, // Gold
      uColor2: { value: new THREE.Color(0x6644aa) }, // Purple
      uOpacity: { value: 0.85 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Morph state
  const state = {
    currentTarget: 0,
    nextTarget: 0,
    morphProgress: 0,
    globalProgress: 0,
    rotationY: 0,
  };

  // Set up ScrollTrigger for each section
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        state.currentTarget = index;
        state.nextTarget = Math.min(index + 1, targets.length - 1);
        state.morphProgress = self.progress;
        state.globalProgress = (index + self.progress) / sections.length;
      },
    });
  });

  // Update function — called each frame
  function update(elapsed) {
    material.uniforms.uTime.value = elapsed;

    // Morph particles between current and next target
    const posAttr = geometry.attributes.position;
    const currentPositions = targets[state.currentTarget];
    const nextPositions = targets[state.nextTarget];
    const progress = state.morphProgress;

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      // Smooth lerp between targets
      const current = currentPositions[i];
      const next = nextPositions[i];
      // Ease the progress for smoother morphing
      const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep
      posAttr.array[i] += (current + (next - current) * easedProgress - posAttr.array[i]) * 0.08;
    }
    posAttr.needsUpdate = true;

    // Gentle rotation
    if (!prefersReducedMotion) {
      points.rotation.y = elapsed * 0.05 + state.globalProgress * Math.PI * 0.5;
      points.rotation.x = Math.sin(elapsed * 0.03) * 0.1;
    }

    // Color shift based on global scroll progress
    const hue1 = 0.1 + state.globalProgress * 0.05; // Gold shifts slightly
    const hue2 = 0.7 + state.globalProgress * 0.1;  // Purple shifts
    material.uniforms.uColor1.value.setHSL(hue1, 0.7, 0.55);
    material.uniforms.uColor2.value.setHSL(hue2, 0.5, 0.45);
  }

  return { update, points, material, state };
}
