import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Plane,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Raycaster,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

const layers = [
  { x: -0.78, y: 0.9, z: 0.02 },
  { x: 0, y: 0, z: 0 },
  { x: 0.78, y: -0.9, z: -0.02 },
];

export function createHeroScene({ host, canvas, context, pointer, initialStage = 0, onStageChange = () => {} }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, context });
  } catch (error) {
    console.warn('Hero 3D scene could not start; showing the static scene instead.', error);
    return undefined;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(4.25, 3.35, 7.6);
  camera.lookAt(0, 0, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.matchMedia('(max-width: 700px)').matches ? 1.25 : 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  scene.add(new HemisphereLight(0xb9d1ff, 0x10151c, 1.8));

  const keyLight = new DirectionalLight(0xe4efff, 3.4);
  keyLight.position.set(-3.5, 5, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512);
  keyLight.shadow.camera.left = -4;
  keyLight.shadow.camera.right = 4;
  keyLight.shadow.camera.top = 4;
  keyLight.shadow.camera.bottom = -4;
  keyLight.shadow.bias = -0.0004;
  scene.add(keyLight);

  const blueLight = new PointLight(0x397dff, 16, 8, 2);
  blueLight.position.set(-3, 1.2, 2.4);
  scene.add(blueLight);

  const warmLight = new PointLight(0xff805f, 8, 6, 2);
  warmLight.position.set(2.8, -1.5, 1.8);
  scene.add(warmLight);

  const model = new Group();
  model.rotation.set(-0.08, 0.1, -0.025);
  scene.add(model);
  const stagePositions = layers.map((layer) => new Vector3(layer.x + 0.52, layer.y + 0.3, layer.z + 0.58));
  const stageIndex = Math.max(0, Math.min(layers.length - 1, initialStage));
  const targetDecks = [];

  const deckGeometry = new BoxGeometry(2.65, 0.34, 1.72);
  const deckMaterial = new MeshPhysicalMaterial({
    color: 0x172230,
    metalness: 0.7,
    roughness: 0.29,
    clearcoat: 0.8,
    clearcoatRoughness: 0.23,
  });
  const edgeGeometry = new EdgesGeometry(deckGeometry);
  const deckEdgeMaterial = new LineBasicMaterial({ color: 0x6786b6, transparent: true, opacity: 0.72 });
  const coreGeometry = new IcosahedronGeometry(0.22, 1);
  const portGeometry = new CylinderGeometry(0.04, 0.04, 0.035, 12);
  const portMaterial = new MeshStandardMaterial({ color: 0x8dbaff, emissive: 0x214b90, emissiveIntensity: 1.2, metalness: 0.45, roughness: 0.32 });
  const coreMaterials = [
    new MeshStandardMaterial({ color: 0x9ac4ff, emissive: 0x367cff, emissiveIntensity: 1.6, metalness: 0.28, roughness: 0.24 }),
    new MeshStandardMaterial({ color: 0x9affeb, emissive: 0x31baa9, emissiveIntensity: 1.4, metalness: 0.3, roughness: 0.24 }),
    new MeshStandardMaterial({ color: 0xffc2a7, emissive: 0xff704a, emissiveIntensity: 1.35, metalness: 0.25, roughness: 0.26 }),
  ];
  const coreNodes = [];

  layers.forEach((layer, index) => {
    const deck = new Mesh(deckGeometry, deckMaterial);
    deck.position.set(layer.x, layer.y, layer.z);
    deck.castShadow = true;
    deck.receiveShadow = true;
    deck.userData.layerIndex = index;
    model.add(deck);
    targetDecks.push(deck);

    const edge = new Mesh(edgeGeometry, deckEdgeMaterial);
    edge.position.copy(deck.position);
    model.add(edge);

    const core = new Mesh(coreGeometry, coreMaterials[index]);
    core.position.set(layer.x, layer.y + 0.34, layer.z + 0.03);
    core.castShadow = true;
    model.add(core);
    coreNodes.push(core);

    [-0.88, -0.68, -0.48].forEach((offset, portIndex) => {
      const port = new Mesh(portGeometry, portIndex === 2 ? coreMaterials[index] : portMaterial);
      port.position.set(layer.x + offset, layer.y + 0.19, layer.z + 0.48);
      model.add(port);
    });
  });

  const route = new CatmullRomCurve3([
    stagePositions[0],
    new Vector3(-0.3, 1.06, 1.02),
    new Vector3(-0.12, 0.55, 1.08),
    stagePositions[1],
    new Vector3(0.36, -0.27, 1.03),
    new Vector3(0.78, -0.62, 0.98),
    stagePositions[2],
  ]);
  const routeMesh = new Mesh(
    new TubeGeometry(route, 100, 0.022, 8, false),
    new MeshStandardMaterial({ color: 0x6ebcff, emissive: 0x277bff, emissiveIntensity: 1.7, metalness: 0.25, roughness: 0.3 }),
  );
  model.add(routeMesh);

  const request = new Mesh(
    new SphereGeometry(0.16, 24, 18),
    new MeshPhysicalMaterial({ color: 0xd7f2ff, emissive: 0x397dff, emissiveIntensity: 2, metalness: 0.2, roughness: 0.18, clearcoat: 1 }),
  );
  request.position.copy(stagePositions[stageIndex]);
  request.castShadow = true;
  model.add(request);

  const requestRing = new Mesh(
    new TorusGeometry(0.25, 0.016, 8, 36),
    new MeshBasicMaterial({ color: 0x8be7ff }),
  );
  requestRing.rotation.x = 0.35;
  requestRing.position.copy(request.position);
  model.add(requestRing);

  const base = new Mesh(
    new CylinderGeometry(2.15, 2.32, 0.12, 64),
    new MeshStandardMaterial({ color: 0x0d141d, metalness: 0.68, roughness: 0.38 }),
  );
  base.position.set(0, -1.53, 0);
  base.receiveShadow = true;
  base.castShadow = true;
  model.add(base);

  const baseEdge = new Mesh(
    new CylinderGeometry(2.33, 2.37, 0.035, 64),
    new MeshStandardMaterial({ color: 0x27456d, metalness: 0.72, roughness: 0.3, emissive: 0x102e5c, emissiveIntensity: 0.6 }),
  );
  baseEdge.position.set(0, -1.61, 0);
  model.add(baseEdge);

  const floor = new Mesh(
    new CircleGeometry(2.15, 64),
    new MeshStandardMaterial({ color: 0x0d141d, metalness: 0.28, roughness: 0.88 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.46, 0);
  floor.receiveShadow = true;
  model.add(floor);

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    frameInterval = width < 700 ? 1000 / 30 : 1000 / 45;
    camera.aspect = width / height;
    camera.position.z = width < 500 ? 9.2 : 7.6;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };

  let animationFrame = 0;
  let inView = true;
  let selectedStage = stageIndex;
  let dragging = false;
  let moveProgress = 1;
  const moveStart = request.position.clone();
  const moveTarget = request.position.clone();
  const raycaster = new Raycaster();
  const pointerPosition = new Vector2();
  const dragPlane = new Plane();
  const dragIntersection = new Vector3();
  const dragTargets = [request, requestRing];

  const setRayFromEvent = (event) => {
    const bounds = canvas.getBoundingClientRect();
    pointerPosition.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointerPosition, camera);
  };
  const moveToStage = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= stagePositions.length) return;
    selectedStage = index;
    moveStart.copy(request.position);
    moveTarget.copy(stagePositions[index]);
    moveProgress = 0;
    onStageChange(index);
  };
  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    setRayFromEvent(event);
    if (!raycaster.intersectObjects(dragTargets, false).length) return;
    event.preventDefault();
    dragging = true;
    moveProgress = 1;
    host.classList.add('is-dragging');
    const worldPosition = request.getWorldPosition(new Vector3());
    dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new Vector3()), worldPosition);
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    setRayFromEvent(event);
    if (!dragging) {
      canvas.style.cursor = raycaster.intersectObjects(dragTargets, false).length ? 'grab' : 'auto';
      return;
    }
    if (!raycaster.ray.intersectPlane(dragPlane, dragIntersection)) return;
    const localPosition = model.worldToLocal(dragIntersection.clone());
    request.position.set(
      Math.max(-2.2, Math.min(2.2, localPosition.x)),
      Math.max(-1.25, Math.min(1.5, localPosition.y)),
      Math.max(-0.2, Math.min(1.6, localPosition.z)),
    );
    requestRing.position.copy(request.position);
  };
  const onPointerUp = (event) => {
    if (!dragging) return;
    dragging = false;
    host.classList.remove('is-dragging');
    canvas.style.cursor = 'auto';
    setRayFromEvent(event);
    const drop = raycaster.intersectObjects(targetDecks, false)[0];
    if (drop) moveToStage(drop.object.userData.layerIndex);
    else moveToStage(selectedStage);
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  let elapsed = 0;
  let lastFrameTime = 0;
  let frameInterval = host.clientWidth < 700 ? 1000 / 30 : 1000 / 45;
  const stopAnimation = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };
  const draw = (timestamp) => {
    animationFrame = 0;
    if (inView && !document.hidden) {
      if (!lastFrameTime) lastFrameTime = timestamp;
      const frameDuration = timestamp - lastFrameTime;
      if (frameDuration < frameInterval) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }
      const delta = Math.min(frameDuration / 1000, 0.05);
      const frameScale = delta * 60;
      const rotationEase = 1 - Math.pow(1 - 0.035, frameScale);
      lastFrameTime = timestamp;
      elapsed += delta;
      const target = pointer.current;
      model.rotation.x += (-0.08 + target.y * 0.12 - model.rotation.x) * rotationEase;
      model.rotation.y += (0.1 + target.x * 0.17 + Math.sin(elapsed * 0.3) * 0.018 - model.rotation.y) * rotationEase;
      coreNodes[1].rotation.y = elapsed * 0.2;
      if (!dragging && moveProgress < 1) {
        moveProgress = Math.min(1, moveProgress + 0.035 * frameScale);
        const eased = moveProgress * moveProgress * (3 - 2 * moveProgress);
        request.position.lerpVectors(moveStart, moveTarget, eased);
        request.position.y += Math.sin(eased * Math.PI) * 0.22;
      }
      request.scale.setScalar(1 + Math.sin(elapsed * 2.4) * 0.045);
      requestRing.position.copy(request.position);
      requestRing.rotation.z += (dragging ? 0.035 : 0.008) * frameScale;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(draw);
    }
  };
  const startAnimation = () => {
    if (!animationFrame && inView && !document.hidden) {
      animationFrame = window.requestAnimationFrame(draw);
    }
  };
  const onVisibilityChange = () => {
    if (document.hidden) stopAnimation();
    else startAnimation();
  };
  const observer = typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) startAnimation();
      else stopAnimation();
    }, { threshold: 0.05 });
  observer?.observe(host);

  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
  resizeObserver?.observe(host);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  resize();
  startAnimation();

  const dispose = () => {
    stopAnimation();
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    observer?.disconnect();
    resizeObserver?.disconnect();
    const geometries = new Set();
    const materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) {
        const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
        meshMaterials.forEach((material) => materials.add(material));
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
  };
  return { moveToStage, dispose };
}
