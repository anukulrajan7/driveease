"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ORIGIN, DESTINATION_COORDS, type GeoPoint } from "@/data/geo";

/** lat/lng (degrees) → point on a sphere of the given radius. */
function toVec3(p: GeoPoint, radius: number): THREE.Vector3 {
  const phi = ((90 - p.lat) * Math.PI) / 180;
  const theta = ((p.lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Stripe / GitHub-style 3D globe: a lit sphere with a brand-green graticule,
 * glowing destination points across the Seven Sisters, and animated
 * great-circle arcs flying out from Siliguri. Antialiasing is off for
 * smoothness (per perf best-practice); fully static under reduced motion.
 */
export default function Globe({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(2, 1.5, 2.5);
    scene.add(dir);

    const spinner = new THREE.Group();
    spinner.rotation.x = 0.35;
    scene.add(spinner);
    const globe = new THREE.Group();
    spinner.add(globe);

    // Base sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 48, 48),
      new THREE.MeshPhongMaterial({ color: 0x0b251a, emissive: 0x06140d, shininess: 12 })
    );
    globe.add(sphere);

    // Graticule (lat/long grid)
    const grid = new THREE.Mesh(
      new THREE.SphereGeometry(1.003, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true, transparent: true, opacity: 0.12 })
    );
    globe.add(grid);

    // Glowing-dot sprite shared by all points
    const dotTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.9)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    const addPoint = (p: GeoPoint, color: number, size: number) => {
      const v = toVec3(p, 1.01);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: dotTex, color, transparent: true, depthWrite: false })
      );
      sprite.position.copy(v);
      sprite.scale.setScalar(size);
      globe.add(sprite);
      return v;
    };

    const originVec = addPoint(ORIGIN, 0xfb923c, 0.13);
    const destinations = Object.values(DESTINATION_COORDS);
    const destVecs = destinations.map((d) => addPoint(d, 0x4ade80, 0.085));

    // Great-circle arcs from Siliguri → each destination + a traveling comet
    const travelers: { curve: THREE.QuadraticBezierCurve3; mesh: THREE.Sprite; offset: number }[] = [];
    destVecs.forEach((dest, i) => {
      const mid = originVec.clone().add(dest).multiplyScalar(0.5);
      const lift = 1 + originVec.distanceTo(dest) * 0.45;
      mid.normalize().multiplyScalar(lift);
      const curve = new THREE.QuadraticBezierCurve3(originVec, mid, dest);

      const geo = new THREE.TubeGeometry(curve, 50, 0.0035, 6, false);
      const arc = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.55 })
      );
      globe.add(arc);

      const comet = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: dotTex, color: 0xfff7ed, transparent: true, depthWrite: false })
      );
      comet.scale.setScalar(0.06);
      globe.add(comet);
      travelers.push({ curve, mesh: comet, offset: i / destVecs.length });
    });

    // Starfield
    const starPos = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(6 + Math.random() * 6);
      starPos.set([v.x, v.y, v.z], i * 3);
    }
    const stars = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(starPos, 3)),
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.6 })
    );
    scene.add(stars);

    // Orient so the Seven Sisters cluster faces the camera at start
    const centroid = destVecs
      .reduce((acc, v) => acc.add(v), new THREE.Vector3())
      .normalize();
    globe.quaternion.setFromUnitVectors(centroid, new THREE.Vector3(0, 0, 1));

    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let raf = 0;
    let t = 0;
    const render = () => {
      t += 0.0025;
      if (!reduce) {
        spinner.rotation.y += 0.0022;
        spinner.rotation.x += (0.35 - target.y - spinner.rotation.x) * 0.04;
        travelers.forEach((tr) => {
          const p = (t + tr.offset) % 1;
          tr.mesh.position.copy(tr.curve.getPoint(p));
          const m = tr.mesh.material as THREE.SpriteMaterial;
          m.opacity = Math.sin(p * Math.PI);
        });
      }
      renderer.render(scene, camera);
      if (!reduce) raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      });
      dotTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} aria-hidden className={className} />;
}
