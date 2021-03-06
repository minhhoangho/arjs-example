var renderer, // the renderer for the AR app
  scene, // Scence of Threesjs
  camera,
  container;
var angle = 0;
var x, y;
var orbitRadius = 1.7;
var arSource, arContext, arMarker;

//create fps area
(function () {
  var script = document.createElement('script');
  script.onload = function () {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = './assets/stats/stats.js';
  document.head.appendChild(script);
})();

function createScene() {
  scene = new THREE.Scene();
  scene.visible = false;
}

function createCamera() {
  camera = new THREE.Camera();
  scene.add(camera);
}

function createRenderer() {
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
}

function createLights() {
  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

  shadowLight.position.set(150, 350, 350);

  // allow shadow
  shadowLight.castShadow = true;

  // setting observation area of shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  //setting weight of frame
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // add to scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

function createProton(radius) {
  //create shape and material
  const geometry = new THREE.SphereGeometry(radius, 100, 100);
  const material = new THREE.MeshLambertMaterial({
    color: 0xdc7d69,
  });
  proton = new THREE.Mesh(geometry, material);
  scene.add(proton);
}

function createElectron(radius) {
  const geometry = new THREE.SphereGeometry(radius, 100, 100);
  const material = new THREE.MeshLambertMaterial({
    color: 0x134df9,
  });
  electron = new THREE.Mesh(geometry, material);
  scene.add(electron);
}

function createObjects() {
  createProton(0.3);
  createElectron(0.1);
}

function createArSource() {
  arSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
  });
}

function createArContext() {
  arContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: './assets/data/camera_para.dat',
    detectionMode: 'mono',
    
  });
}

function createArMarker() {
  arMarker = new THREEx.ArMarkerControls(arContext, camera, {
    type: 'pattern',
    patternUrl: './assets/data/patt.hiro',
    // patternUrl: './assets/data/pattern-marker.patt',
    changeMatrixMode: 'cameraTransformMatrix',
  });
}

function onResize() {
  arSource.onResize();
  arSource.copySizeTo(renderer.domElement);
  if (arContext.arController !== null) {
    arSource.copySizeTo(arContext.arController.canvas);
  }
}

function initializeAR() {
  createArSource();
  createArContext();
  /* handle */
  arSource.init(function onReady() {
    onResize();
  });
  arContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arContext.getProjectionMatrix());
  });
  createArMarker();
}

function move() {
  angle += 0.1;
  x = orbitRadius * Math.cos(angle);
  y = orbitRadius * Math.sin(angle);
  electron.position.x = x;
  electron.position.y = y;
}

function update() {
  move();
}

function render() {
  renderer.render(scene, camera);
  if (arSource.ready !== false) {
    arContext.update(arSource.domElement);
  }
  scene.visible = camera.visible;
}

function main() {
  requestAnimationFrame(main);
  update();
  render();
}

// Initialize basic source and object with AR view
createScene();
createRenderer();
createCamera();
createLights();
createObjects();
initializeAR();

// => start
main();
