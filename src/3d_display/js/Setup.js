function Setup() {
    //SCENE
    this.scene = null;
    this.init_scene();
    
    //CAMERA
    this.camera = null;
    this.init_camera();

    //RENDERER
    this.renderer = null;
    this.init_renderer();

    //LIGHT
    this.light = null;
    this.init_light();

    //BOUGER LA CAMERA
    this.control = null;
    this.init_control();    
}


Setup.prototype.init_scene = function() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#615d5d');
}

Setup.prototype.init_camera = function() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,
					      0.1, 1000);
    this.camera.position.z = 8;
}

Setup.prototype.init_renderer = function() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    console.log(this.renderer);
}

Setup.prototype.init_light = function() {
    this.light = new THREE.DirectionalLight(0xFFFFFF);
   
    this.light.position.z = 4;
    this.light.position.x = 0;
    this.light.position.y = 0;

    this.scene.add(this.light);
}

Setup.prototype.init_control = function() {
    this.control = new THREE.TrackballControls(this.camera);
    this.control.rotateSpeed = 1.7;
}
