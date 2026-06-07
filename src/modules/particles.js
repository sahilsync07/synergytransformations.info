/* ========================================================
   True Cinematic 3D Environment
   Creates an infinite, glowing particle tunnel that the camera
   flies through using reliable CanvasTextures for soft circles.
   ======================================================== */
import * as THREE from 'three';

export function initParticles(scene) {
  const groups = [];
  const TOTAL_DEPTH = 8000;
  
  // 1. Generate a soft circular glow texture dynamically (works on all GPUs)
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const glowTexture = new THREE.CanvasTexture(canvas);

  // 2. Create the massive tunnel
  const tunnelGeo = new THREE.BufferGeometry();
  const particleCount = 10000;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const colorGold = new THREE.Color(0xd4a44a);
  const colorPurple = new THREE.Color(0x3a2463);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    // Distribute particles along the Z axis
    const z = -Math.random() * TOTAL_DEPTH + 500;
    
    // Tunnel shape
    const angle = Math.random() * Math.PI * 2;
    const radiusBase = 150 + Math.random() * 200;
    const noise = (Math.random() - 0.5) * 60;
    
    positions[i * 3] = Math.cos(angle) * (radiusBase + noise);
    positions[i * 3 + 1] = Math.sin(angle) * (radiusBase + noise);
    positions[i * 3 + 2] = z;
    
    // Gradient coloring
    const mixRatio = Math.abs(z) / TOTAL_DEPTH;
    const pColor = new THREE.Color().copy(colorGold);
    
    if (Math.random() > 0.8) {
      pColor.lerp(colorWhite, Math.random());
    } else {
      pColor.lerp(colorPurple, mixRatio);
    }
    
    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;
  }
  
  tunnelGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  tunnelGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Use standard PointsMaterial with our glow texture (no custom shader quirks)
  const tunnelMat = new THREE.PointsMaterial({
    size: 20, // World units size, scales down correctly with depth
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  const tunnel = new THREE.Points(tunnelGeo, tunnelMat);
  scene.add(tunnel);
  groups.push(tunnel);
  
  // 3. Central Core "Energy" Path
  const coreGeo = new THREE.BufferGeometry();
  const corePos = new Float32Array(1500 * 3);
  for(let i=0; i<1500; i++) {
    corePos[i*3] = (Math.random() - 0.5) * 30;
    corePos[i*3+1] = (Math.random() - 0.5) * 30;
    corePos[i*3+2] = -Math.random() * TOTAL_DEPTH;
  }
  coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
  const coreMat = new THREE.PointsMaterial({
    size: 8,
    map: glowTexture,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const core = new THREE.Points(coreGeo, coreMat);
  scene.add(core);
  groups.push(core);

  // 4. Floating Dust (Extra foreground depth)
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(2000 * 3);
  for(let i=0; i<2000; i++) {
    dustPos[i*3] = (Math.random() - 0.5) * 800;
    dustPos[i*3+1] = (Math.random() - 0.5) * 800;
    dustPos[i*3+2] = -Math.random() * TOTAL_DEPTH;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 4,
    map: glowTexture,
    color: 0xd4a44a,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);
  groups.push(dust);

  function update(elapsed) {
    // Slow cinematic rotation
    tunnel.rotation.z = elapsed * 0.03;
    core.rotation.z = -elapsed * 0.05;
    dust.rotation.y = elapsed * 0.02;
  }

  return { update };
}
