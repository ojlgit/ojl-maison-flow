import "./styles.css";
import * as THREE from "three";
import { gsap } from "gsap";
import { Howl, Howler } from "howler";

const ROOM_SPACING = 11.5;
const MAX_PROGRESS = 3;

const rooms = [
  {
    id: "tressage",
    kicker: "Salon I",
    title: "Cartier Booth",
    copy: "Warm arches, vitrines, and a central jewelry table.",
    accent: "#fff4cf",
    background: "#b99c76",
    wall: "#bea077",
    trim: "#f5ebd7",
    floor: "#b89478",
    product: "cuff",
    mode: "booth",
    audio: { frequency: 92, overtone: 184, shimmer: 0.18 },
  },
  {
    id: "orbit",
    kicker: "Salon II",
    title: "Gallery Arcade",
    copy: "A side aisle of glowing pillars and curved watch cases.",
    accent: "#fff6da",
    background: "#c4a982",
    wall: "#c8ab80",
    trim: "#fff1d5",
    floor: "#b89478",
    product: "ringStack",
    mode: "arcade",
    audio: { frequency: 138, overtone: 276, shimmer: 0.12 },
  },
  {
    id: "sapphire",
    kicker: "Salon III",
    title: "Moon Branches",
    copy: "A midnight watch garden with bronze branches and a glowing moon.",
    accent: "#f6d990",
    background: "#0b1b2b",
    wall: "#10263b",
    trim: "#8b5a34",
    floor: "#0d1824",
    product: "pendant",
    mode: "moon",
    audio: { frequency: 58, overtone: 232, shimmer: 0.24 },
  },
  {
    id: "panthere",
    kicker: "Salon IV",
    title: "Cloud Runway",
    copy: "Soft clouds, arched ladders, and a watch suspended at the horizon.",
    accent: "#c9def0",
    background: "#edf1ef",
    wall: "#eef0ed",
    trim: "#a8754a",
    floor: "#f4f1eb",
    product: "torque",
    mode: "cloud",
    audio: { frequency: 116, overtone: 348, shimmer: 0.2 },
  },
];

const app = document.querySelector("#app");
app.innerHTML = `
  <div class="gallery-shell">
    <div class="webgl-mount" aria-hidden="true"></div>
    <div class="scene-vignette"></div>
    <button class="sound-toggle" type="button" aria-label="Enable sound">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4Z"></path>
        <path class="sound-wave" d="M16 9.5c1 .8 1.5 1.6 1.5 2.5S17 13.7 16 14.5"></path>
        <path class="sound-wave" d="M18.5 7c1.6 1.4 2.5 3.1 2.5 5s-.9 3.6-2.5 5"></path>
      </svg>
    </button>
    <div class="brand-mark">Cartierflow</div>
    <nav class="progress-rail" aria-label="Gallery rooms">
      ${rooms
        .map((room, index) => `<button class="progress-dot" type="button" aria-label="${room.title}" data-target="${index}"></button>`)
        .join("")}
    </nav>
    <div class="scene-caption">
      <p class="scene-kicker"></p>
      <h1></h1>
      <p class="scene-copy"></p>
    </div>
    <div class="section-index"></div>
  </div>
`;

const mount = document.querySelector(".webgl-mount");
const soundButton = document.querySelector(".sound-toggle");
const soundWavePaths = [...document.querySelectorAll(".sound-wave")];
const progressDots = [...document.querySelectorAll(".progress-dot")];
const caption = {
  kicker: document.querySelector(".scene-kicker"),
  title: document.querySelector(".scene-caption h1"),
  copy: document.querySelector(".scene-copy"),
  index: document.querySelector(".section-index"),
};

const state = {
  progress: 0,
  targetProgress: 0,
  activeIndex: 0,
  audioEnabled: false,
  pointerX: 0,
  pointerY: 0,
  lastTouchY: 0,
};

Howler.volume(0.72);

const scene = new THREE.Scene();
scene.background = new THREE.Color(rooms[0].background);
scene.fog = new THREE.Fog(rooms[0].background, 12, 34);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
  preserveDrawingBuffer: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
mount.appendChild(renderer.domElement);

const roomGroups = rooms.map((room, index) => createRoom(room, index));
const sounds = rooms.map((room) => createSound(room.audio));

