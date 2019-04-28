var renderer,
    scene,
    camera,
    container;

var arSource,
    arContext,
    arMarker = [];

var 
    mesh;

init();

function createLights () {
	
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)


	shadowLight = new THREE.DirectionalLight(0xffffff, .9);


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

function createObjects () {
    //create shape and material
      var geometry = new THREE.SphereGeometry(0.5, 100, 100);
      var geometry2 = new THREE.SphereGeometry(0.07, 100, 100);
      var material = new THREE.MeshLambertMaterial({
        color: 0xDC7D69
      });
      var material2 = new THREE.MeshLambertMaterial({
        color: 0x6988DC
      });
    
      proton = new THREE.Mesh(geometry, material);
      electron = new THREE.Mesh(geometry2, material2);
      scene.add(proton)
      electronParent = new THREE.Object3D();
      scene.add(electronParent)
    
      electronParent.add(electron)
      
      // initialize electron position
      proton.position.y = 2
      electronParent.position.y = 2
      electron.position.x = 1.5
    }
function init(){



    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    scene = new THREE.Scene();
    camera = new THREE.Camera();

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    scene.add(camera);
    scene.visible = false;
    createLights()

    createObjects()
    arSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
    });

    arContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: './assets/data/camera_para.dat',
        detectionMode: 'mono',
    });

    arMarker[0] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : './assets/data/patt.hiro',
        changeMatrixMode: 'cameraTransformMatrix'
    });

    arMarker[1] = new THREEx.ArMarkerControls(arContext, camera, {
        type : 'pattern',
        patternUrl : './assets/data/u4bi.patt',
        changeMatrixMode: 'cameraTransformMatrix'
    });





    /* handle */
    arSource.init(function(){
        arSource.onResize();
        arSource.copySizeTo(renderer.domElement);

        if(arContext.arController !== null) arSource.copySizeTo(arContext.arController.canvas);

    });

    arContext.init(function onCompleted(){
        
        camera.projectionMatrix.copy(arContext.getProjectionMatrix());

    });


    render();   
    
}   

function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);                

    if(arSource.ready === false) return;

    arContext.update(arSource.domElement);
    scene.visible = camera.visible;

    electronParent.rotation.z += 0.1

}          
