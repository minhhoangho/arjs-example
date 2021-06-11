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

class ArAwesome {
  constructor() {
    this.scene = null;
    this.arSource = null;
    this.arContext = null;
    this.arMarker = null;
    this.camera = null;
    this.renderer = null;
    this.angle = 0;
  }
  createScene() {
    this.scene = new THREE.Scene();
    this.scene.visible = false;
  }
  createCamera() {
    this.camera = new THREE.Camera();
    this.scene.add(this.camera);
  }

  createRenderer() {
    this.container = document.getElementById('container');
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
  }

  createArSource() {
    this.arSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
    });
  }

  createArContext() {
    this.arContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: './assets/data/camera_para.dat',
      // detectionMode: 'color',
      detectionMode: 'mono',
    });
  }

  createArMarker() {
    this.arMarker = new THREEx.ArMarkerControls(this.arContext, this.camera, {
      type: 'pattern',
      patternUrl: './assets/data/patt2.hiro',
      changeMatrixMode: 'cameraTransformMatrix',
    });
  }

  // Helper
  onResize() {
    // this.arSource.onResize();
    this.arSource.onResizeElement();
    this.arSource.copyElementSizeTo(this.renderer.domElement);
    if (this.arContext.arController !== null) {
      this.arSource.copyElementSizeTo(this.arContext.arController.canvas);
    }
  }

  // Core

  initializeAR() {
    this.createArSource();
    this.createArContext();
    /* handle */
    this.arSource.init(() => {
      this.onResize();
    });
    this.arContext.init(() => {
      this.camera.projectionMatrix.copy(this.arContext.getProjectionMatrix());
    });
    this.createArMarker();
  }

  createLights() {
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
    this.scene.add(hemisphereLight);
    this.scene.add(shadowLight);
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    if (this.arSource.ready === true) {
      this.arContext.update(this.arSource.domElement);
    }
    this.scene.visible = this.camera.visible;
  }

  // Custom
  createProton(radius) {
    //create shape and material
    const geometry = new THREE.SphereGeometry(radius, 100, 100);
    const material = new THREE.MeshLambertMaterial({
      color: 0xdc7d69,
    });
    const proton = new THREE.Mesh(geometry, material);
    this.scene.add(proton);
    return proton;
  }

  createElectron(radius) {
    const geometry = new THREE.SphereGeometry(radius, 100, 100);
    const material = new THREE.MeshLambertMaterial({
      color: 0x134df9,
    });
    const electron = new THREE.Mesh(geometry, material);
    this.scene.add(electron);
    return electron;
  }

  createObjects() {
    this.proton = this.createProton(0.3);
    this.electron = this.createElectron(0.1);
  }

  move(electron) {
    this.angle += 0.1;
    const orbitRadius = 1.5;
    const x = orbitRadius * Math.cos(this.angle);
    const y = orbitRadius * Math.sin(this.angle);
    electron.position.x = x;
    electron.position.y = y;
  }

  setupSceneAndSprite() {
    this.createScene();
    this.createRenderer();
    this.createCamera();
    this.createLights();
    this.createObjects();
    this.initializeAR();
  }

  animation() {
    this.move(this.electron);
  }
}

const arkit = new ArAwesome();
arkit.setupSceneAndSprite();
function main() {
  requestAnimationFrame(main);
  arkit.animation();
  arkit.render();
}

// => start
main();