const progressTween = gsap.quickTo(state, "progress", {
  duration: 1.25,
  ease: "power3.out",
  onUpdate: () => updateCamera(),
});

resize();
updateCaption(0);
updateCamera();
renderer.setAnimationLoop(render);

window.addEventListener("resize", resize);
window.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("touchstart", onTouchStart, { passive: false });
window.addEventListener("touchmove", onTouchMove, { passive: false });
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("keydown", onKeyDown);

soundButton.addEventListener("click", async () => {
  state.audioEnabled = !state.audioEnabled;
  soundButton.setAttribute("aria-label", state.audioEnabled ? "Disable sound" : "Enable sound");
  soundWavePaths.forEach((path) => {
    path.style.opacity = state.audioEnabled ? "1" : "0";
  });

  if (state.audioEnabled) {
    await Howler.ctx?.resume?.();
    fadeSound(state.activeIndex);
  } else {
    sounds.forEach((sound) => fadeOut(sound));
  }
});

progressDots.forEach((dot, index) => {
  dot.addEventListener("click", () => setTargetProgress(index));
});

function createRoom(room, index) {
  const group = new THREE.Group();
  const baseZ = -index * ROOM_SPACING;
  group.position.z = baseZ;
  group.userData.baseZ = baseZ;

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: room.wall,
    roughness: room.mode === "moon" ? 0.7 : 0.42,
    metalness: 0.03,
  });
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: room.floor,
    roughness: room.mode === "moon" ? 0.82 : 0.46,
    metalness: room.mode === "moon" ? 0.04 : 0.12,
  });
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: room.trim,
    roughness: room.mode === "moon" || room.mode === "cloud" ? 0.36 : 0.24,
    metalness: room.mode === "moon" || room.mode === "cloud" ? 0.55 : 0.28,
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: room.accent,
    transparent: true,
    opacity: room.mode === "moon" ? 0.82 : 0.72,
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.03,
    metalness: 0,
    transmission: 0.72,
    thickness: 0.18,
    transparent: true,
    opacity: 0.32,
  });

  if (room.mode === "booth" || room.mode === "arcade") {
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(14.6, 5.8, 0.2), wallMaterial);
    backWall.position.set(0, 2.05, -3.45);
    backWall.receiveShadow = true;

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.24, 5.8, 10.5), wallMaterial);
    leftWall.position.set(-6.15, 2.05, 0.85);
    leftWall.rotation.y = -0.04;
    leftWall.receiveShadow = true;

    const rightWall = leftWall.clone();
    rightWall.position.x = 6.15;
    rightWall.rotation.y = 0.04;

    const floor = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.16, 11.6), floorMaterial);
    floor.position.set(0, -0.08, 1.08);
    floor.receiveShadow = true;

    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.16, 10.5), wallMaterial);
    ceiling.position.set(0, 4.78, 0.65);

    const ceilingGlowL = createGlowStrip(5.0, 0.055, glowMaterial);
    ceilingGlowL.position.set(-3.6, 4.62, -0.1);
    ceilingGlowL.rotation.z = 0.25;
    const ceilingGlowR = ceilingGlowL.clone();
    ceilingGlowR.position.x = 3.6;
    ceilingGlowR.rotation.z = -0.25;

    const centralTable = createDisplayTable(floorMaterial, trimMaterial);
    centralTable.position.set(0, 0.14, -0.4);
    centralTable.scale.set(room.mode === "arcade" ? 0.9 : 1.15, 1, 1);

    const primaryCase = createVitrine(glassMaterial, trimMaterial, glowMaterial);
    primaryCase.position.set(room.mode === "arcade" ? -1.25 : 0, 0.88, -0.45);
    primaryCase.scale.setScalar(1.04);

    const sideCaseA = createVitrine(glassMaterial, trimMaterial, glowMaterial);
    sideCaseA.position.set(-2.7, 0.78, -1.15);
    sideCaseA.scale.setScalar(0.75);
    const sideCaseB = createVitrine(glassMaterial, trimMaterial, glowMaterial);
    sideCaseB.position.set(2.7, 0.78, -1.15);
    sideCaseB.scale.setScalar(0.75);

    const archPositions = [
      [-4.55, -1.9, 0.0],
      [-2.15, -2.55, 0.08],
      [2.15, -2.55, -0.08],
      [4.55, -1.9, 0.0],
    ];
    const arches = archPositions.map(([x, z, rot]) => {
      const arch = createIlluminatedArch(trimMaterial, glowMaterial, room.mode === "arcade" ? 1.1 : 0.95);
      arch.position.set(x, 0.14, z);
      arch.rotation.y = rot;
      return arch;
    });

    const portalLeft = createIlluminatedArch(trimMaterial, glowMaterial, 1.08);
    portalLeft.position.set(-5.25, 0.14, 1.25);
    portalLeft.rotation.y = Math.PI / 2;
    const portalRight = createIlluminatedArch(trimMaterial, glowMaterial, 1.08);
    portalRight.position.set(5.25, 0.14, 1.25);
    portalRight.rotation.y = -Math.PI / 2;

    const wallArt = createWallArt(trimMaterial);
    wallArt.position.set(room.mode === "arcade" ? 2.65 : -3.1, 2.2, -3.32);

    group.add(
      backWall,
      leftWall,
      rightWall,
      floor,
      ceiling,
      ceilingGlowL,
      ceilingGlowR,
      centralTable,
      primaryCase,
      sideCaseA,
      sideCaseB,
      portalLeft,
      portalRight,
      wallArt,
      ...arches,
    );

    group.userData.leftDoor = arches[1];
    group.userData.rightDoor = arches[2];
  } else {
    const sky = new THREE.Mesh(new THREE.BoxGeometry(16, 7.2, 0.2), wallMaterial);
    sky.position.set(0, 2.15, -4.6);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.1, 12), floorMaterial);
    floor.position.set(0, -1.15, 0.6);
    floor.visible = false;
    floor.receiveShadow = true;

    const cloudA = createCloudCluster();
    cloudA.position.set(-2.2, 0.35, -0.8);
    cloudA.scale.setScalar(room.mode === "cloud" ? 1.15 : 0.75);
    const cloudB = createCloudCluster();
    cloudB.position.set(2.3, 0.25, -1.65);
    cloudB.scale.setScalar(room.mode === "cloud" ? 1.35 : 0.65);
    const cloudC = createCloudCluster();
    cloudC.position.set(0.1, 2.85, -3.2);
    cloudC.scale.setScalar(room.mode === "cloud" ? 0.7 : 0.45);

    const moon = new THREE.Mesh(new THREE.SphereGeometry(room.mode === "moon" ? 0.58 : 0.36, 48, 32), glowMaterial);
    moon.position.set(room.mode === "moon" ? -1.1 : 1.1, room.mode === "moon" ? 2.25 : 2.8, -2.95);
    const moonLight = new THREE.PointLight(room.accent, room.mode === "moon" ? 36 : 16, 7.2, 1.2);
    moonLight.position.copy(moon.position);

    const branchA = new THREE.Mesh(createBranchGeometry(index, 1), trimMaterial);
    branchA.position.set(0.1, 1.35, -1.5);
    branchA.castShadow = true;
    const branchB = new THREE.Mesh(createBranchGeometry(index, -1), trimMaterial);
    branchB.position.set(0.6, 2.6, -2.6);
    branchB.scale.setScalar(0.82);
    branchB.castShadow = true;

    const ladder = createLadder(trimMaterial);
    ladder.position.set(room.mode === "cloud" ? 1.5 : -1.6, 0.35, -0.9);
    ladder.rotation.set(-0.2, room.mode === "cloud" ? -0.55 : 0.38, 0.2);
    ladder.scale.setScalar(room.mode === "cloud" ? 1.15 : 0.85);

    group.add(sky, floor, cloudA, cloudB, cloudC, moon, moonLight, branchA, branchB, ladder);
    group.userData.leftDoor = branchA;
    group.userData.rightDoor = branchB;
  }

  group.userData.leftDoorBase = group.userData.leftDoor.position.clone();
  group.userData.rightDoorBase = group.userData.rightDoor.position.clone();
  group.userData.leftDoorBaseRot = group.userData.leftDoor.rotation.y;
  group.userData.rightDoorBaseRot = group.userData.rightDoor.rotation.y;
  group.userData.openScale = room.mode === "booth" || room.mode === "arcade" ? 0.32 : 0.58;
  group.userData.openRot = room.mode === "booth" || room.mode === "arcade" ? 0.05 : 0.12;

  const product = createProduct(room);
  product.position.set(room.mode === "cloud" ? 1.15 : 0, room.mode === "booth" || room.mode === "arcade" ? 1.42 : 1.78, -0.72);
  product.scale.setScalar(room.mode === "booth" || room.mode === "arcade" ? 1.18 : 1.48);
  group.userData.product = product;

  const ambient = new THREE.HemisphereLight(0xffffff, room.floor, room.mode === "moon" ? 0.52 : 0.86);
  const key = new THREE.SpotLight(room.accent, room.mode === "moon" ? 92 : 142, 13, 0.48, 0.58, 1.35);
  key.position.set(room.mode === "cloud" ? 2.2 : -2.2, 4.3, 2.9);
  key.target.position.set(product.position.x, 1.22, -0.75);
  key.castShadow = true;
  key.shadow.mapSize.width = 2048;
  key.shadow.mapSize.height = 2048;

  const rim = new THREE.SpotLight(0xffffff, 54, 9, 0.42, 0.44, 1.45);
  rim.position.set(2.65, 3.2, 2.1);
  rim.target.position.set(product.position.x, 1.28, -0.65);

  const backGlow = new THREE.PointLight(room.accent, room.mode === "moon" ? 20 : 13, 7, 1.3);
  backGlow.position.set(0, 2.05, -2.6);

  group.add(
    product,
    ambient,
    key,
    key.target,
    rim,
    rim.target,
    backGlow,
  );
  scene.add(group);
  return group;
}

