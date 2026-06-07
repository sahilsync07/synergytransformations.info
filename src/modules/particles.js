/* ========================================================
   4-Act Cinematic 3D Sequence
   Act 1 & 2: Shattered Chaos -> Golden Alignment
   Act 3: Warp Tunnel
   Act 4: The Convergence Core
   ======================================================== */
import * as THREE from 'three';

export function initParticles(scene) {
  const groups = [];
  const TOTAL_DEPTH = 8000;
  
  // Create shared glow texture for points
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const glowTexture = new THREE.CanvasTexture(canvas);

  // ==========================================
  // ACT 1 & 2: Chaos -> Alignment (InstancedMesh)
  // Positioned around Z = -2000
  // ==========================================
  const shardCount = 400;
  // A simple triangular shard geometry
  const shardGeo = new THREE.TetrahedronGeometry(15, 0); 
  
  // Custom ShaderMaterial to interpolate between scattered (chaos) and assembled (alignment)
  const shardMat = new THREE.ShaderMaterial({
    uniforms: {
      uProgress: { value: 0.0 }, // 0 = Chaos, 1 = Assembled
      uTime: { value: 0.0 },
      colorGold: { value: new THREE.Color(0xd4a44a) },
      colorDark: { value: new THREE.Color(0x3a2463) }
    },
    vertexShader: `
      uniform float uProgress;
      uniform float uTime;
      attribute vec3 targetPos;
      attribute vec3 scatterPos;
      attribute vec4 targetRot; // Quaternions
      attribute vec4 scatterRot;
      
      varying vec3 vPos;
      
      // Function to rotate vector by quaternion
      vec3 applyQuat(vec3 v, vec4 q) {
        vec3 t = 2.0 * cross(q.xyz, v);
        return v + q.w * t + cross(q.xyz, t);
      }
      
      void main() {
        // Interpolate position
        vec3 currentPos = mix(scatterPos, targetPos, uProgress);
        
        // Add subtle floating animation based on time when in chaos state
        float floatIntensity = 1.0 - uProgress;
        currentPos.x += sin(uTime + scatterPos.y * 0.01) * 20.0 * floatIntensity;
        currentPos.y += cos(uTime + scatterPos.x * 0.01) * 20.0 * floatIntensity;
        
        // Interpolate rotation (simple linear interpolation of quats for performance)
        vec4 currentRot = normalize(mix(scatterRot, targetRot, uProgress));
        
        vec3 rotatedPosition = applyQuat(position, currentRot);
        vec4 worldPosition = instanceMatrix * vec4(rotatedPosition + currentPos, 1.0);
        
        vPos = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      uniform vec3 colorGold;
      uniform vec3 colorDark;
      varying vec3 vPos;
      
      void main() {
        // Shards light up gold as they assemble
        vec3 color = mix(colorDark, colorGold, uProgress);
        // Add subtle wireframe/edge highlight feel
        gl_FragColor = vec4(color, 0.4 + (uProgress * 0.4));
      }
    `,
    transparent: true,
    wireframe: true, // Wireframe makes it look techy/geometric
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const chaosMesh = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
  chaosMesh.position.z = -2000;
  
  // Calculate target positions (A massive sphere/icosahedron structure)
  const targetPositions = new Float32Array(shardCount * 3);
  const scatterPositions = new Float32Array(shardCount * 3);
  const targetRotations = new Float32Array(shardCount * 4);
  const scatterRotations = new Float32Array(shardCount * 4);
  
  const dummy = new THREE.Object3D();
  
  for (let i = 0; i < shardCount; i++) {
    // Target: Golden Sphere Structure
    const phi = Math.acos(-1 + (2 * i) / shardCount);
    const theta = Math.sqrt(shardCount * Math.PI) * phi;
    const radius = 400;
    
    dummy.position.setFromSphericalCoords(radius, phi, theta);
    dummy.lookAt(0,0,0);
    dummy.updateMatrix();
    
    targetPositions[i*3] = dummy.position.x;
    targetPositions[i*3+1] = dummy.position.y;
    targetPositions[i*3+2] = dummy.position.z;
    
    targetRotations[i*4] = dummy.quaternion.x;
    targetRotations[i*4+1] = dummy.quaternion.y;
    targetRotations[i*4+2] = dummy.quaternion.z;
    targetRotations[i*4+3] = dummy.quaternion.w;
    
    // Scatter: Wide chaotic field
    scatterPositions[i*3] = (Math.random() - 0.5) * 3000;
    scatterPositions[i*3+1] = (Math.random() - 0.5) * 3000;
    scatterPositions[i*3+2] = (Math.random() - 0.5) * 2000;
    
    dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    scatterRotations[i*4] = dummy.quaternion.x;
    scatterRotations[i*4+1] = dummy.quaternion.y;
    scatterRotations[i*4+2] = dummy.quaternion.z;
    scatterRotations[i*4+3] = dummy.quaternion.w;
    
    // Identity matrix for standard instances (handled in shader)
    chaosMesh.setMatrixAt(i, new THREE.Matrix4());
  }
  
  chaosMesh.geometry.setAttribute('targetPos', new THREE.InstancedBufferAttribute(targetPositions, 3));
  chaosMesh.geometry.setAttribute('scatterPos', new THREE.InstancedBufferAttribute(scatterPositions, 3));
  chaosMesh.geometry.setAttribute('targetRot', new THREE.InstancedBufferAttribute(targetRotations, 4));
  chaosMesh.geometry.setAttribute('scatterRot', new THREE.InstancedBufferAttribute(scatterRotations, 4));
  
  scene.add(chaosMesh);
  groups.push(chaosMesh);

  // ==========================================
  // ACT 3: Warp Tunnel (Z = -3000 to -6000)
  // ==========================================
  const warpGeo = new THREE.BufferGeometry();
  const warpCount = 3000;
  const warpPos = new Float32Array(warpCount * 3);
  for(let i=0; i<warpCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 200 + Math.random() * 100;
    warpPos[i*3] = Math.cos(angle) * radius;
    warpPos[i*3+1] = Math.sin(angle) * radius;
    warpPos[i*3+2] = -3000 - Math.random() * 3000;
  }
  warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPos, 3));
  
  // Custom material to stretch particles based on speed
  const warpMat = new THREE.ShaderMaterial({
    uniforms: {
      uSpeed: { value: 0.0 }, // GSAP will animate this
      color: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      uniform float uSpeed;
      varying float vZ;
      void main() {
        vec3 pos = position;
        // Stretch lines along Z axis based on speed
        pos.z += uSpeed * mod(float(gl_VertexID), 10.0) * 100.0;
        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        vZ = pos.z;
        gl_PointSize = 10.0 * (300.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      void main() {
        // simple glowing line streak
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        if(length(xy) > 0.5) discard;
        gl_FragColor = vec4(color, 0.6);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const warpTunnel = new THREE.Points(warpGeo, warpMat);
  scene.add(warpTunnel);
  groups.push(warpTunnel);

  // ==========================================
  // ACT 4: The Convergence Core (Z = -7000)
  // ==========================================
  const coreGeo = new THREE.IcosahedronGeometry(200, 2);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.0 // Fades in at the end
  });
  const convergenceCore = new THREE.Mesh(coreGeo, coreMat);
  convergenceCore.position.set(0, 0, -7000);
  scene.add(convergenceCore);
  groups.push(convergenceCore);
  
  // Intense glow behind the core
  const glowGeo = new THREE.PlaneGeometry(1500, 1500);
  const glowMat = new THREE.MeshBasicMaterial({
    map: glowTexture,
    color: 0xd4a44a,
    transparent: true,
    opacity: 0.0, // Fades in
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const coreGlow = new THREE.Mesh(glowGeo, glowMat);
  coreGlow.position.set(0, 0, -7050);
  scene.add(coreGlow);

  function update(elapsed) {
    shardMat.uniforms.uTime.value = elapsed;
    chaosMesh.rotation.y = elapsed * 0.1;
    chaosMesh.rotation.z = elapsed * 0.05;
    
    warpTunnel.rotation.z = elapsed * -0.5;
    
    convergenceCore.rotation.x = elapsed * 0.2;
    convergenceCore.rotation.y = elapsed * 0.3;
    const pulse = 1.0 + Math.sin(elapsed * 5.0) * 0.1;
    convergenceCore.scale.set(pulse, pulse, pulse);
  }

  // Export uniforms and objects so animations.js can control them
  return { 
    update,
    chaosUniforms: shardMat.uniforms,
    warpUniforms: warpMat.uniforms,
    coreMat,
    coreGlowMat: glowMat
  };
}
