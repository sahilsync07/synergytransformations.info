/* ========================================================
   True Cinematic 3D Environment
   Creates an infinite, glowing particle tunnel that the camera
   flies through. Premium Apple/Awwwards style depth.
   ======================================================== */
import * as THREE from 'three';

export function initParticles(scene) {
  const groups = [];
  const TOTAL_DEPTH = 8000;
  
  // Create a massive cinematic particle tunnel
  const tunnelGeo = new THREE.BufferGeometry();
  const particleCount = 15000;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  const colorGold = new THREE.Color(0xd4a44a);
  const colorPurple = new THREE.Color(0x3a2463);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    // Distribute particles along the Z axis
    const z = -Math.random() * TOTAL_DEPTH + 500;
    
    // Create a tunnel shape (radius varies slightly with Z to look organic)
    const angle = Math.random() * Math.PI * 2;
    const radiusBase = 150 + Math.random() * 200;
    
    // Add some noise to the tunnel walls
    const noise = (Math.random() - 0.5) * 50;
    
    const x = Math.cos(angle) * (radiusBase + noise);
    const y = Math.sin(angle) * (radiusBase + noise);
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    // Mix colors based on depth to create a gradient tunnel
    const mixRatio = Math.abs(z) / TOTAL_DEPTH;
    const pColor = new THREE.Color().copy(colorGold);
    
    if (Math.random() > 0.7) {
      pColor.lerp(colorWhite, Math.random());
    } else {
      pColor.lerp(colorPurple, mixRatio);
    }
    
    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;
    
    sizes[i] = Math.random() * 2.5 + 0.5;
  }
  
  tunnelGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  tunnelGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  tunnelGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Custom Shader Material for glowing, size-attenuated particles
  const tunnelMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDist;
      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vColor = color;
        // Add subtle waving motion
        vec3 pos = position;
        pos.x += sin(pos.z * 0.01 + uTime * 0.5) * 10.0;
        pos.y += cos(pos.z * 0.01 + uTime * 0.5) * 10.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vDist = -mvPosition.z;
        
        // Attenuate size based on depth
        float pSize = size * uPixelRatio;
        gl_PointSize = pSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDist;
      
      void main() {
        // Create soft circular particles
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float ll = length(xy);
        if(ll > 0.5) discard;
        
        // Soft glow edge
        float alpha = (0.5 - ll) * 2.0;
        
        // Fade out into the deep fog
        float fog = smoothstep(6000.0, 8000.0, vDist);
        alpha *= (1.0 - fog);
        
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  const tunnel = new THREE.Points(tunnelGeo, tunnelMat);
  scene.add(tunnel);
  groups.push(tunnel);
  
  // Central Core "Energy" Line
  const coreGeo = new THREE.BufferGeometry();
  const corePos = new Float32Array(2000 * 3);
  for(let i=0; i<2000; i++) {
    corePos[i*3] = (Math.random() - 0.5) * 20;
    corePos[i*3+1] = (Math.random() - 0.5) * 20;
    corePos[i*3+2] = -Math.random() * TOTAL_DEPTH;
  }
  coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
  const coreMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });
  const core = new THREE.Points(coreGeo, coreMat);
  scene.add(core);
  groups.push(core);

  function update(elapsed) {
    tunnelMat.uniforms.uTime.value = elapsed;
    // Rotate the whole tunnel very slowly for a floating sensation
    tunnel.rotation.z = elapsed * 0.05;
    core.rotation.z = -elapsed * 0.1;
  }

  return { update };
}