function createProduct(room) {
  const product = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: 0xe5c06a, metalness: 0.96, roughness: 0.16 });
  const roseGold = new THREE.MeshStandardMaterial({ color: 0xf0b56d, metalness: 0.94, roughness: 0.12 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x17110d, metalness: 0.48, roughness: 0.24 });
  const crystal = new THREE.MeshPhysicalMaterial({
    color: room.accent,
    roughness: 0.035,
    transmission: 0.5,
    thickness: 0.52,
    transparent: true,
    opacity: 0.84,
  });
  const diamond = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.02,
    transmission: 0.72,
    thickness: 0.36,
    transparent: true,
    opacity: 0.88,
  });

  if (room.product === "cuff") {
    const bandA = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.055, 32, 180), gold);
    const bandB = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.055, 32, 180), roseGold);
    bandA.rotation.set(Math.PI / 2, 0.05, 0);
    bandB.rotation.set(Math.PI / 2, -0.05, 0);
    bandA.scale.set(1, 0.56, 1);
    bandB.scale.set(1, 0.56, 1);
    bandA.position.x = -0.08;
    bandB.position.x = 0.08;
    product.add(bandA, bandB);
    addGemRow(product, diamond, -0.18, 0.54, 20);
    addGemRow(product, diamond, 0.18, 0.54, 20);
  }

  if (room.product === "ringStack") {
    for (let i = 0; i < 3; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62 + i * 0.07, 0.055, 30, 180), i === 1 ? roseGold : gold);
      ring.rotation.set(Math.PI / 2, 0.08 * i, 0.18 - i * 0.12);
      ring.position.y = (i - 1) * 0.09;
      product.add(ring);
    }
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 3), crystal);
    gem.position.y = 0.64;
    product.add(gem);
    addGemHalo(product, diamond, 0.58, 22);
  }

  if (room.product === "pendant") {
    const chain = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.025, 20, 180), gold);
    chain.rotation.x = Math.PI / 2;
    chain.scale.y = 1.38;
    chain.position.y = 0.42;
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 4), crystal);
    body.scale.set(0.86, 1.24, 0.86);
    body.position.y = -0.18;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.18, 36), gold);
    cap.position.y = 0.38;
    product.add(chain, body, cap);
    addGemHalo(product, diamond, 0.48, 18);
  }

  if (room.product === "torque") {
    const torque = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.07, 34, 180, Math.PI * 1.58), gold);
    torque.rotation.set(Math.PI / 2.35, 0, -0.6);
    const endA = new THREE.Mesh(new THREE.SphereGeometry(0.18, 48, 32), crystal);
    const endB = endA.clone();
    endA.position.set(-0.58, 0.36, 0.04);
    endB.position.set(0.68, -0.22, 0.04);
    const inlay = new THREE.Mesh(new THREE.TorusGeometry(0.79, 0.018, 18, 180, Math.PI * 1.58), dark);
    inlay.rotation.copy(torque.rotation);
    product.add(torque, inlay, endA, endB);
  }

  product.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return product;
}

