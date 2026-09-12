import * as THREE from "three";
import { certificateLabel, type Certificate } from "@/lib/certificates";

// Small, deterministic surface maps stay attached to the geometry as it spins.
// Red holds surface height; green holds roughness, as expected by Three.js.
function createSurfaceMap(brushed: boolean, colorMap = false) {
  const size = 256;
  const pixels = new Uint8Array(size * size * 4);
  let seed = 417;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let y = 0; y < size; y++) {
    const streak = random();
    for (let x = 0; x < size; x++) {
      const grain = random();
      const height = brushed ? streak * 0.8 + grain * 0.2 : grain;
      const offset = (y * size + x) * 4;
      pixels[offset] = colorMap
        ? Math.round(170 + height * 65)
        : Math.round(65 + height * 125);
      pixels[offset + 1] = colorMap
        ? pixels[offset]
        : Math.round(165 + (brushed ? height : grain) * 85);
      pixels[offset + 2] = pixels[offset];
      pixels[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.repeat.set(brushed ? 1 : 1.5, 1.5);
  if (colorMap) texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export type CertificateScene = {
  ready: Promise<void>;
  update: (certificate: Certificate) => void;
  setPlaying: (playing: boolean) => void;
  setScrollProgress: (progress: number) => void;
  rotate: (amount: number) => void;
  reset: () => void;
  dispose: () => void;
};

export function createCertificateScene(
  host: HTMLElement,
  initial: Certificate,
): CertificateScene {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0, 8.4);
  scene.add(new THREE.HemisphereLight(0xffefda, 0x384549, 2.8));
  const key = new THREE.DirectionalLight(0xffe4bc, 4.5);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc4dedb, 3.5);
  rim.position.set(4, 1, -3);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 1.5);
  fill.position.set(2, -2, 4);
  scene.add(fill);

  const shape = new THREE.Shape();
  shape.moveTo(0, 1.7);
  shape.bezierCurveTo(0.64, 1.7, 1.25, 1.14, 1.25, 0.86);
  shape.lineTo(1.25, -0.86);
  shape.bezierCurveTo(1.25, -1.18, 0.42, -1.7, 0, -1.7);
  shape.bezierCurveTo(-0.42, -1.7, -1.25, -1.18, -1.25, -0.86);
  shape.lineTo(-1.25, 0.86);
  shape.bezierCurveTo(-1.25, 1.14, -0.64, 1.7, 0, 1.7);

  const bodyGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.055,
    bevelThickness: 0.045,
    curveSegments: 40,
  });
  bodyGeometry.translate(0, 0, -0.09);
  const faceSurface = createSurfaceMap(false);
  const edgeSurface = createSurfaceMap(true);
  const edgeColor = createSurfaceMap(true, true);
  const metal = new THREE.MeshStandardMaterial({
    color: initial.accent,
    map: edgeColor,
    metalness: 0.72,
    roughness: 0.78,
    roughnessMap: edgeSurface,
    bumpMap: edgeSurface,
    bumpScale: 0.08,
  });
  const badge = new THREE.Group();
  badge.add(new THREE.Mesh(bodyGeometry, metal));
  badge.rotation.set(0.05, -0.32, -0.035);
  scene.add(badge);

  const faceGeometry = new THREE.ShapeGeometry(shape, 40);
  const positions = faceGeometry.getAttribute("position");
  const uv = faceGeometry.getAttribute("uv");
  for (let i = 0; i < positions.count; i++) {
    uv.setXY(
      i,
      (positions.getX(i) + 1.25) / 2.5,
      (positions.getY(i) + 1.7) / 3.4,
    );
  }
  // Printed brand colors stay true to the artwork; the beveled rim catches light.
  const createFaceMaterial = () =>
    initial.theme === "trend-micro" || initial.theme === "python"
      ? new THREE.MeshBasicMaterial({ toneMapped: false })
      : new THREE.MeshStandardMaterial({
          roughness: 0.72,
          metalness: 0.08,
          roughnessMap: faceSurface,
          bumpMap: faceSurface,
          bumpScale: 0.035,
        });
  const frontMaterial = createFaceMaterial();
  const backMaterial = createFaceMaterial();
  const front = new THREE.Mesh(faceGeometry, frontMaterial);
  front.scale.set(0.956, 0.956, 1);
  front.position.z = 0.142;
  badge.add(front);
  const back = new THREE.Mesh(faceGeometry, backMaterial);
  back.scale.set(0.956, 0.956, 1);
  back.rotation.y = Math.PI;
  back.position.z = -0.142;
  badge.add(back);

  // A fine satin coating catches the lights without replacing printed brand
  // colors with a brightly lit material or changing the badge silhouette.
  const coatingMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x242424,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    metalness: 0.15,
    roughness: 0.8,
    roughnessMap: faceSurface,
    bumpMap: faceSurface,
    bumpScale: 0.065,
    clearcoat: 0.35,
    clearcoatRoughness: 0.65,
    clearcoatRoughnessMap: faceSurface,
  });
  const frontCoating = new THREE.Mesh(faceGeometry, coatingMaterial);
  frontCoating.scale.copy(front.scale);
  frontCoating.position.z = 0.145;
  badge.add(frontCoating);
  const backCoating = new THREE.Mesh(faceGeometry, coatingMaterial);
  backCoating.scale.copy(back.scale);
  backCoating.rotation.y = Math.PI;
  backCoating.position.z = -0.145;
  badge.add(backCoating);

  let disposed = false;
  let revision = 0;
  const textures: THREE.Texture[] = [];
  const drawTexture = (
    entry: Certificate,
    reverse: boolean,
    logo?: HTMLImageElement,
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 768, 1024);
    gradient.addColorStop(0, entry.theme === "python" ? "#3776ab" : "#34403d");
    gradient.addColorStop(
      0.48,
      entry.theme === "python" ? "#214f75" : "#1b2322",
    );
    gradient.addColorStop(1, entry.theme === "python" ? "#102a42" : "#101716");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 768, 1024);
    ctx.strokeStyle = `${entry.accent}36`;
    ctx.lineWidth = 1;
    for (let i = -900; i < 1100; i += 44) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 1024, 1024);
      ctx.stroke();
    }
    ctx.textAlign = "center";
    if (entry.theme === "python" && logo && !reverse) {
      ctx.drawImage(logo, 249, 118, 270, (270 * logo.height) / logo.width);
    } else {
      ctx.fillStyle = entry.theme === "python" ? "#10283c" : "#192220";
      ctx.beginPath();
      ctx.arc(384, 292, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = entry.accent;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(384, 292, 122, 0, Math.PI * 2);
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillStyle = entry.accent;
      ctx.font = `normal ${reverse ? 66 : 58}px Georgia`;
      ctx.fillText(reverse ? "JB" : entry.monogram, 384, 312);
    }
    ctx.fillStyle = entry.theme === "python" ? "#ffd343" : entry.accent;
    ctx.font = "22px Arial";
    ctx.fillText(
      reverse ? "JEZREEL BORLONGAN" : entry.issuer.toUpperCase(),
      384,
      478,
      620,
    );
    ctx.fillStyle = entry.theme === "python" ? "#ffd343" : "#eee9df";
    ctx.font = "normal 54px Georgia";
    (reverse
      ? ["Always learning.", "Always building."]
      : entry.badgeLines
    ).forEach((line, i) => ctx.fillText(line, 384, 573 + i * 66, 660));
    ctx.strokeStyle = entry.theme === "python" ? "#ffd343" : entry.accent;
    ctx.beginPath();
    ctx.moveTo(240, 699);
    ctx.lineTo(528, 699);
    ctx.stroke();
    ctx.fillStyle = entry.theme === "python" ? "#ffd343" : entry.accent;
    ctx.font = "21px Arial";
    ctx.fillText(certificateLabel(entry).toUpperCase(), 384, 763);
    ctx.font = "28px Georgia";
    ctx.fillText(entry.year, 384, 826);
    if (entry.theme === "aws-cloud-quest" && !reverse) {
      const awsGradient = ctx.createLinearGradient(0, 0, 768, 1024);
      awsGradient.addColorStop(0, "#103c48");
      awsGradient.addColorStop(0.58, "#194b4b");
      awsGradient.addColorStop(1, "#366849");
      ctx.fillStyle = awsGradient;
      ctx.fillRect(0, 0, 768, 1024);
      ctx.fillStyle = "#f2f0e7";
      ctx.font = "bold 124px Arial";
      ctx.fillText("aws", 384, 276);
      ctx.strokeStyle = "#ff9900";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(307, 296);
      ctx.quadraticCurveTo(383, 351, 471, 299);
      ctx.stroke();
      ctx.fillStyle = "#ff9900";
      ctx.beginPath();
      ctx.moveTo(449, 296);
      ctx.lineTo(480, 288);
      ctx.lineTo(470, 320);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#f2f0e7";
      ctx.font = "46px Arial";
      ctx.fillText("CLOUD QUEST", 384, 449);
      ctx.strokeStyle = "#d3dfd4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(135, 489);
      ctx.lineTo(633, 489);
      ctx.stroke();
      ctx.font = "64px Arial";
      ctx.fillText("Cloud", 384, 585);
      ctx.fillText("Practitioner", 384, 664);
      ctx.fillStyle = "#0d3541";
      ctx.fillRect(0, 722, 768, 126);
      ctx.fillStyle = "#f2f0e7";
      ctx.font = "43px Arial";
      ctx.fillText("TRAINED", 384, 802);
      if (entry.kind === "reference") {
        ctx.fillStyle = "#d3dfd4";
        ctx.font = "18px Arial";
        ctx.fillText("REFERENCE PREVIEW", 384, 900);
      }
    }
    if (entry.theme === "trend-micro") {
      // Use the supplied logo unchanged, with its red background across the face.
      let red = "#ef1b23";
      if (logo) {
        ctx.drawImage(logo, 0, 0);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        red = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      }
      ctx.fillStyle = red;
      ctx.fillRect(0, 0, 768, 1024);
      if (logo) {
        ctx.drawImage(logo, 64, 170, 640, (640 * logo.height) / logo.width);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 70px Arial";
        ctx.fillText("TREND", 384, 330);
        ctx.font = "44px Arial";
        ctx.fillText("M I C R O", 384, 390);
      }
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 118px Arial";
      ctx.fillText(reverse ? "JB" : "uCTF", 384, 625);
      ctx.font = "30px Arial";
      ctx.fillText(
        reverse
          ? "JEZREEL BORLONGAN"
          : entry.badgeLines.join(" / ").toUpperCase(),
        384,
        691,
        620,
      );
      ctx.font = "bold 46px Arial";
      ctx.fillText(entry.year, 384, 777);
      ctx.font = "19px Arial";
      ctx.fillText(certificateLabel(entry).toUpperCase(), 384, 834);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    textures.push(texture);
    return texture;
  };

  const render = () => {
    if (!disposed) renderer.render(scene, camera);
  };
  let scrollProgress = 0;
  let spinAngle = 0;
  let manualAngle = 0;
  const applyPose = () => {
    const phase = scrollProgress * Math.PI * 2;
    badge.rotation.set(
      Math.sin(phase) * 0.1,
      -0.28 + phase + spinAngle + manualAngle,
      -0.035 + Math.sin(phase) * 0.045,
    );
    badge.position.y = Math.sin(scrollProgress * Math.PI) * 0.07;
    render();
  };
  const update = async (entry: Certificate) => {
    const currentRevision = ++revision;
    textures.splice(0).forEach((texture) => texture.dispose());
    metal.color.set(
      entry.theme === "trend-micro"
        ? "#f5dddd"
        : entry.theme === "python"
          ? "#ffd343"
          : entry.accent,
    );
    metal.metalness = entry.theme === "aws-cloud-quest" ? 0.4 : 0.72;
    if (frontMaterial instanceof THREE.MeshStandardMaterial)
      frontMaterial.roughness = entry.theme === "aws-cloud-quest" ? 0.8 : 0.72;
    frontMaterial.map = drawTexture(entry, false);
    backMaterial.map = drawTexture(entry, true);
    frontMaterial.needsUpdate = backMaterial.needsUpdate = true;
    applyPose();
    if (entry.logoImage) {
      const logo = new Image();
      logo.src = entry.logoImage;
      try {
        await logo.decode();
        if (disposed || currentRevision !== revision) return;
        textures.splice(0).forEach((texture) => texture.dispose());
        frontMaterial.map = drawTexture(entry, false, logo);
        backMaterial.map = drawTexture(entry, true, logo);
        frontMaterial.needsUpdate = backMaterial.needsUpdate = true;
        render();
      } catch {
        // Keep the generated face if the optional logo cannot load.
      }
    }
    if (entry.badgeImage) {
      try {
        const texture = await new THREE.TextureLoader().loadAsync(
          entry.badgeImage,
        );
        if (disposed || currentRevision !== revision) {
          texture.dispose();
          return;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        textures.push(texture);
        frontMaterial.map = texture;
        frontMaterial.needsUpdate = true;
        render();
      } catch {
        /* Keep the readable generated badge if artwork fails. */
      }
    }
  };

  let playing = true;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false;
  let frame = 0;
  let lastTime = 0;
  let dragging = false;
  let lastX = 0;
  let activePointer: number | null = null;
  let lastMoveTime = 0;
  let dragVelocity = 0;
  let momentum = 0;
  const friction = 1.6;
  const tick = (time: number) => {
    const delta = Math.min((time - lastTime) / 1000, 0.04);
    lastTime = time;
    if (!dragging) {
      // Integrate exponential friction so flicks feel the same at any frame rate.
      const decay = Math.exp(-friction * delta);
      spinAngle =
        (spinAngle + delta * 0.3 + (momentum * (1 - decay)) / friction) %
        (Math.PI * 2);
      momentum *= decay;
      if (Math.abs(momentum) < 0.005) momentum = 0;
      applyPose();
    }
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    if (motion.matches || !visible || document.hidden || !playing) {
      momentum = 0;
      dragVelocity = 0;
    }
    if (
      playing &&
      !motion.matches &&
      visible &&
      !document.hidden &&
      !disposed
    ) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    } else render();
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(host);
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 0.85 ? 9.2 : 8.4;
    camera.updateProjectionMatrix();
    render();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const down = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary || dragging) return;
    dragging = true;
    activePointer = event.pointerId;
    momentum = 0;
    dragVelocity = 0;
    lastMoveTime = event.timeStamp;
    lastX = event.clientX;
    host.setPointerCapture(event.pointerId);
    host.dataset.dragging = "true";
  };
  const move = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== activePointer) return;
    const angle = (event.clientX - lastX) * 0.012;
    const elapsed = Math.max((event.timeStamp - lastMoveTime) / 1000, 0.008);
    const velocity = THREE.MathUtils.clamp(angle / elapsed, -18, 18);
    dragVelocity = THREE.MathUtils.lerp(dragVelocity, velocity, 0.65);
    manualAngle += angle;
    lastX = event.clientX;
    lastMoveTime = event.timeStamp;
    applyPose();
  };
  const up = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== activePointer) return;
    momentum =
      event.type === "pointerup" &&
      !motion.matches &&
      event.timeStamp - lastMoveTime < 100
        ? dragVelocity
        : 0;
    dragging = false;
    activePointer = null;
    dragVelocity = 0;
    host.dataset.dragging = "false";
    if (host.hasPointerCapture(event.pointerId))
      host.releasePointerCapture(event.pointerId);
  };
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("lostpointercapture", up);
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
  const ready = update(initial);

  return {
    ready,
    update,
    setScrollProgress(progress) {
      scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
      applyPose();
    },
    setPlaying(value) {
      playing = value;
      sync();
    },
    rotate(amount) {
      momentum = 0;
      manualAngle += amount;
      applyPose();
    },
    reset() {
      momentum = 0;
      scrollProgress = spinAngle = manualAngle = 0;
      applyPose();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      host.removeEventListener("lostpointercapture", up);
      bodyGeometry.dispose();
      faceGeometry.dispose();
      metal.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      coatingMaterial.dispose();
      faceSurface.dispose();
      edgeSurface.dispose();
      edgeColor.dispose();
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
