/* ========================================================
   3D Space Population — Deep Z-Axis environment
   Creates abstract geometries, particles, and tunnels
   spaced out along the Z axis for the camera to fly through.
   ======================================================== */
import * as THREE from 'three';

export function initParticles(scene, prefersReducedMotion = false) {
  const groups = [];
  const TOTAL_DEPTH = 7000;
  
  // 1. Base Starfield (Everywhere)
  const starGeo = new THREE.BufferGeometry();
  const starCount = 3000;
  const starPos = new Float32Array(starCount * 3);
  for(let i=0; i<starCount; i++) {
    starPos[i*3] = (Math.random() - 0.5) * 2000;
    starPos[i*3+1] = (Math.random() - 0.5) * 2000;
    starPos[i*3+2] = -Math.random() * (TOTAL_DEPTH + 1000) + 500;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true
  });
  const starfield = new THREE.Points(starGeo, starMat);
  scene.add(starfield);
  groups.push(starfield);

  // Helper function to create abstract rings/tunnels at specific depths
  function createRingTunnel(zDepth, colorHex, radius, count) {
    const group = new THREE.Group();
    group.position.z = zDepth;
    
    const mat = new THREE.MeshBasicMaterial({ 
      color: colorHex, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.15 
    });

    for(let i=0; i<count; i++) {
      const geo = new THREE.TorusGeometry(radius + Math.random()*100, 0.5, 8, 30);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.z = (Math.random() - 0.5) * 600;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      group.add(mesh);
    }
    scene.add(group);
    groups.push(group);
    return group;
  }

  // Helper function to create geometric floating debris
  function createDebris(zDepth, spread) {
    const group = new THREE.Group();
    group.position.z = zDepth;
    
    const geo = new THREE.IcosahedronGeometry(10, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xd4a44a, // Gold
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true
    });

    for(let i=0; i<150; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 800
      );
      mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
      const scale = Math.random() * 1.5 + 0.5;
      mesh.scale.set(scale, scale, scale);
      group.add(mesh);
    }
    scene.add(group);
    groups.push(group);
    return group;
  }

  // Populate sections in Z space:
  // Layer 0: Void (Start)
  // Layer 1: Pain (Chaos debris)
  createDebris(-1000, 800); 

  // Layer 2: Bridge
  createRingTunnel(-2000, 0x6644aa, 300, 20);

  // Layer 4: Method (Geometric structure)
  createDebris(-4000, 400);

  // Layer 5: Journey (Tunnel)
  createRingTunnel(-5000, 0xd4a44a, 200, 40);

  // Layer 6: Results
  // Layer 7: CTA (Convergence)

  function update(elapsed) {
    if (prefersReducedMotion) return;
    
    // Slow continuous rotation of groups for dynamic life
    groups.forEach((g, i) => {
      // Don't rotate the base starfield wildly, just slowly move it
      if (i === 0) {
        g.rotation.z = elapsed * 0.02;
        return;
      }
      g.rotation.z = elapsed * 0.05 * (i % 2 === 0 ? 1 : -1);
      g.rotation.y = Math.sin(elapsed * 0.1) * 0.1;
    });
  }

  return { update };
}