function onWheel(event) {
  event.preventDefault();
  const normalized = event.deltaY / Math.max(window.innerHeight, 640);
  setTargetProgress(state.targetProgress + normalized * 1.45);
}

function onTouchStart(event) {
  event.preventDefault();
  state.lastTouchY = event.touches[0]?.clientY ?? 0;
}

function onTouchMove(event) {
  event.preventDefault();
  const nextY = event.touches[0]?.clientY ?? state.lastTouchY;
  const delta = state.lastTouchY - nextY;
  state.lastTouchY = nextY;
  setTargetProgress(state.targetProgress + (delta / Math.max(window.innerHeight, 640)) * 1.55);
}

function onPointerMove(event) {
  state.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  state.pointerY = -((event.clientY / window.innerHeight - 0.5) * 2);
}

function onKeyDown(event) {
  if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    setTargetProgress(Math.round(state.targetProgress + 1));
  }
  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    setTargetProgress(Math.round(state.targetProgress - 1));
  }
}

function setTargetProgress(value) {
  state.targetProgress = THREE.MathUtils.clamp(value, 0, MAX_PROGRESS);
  progressTween(state.targetProgress);
}

function updateCamera() {
  const progress = THREE.MathUtils.clamp(state.progress, 0, MAX_PROGRESS);
  const baseIndex = Math.min(Math.floor(progress), rooms.length - 1);
  const local = progress - baseIndex;
  const activeIndex = THREE.MathUtils.clamp(Math.round(progress), 0, rooms.length - 1);
  const cameraZ = 7.1 - progress * ROOM_SPACING;
  const targetRoomIndex = THREE.MathUtils.clamp(baseIndex + smoothstep(0.68, 1, local), 0, rooms.length - 1);
  const targetZ = -targetRoomIndex * ROOM_SPACING - 0.62;
  const currentRoom = rooms[activeIndex];
  const bg = new THREE.Color(currentRoom.background);

  camera.position.set(state.pointerX * 0.18, 1.48 + state.pointerY * 0.08 - local * 0.12, cameraZ);
  camera.lookAt(state.pointerX * 0.08, 1.22 + state.pointerY * 0.04, targetZ);
  scene.background.lerp(bg, 0.08);
  scene.fog.color.lerp(bg, 0.08);

  roomGroups.forEach((group, index) => {
    const roomLocal = THREE.MathUtils.clamp(progress - index, -1, 1);
    const open = smoothstep(-0.1, 0.58, roomLocal);
    const distance = Math.abs(progress - index);
    const visible = distance < 1.28 && progress - index < 0.78;
    group.visible = visible;
    group.position.x = (index - progress) * 0.05;
    group.rotation.y = Math.sin((performance.now() / 1000) * 0.15 + index) * 0.008;
    group.userData.leftDoor.position.x = group.userData.leftDoorBase.x - open * group.userData.openScale;
    group.userData.rightDoor.position.x = group.userData.rightDoorBase.x + open * group.userData.openScale;
    group.userData.leftDoor.rotation.y = group.userData.leftDoorBaseRot - open * group.userData.openRot;
    group.userData.rightDoor.rotation.y = group.userData.rightDoorBaseRot + open * group.userData.openRot;
    group.userData.product.rotation.y = progress * 1.2 + index * 0.22 + state.pointerX * 0.1;
    group.userData.product.position.y = 1.34 + Math.sin(performance.now() / 900 + index) * 0.035;
  });

  if (activeIndex !== state.activeIndex) {
    state.activeIndex = activeIndex;
    updateCaption(activeIndex);
    fadeSound(activeIndex);
  }

  progressDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeIndex);
  });
}

