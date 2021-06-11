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

var renderer, scene, camera, container;

var arSource, arContext, arMarker;

var globe;

function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

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

function createObjects() {
  //create shape and material
  globe = new THREE.Group();
  scene.add(globe);
  loader = new THREE.TextureLoader();
  loader.load('./image/land_ocean_ice_cloud_2048.jpg', (texture) => {
    var sphere = new THREE.SphereGeometry(1, 100, 100);
    material = new THREE.MeshBasicMaterial({
      map: texture,
      overdraw: 0.5,
    });
    var mesh = new THREE.Mesh(sphere, material);
    globe.add(mesh);
  });
  globe.position.z = 0.4;
}
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

function update() {
  globe.rotation.y += 0.01;
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
  renderer.render(scene, camera);
  update();
  render();
}

createScene();
createRenderer();
createCamera();
createLights();
createObjects();
initializeAR();

main();
