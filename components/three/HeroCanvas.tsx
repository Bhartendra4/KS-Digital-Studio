"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const w = () => mount.clientWidth || window.innerWidth;
    const h = () => mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w() / h(), 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w(), h());
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    // ---- particle field ----
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color("#4F7BFF"), new THREE.Color("#8B5CF6"), new THREE.Color("#22D3EE")];
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.035, vertexColors: true, transparent: true, opacity: 0.9,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ---- wireframe orb ----
    const orbGeo = new THREE.IcosahedronGeometry(1, 2);
    const orbMat = new THREE.MeshBasicMaterial({ color: "#4F7BFF", wireframe: true, transparent: true, opacity: 0.22 });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.scale.setScalar(1.7);
    scene.add(orb);

    // ---- mouse parallax ----
    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
      renderer.setSize(w(), h());
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.elapsedTime;
      points.rotation.y += dt * 0.04;
      points.rotation.x += (my * 0.25 - points.rotation.x) * 0.05;
      points.position.x += (mx * 0.6 - points.position.x) * 0.05;
      orb.rotation.y = t * 0.15;
      orb.rotation.z = t * 0.08;
      orb.position.y = Math.sin(t * 0.6) * 0.2;
      renderer.render(scene, camera);
    };
    if (reduce) renderer.render(scene, camera);
    else animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose(); mat.dispose(); orbGeo.dispose(); orbMat.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