function updateCaption(index) {
  const room = rooms[index];
  caption.kicker.textContent = room.kicker;
  caption.title.textContent = room.title;
  caption.copy.textContent = room.copy;
  caption.index.textContent = String(index + 1).padStart(2, "0");
}

function render() {
  updateCamera();
  renderer.render(scene, camera);
}

function resize() {
  const width = mount.clientWidth || window.innerWidth;
  const height = mount.clientHeight || window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function createSound(audio) {
  return {
    howl: new Howl({
      src: [createAmbientWav(audio)],
      format: ["wav"],
      loop: true,
      volume: 0,
      preload: true,
      onunlock: () => {
        if (state.audioEnabled) {
          fadeSound(state.activeIndex);
        }
      },
    }),
    id: null,
  };
}

function fadeSound(index) {
  if (!state.audioEnabled) {
    return;
  }
  sounds.forEach((sound, soundIndex) => {
    if (soundIndex === index) {
      if (!sound.howl.playing()) {
        sound.id = sound.howl.play();
      }
      sound.howl.fade(sound.howl.volume(sound.id) || 0, 0.42, 900, sound.id);
    } else {
      fadeOut(sound);
    }
  });
}

function fadeOut(sound) {
  if (!sound.id) {
    return;
  }
  sound.howl.fade(sound.howl.volume(sound.id) || 0.42, 0, 700, sound.id);
}

function createGlowStrip(length, radius, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(length, radius, radius), material);
  mesh.renderOrder = 2;
  return mesh;
}

