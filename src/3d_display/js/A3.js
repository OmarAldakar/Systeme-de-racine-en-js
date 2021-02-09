const scale = 2.5;

//INITIALISE LA SCENE
var setup = new Setup();

//INITIALISE LES LISTENERS
setup.control.addEventListener("change",render);

var clicked = false;
var elem = document.getElementsByTagName("canvas")[0];
elem.addEventListener("mousedown",event => {
    clicked = true;
});
elem.addEventListener("mouseup",event => {
    clicked = false;
});    


//CREER LES SPHERES
var d3 = create_D3();
setup.scene.add(d3);

//BOUCLE D'ANIMATION
function animate() {
    
    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 / 60 );

    if (clicked == false) {
	d3.rotation.y += 0.02;
    }
    
    setup.renderer.render( setup.scene, setup.camera );
    setup.control.update();
}
animate();

//ON UPDATE LA VUE
function render () {
    setup.renderer.render(setup.scene, setup.camera);
    setup.light.position.x = setup.camera.position.x / 2;
    setup.light.position.y = setup.camera.position.y / 2;
    setup.light.position.z = setup.camera.position.z / 2;
}

//CREE LA FORME
function create_D3() {
    var sphere_list = Utilities.create_sphere_array(13);    
    var group = new THREE.Group();

    Utilities.add_spheres_to_group(sphere_list,group);
    sphere_list[0].position.set(0,0, 0);
    sphere_list[1].position.set(scale * 1.41,0, 0);
    sphere_list[2].position.set(scale * -0.70, scale * 1.22,0);
    sphere_list[3].position.set(0,scale * -0.81,scale * 1.15);
    sphere_list[4].position.set(scale * 0.7,scale * 1.22,0);
    sphere_list[5].position.set(scale * 0.7,scale * 0.4,scale * 1.15);
    sphere_list[6].position.set(scale * -0.7,scale * 0.4,scale * 1.15);
    sphere_list[7].position.set(scale * -1.41,0,0);
    sphere_list[8].position.set(scale * 0.7,scale * -1.22,0);
    sphere_list[9].position.set(0,scale * 0.81,scale * -1.15);
    sphere_list[10].position.set(scale * -0.7,scale * -1.22,0);
    sphere_list[11].position.set(scale * -0.7,scale * -0.40,scale * -1.15);
    sphere_list[12].position.set(scale * 0.7,scale * -0.40,scale * -1.15);

    //POSITIONNE LES SPHERES


    //RELIE LES SPHERES A LA SPHERE DU CENTRE PAR DES CYLINDRES
    for (var i=1; i < sphere_list.length; i++) {
	var mesh = Utilities.connect_spheres(sphere_list[0],sphere_list[i]);
	group.add(mesh);
    }
    
    return group;
}