function createDisplayTable(surfaceMaterial, trimMaterial) {
  const table = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.58, 0.18, 128), surfaceMaterial);
  top.position.y = 0.58;
  top.scale.z = 0.42;
  top.castShadow = true;
  top.receiveShadow = true;

  const lip = new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.035, 14, 128), trimMaterial);
  lip.position.y = 0.69;
  lip.scale.set(1.28, 0.5, 1);
  lip.rotation.x = Math.PI / 2;

  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.075, 1.18, 24), trimMaterial);
    leg.position.set(Math.cos(angle) * 1.68, 0.02, Math.sin(angle) * 0.56);
    leg.rotation.x = Math.sin(angle) * 0.08;
    leg.rotation.z = -Math.cos(angle) * 0.08;
    leg.castShadow = true;
    table.add(leg);
  }

  table.add(top, lip);
  return table;
}

function createVitrine(glassMaterial, trimMaterial, glowMaterial) {
  const vitrine = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.28, 64, 1, true), glassMaterial);
  glass.position.y = 0.56;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.5, 0.08, 64), trimMaterial);
  base.position.y = -0.1;
  const cap = base.clone();
  cap.position.y = 1.22;
  const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.025, 64), glowMaterial);
  glow.position.y = 0.02;

  const object = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.42, 4), new THREE.MeshStandardMaterial({
    color: 0xf7f1df,
    roughness: 0.24,
    metalness: 0.08,
  }));
  object.position.y = 0.28;
  object.rotation.y = Math.PI / 4;
  object.castShadow = true;

  vitrine.add(glass, base, cap, glow, object);
  return vitrine;
}

function createIlluminatedArch(trimMaterial, glowMaterial, scale = 1) {
  const arch = new THREE.Group();
  const leftColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.72, 28), trimMaterial);
  leftColumn.position.set(-0.62 * scale, 1.24, 0);
  const rightColumn = leftColumn.clone();
  rightColumn.position.x = 0.62 * scale;
  const lightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.55, 0.035), glowMaterial);
  lightLeft.position.set(-0.62 * scale, 1.28, 0.055);
  const lightRight = lightLeft.clone();
  lightRight.position.x = 0.62 * scale;

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.62 * scale, 2.52, 0),
    new THREE.Vector3(-0.42 * scale, 3.04, 0),
    new THREE.Vector3(0, 3.18, 0),
    new THREE.Vector3(0.42 * scale, 3.04, 0),
    new THREE.Vector3(0.62 * scale, 2.52, 0),
  ]);
  const archTube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.07, 18, false), trimMaterial);
  const archGlow = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.024, 12, false), glowMaterial);
  archGlow.position.z = 0.055;

  arch.add(leftColumn, rightColumn, lightLeft, lightRight, archTube, archGlow);
  arch.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });
  return arch;
}

function createWallArt(material) {
  const art = new THREE.Group();
  const colors = [0xd7532f, 0xf0b43c, 0x111111, 0xebe2d1];
  for (let i = 0; i < 12; i += 1) {
    const stroke = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.54 + (i % 3) * 0.16, 0.035), new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      roughness: 0.32,
      metalness: 0.05,
    }));
    stroke.position.set((i % 4) * 0.34, Math.floor(i / 4) * 0.36, 0);
    stroke.rotation.z = -0.9 + (i % 5) * 0.38;
    art.add(stroke);
  }
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.6, 0.025), material);
  frame.position.set(0.52, 0.36, -0.03);
  frame.scale.z = 0.2;
  art.add(frame);
  return art;
}

function createCloudCluster() {
  const cloud = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.86,
    metalness: 0,
    transparent: true,
    opacity: 0.82,
  });
  const positions = [
    [-0.55, 0, 0, 0.55],
    [-0.16, 0.12, 0.06, 0.72],
    [0.34, 0.04, -0.02, 0.62],
    [0.75, -0.06, 0.04, 0.46],
    [0, -0.14, 0.08, 0.58],
  ];
  positions.forEach(([x, y, z, scale]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(scale, 24, 16), material);
    puff.position.set(x, y, z);
    puff.scale.y = 0.58;
    cloud.add(puff);
  });
  return cloud;
}

function createBranchGeometry(index, direction) {
  const sign = direction * (index % 2 === 0 ? 1 : -1);
  const points = [
    new THREE.Vector3(-4.4 * sign, 0.1, 1.1),
    new THREE.Vector3(-2.7 * sign, 0.72, 0.45),
    new THREE.Vector3(-1.1 * sign, 1.4, -0.38),
    new THREE.Vector3(0.75 * sign, 1.75, -0.95),
    new THREE.Vector3(3.7 * sign, 1.35, -1.9),
  ];
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 120, 0.075, 16, false);
}

function createLadder(material) {
  const ladder = new THREE.Group();
  const sideA = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 3.2, 18), material);
  const sideB = sideA.clone();
  sideA.position.x = -0.28;
  sideB.position.x = 0.28;
  sideA.rotation.z = -0.16;
  sideB.rotation.z = -0.16;
  ladder.add(sideA, sideB);
  for (let i = 0; i < 8; i += 1) {
    const rung = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.035), material);
    rung.position.y = -1.34 + i * 0.38;
    rung.rotation.z = -0.16;
    ladder.add(rung);
  }
  return ladder;
}

function createRibbonGeometry(index) {
  const sign = index % 2 === 0 ? 1 : -1;
  const points = [
    new THREE.Vector3(-3.3 * sign, 0.15, 0.4),
    new THREE.Vector3(-1.7 * sign, 0.85, -0.1),
    new THREE.Vector3(-0.45 * sign, 1.85, -0.75),
    new THREE.Vector3(0.72 * sign, 2.34, -0.82),
    new THREE.Vector3(2.9 * sign, 0.35, 0.2),
  ];
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 128, 0.055, 18, false);
}

function addGemRow(group, material, offsetX, radius, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 1), material);
    gem.position.set(offsetX, Math.sin(angle) * radius * 0.54, Math.cos(angle) * radius);
    gem.rotation.set(angle, angle * 0.3, 0);
    group.add(gem);
  }
}

function addGemHalo(group, material, radius, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.045, 1), material);
    gem.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.7, 0.03);
    gem.rotation.set(angle * 0.2, angle, 0);
    group.add(gem);
  }
}

function smoothstep(edge0, edge1, value) {
  const x = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function createAmbientWav({ frequency, overtone, shimmer }) {
  const sampleRate = 22050;
  const seconds = 2.4;
  const sampleCount = Math.floor(sampleRate * seconds);
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + sampleCount * bytesPerSample);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + sampleCount * bytesPerSample, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, sampleCount * bytesPerSample, true);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const envelope = 0.55 + Math.sin((Math.PI * 2 * t) / seconds) * 0.08;
    const carrier = Math.sin(Math.PI * 2 * frequency * t);
    const harmonic = Math.sin(Math.PI * 2 * overtone * t + Math.sin(t * 0.7) * shimmer);
    const air = Math.sin(Math.PI * 2 * (frequency * 0.5) * t + Math.sin(t * 1.5) * 0.3);
    const sample = (carrier * 0.18 + harmonic * 0.08 + air * 0.05) * envelope;
    view.setInt16(44 + i * bytesPerSample, Math.max(-1, Math.min(1, sample)) * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }

  return `data:audio/wav;base64,${btoa(binary)}`;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i += 1) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
