function Utilities() {
    
}

Utilities.create_sphere_array = function (len) {
    var sphere_list = [];
    for (var i=0; i < len; i++) {
	sphere_list[i] = Utilities.create_sphere();
    }

    return sphere_list;
}

Utilities.add_spheres_to_group = function (spheres, group) {
    for (var i=0; i < spheres.length ; i++) {
	group.add(spheres[i]);
    }
}

Utilities.connect_spheres = function (s1,s2) {
    var distance = s1.position.distanceTo(s2.position);
    var geometry = new THREE.CylinderGeometry(0.07,0.07,distance,8,1,true);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,distance/2,0));
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));

    var material = new THREE.MeshLambertMaterial({color:0x2c00ff});
    var mesh = new THREE.Mesh(geometry,material);
    mesh.position.copy(s1.position);
    mesh.lookAt(s2.position);
    return mesh;
}

Utilities.create_sphere  = function() {
    var geometry = new THREE.SphereGeometry(0.2, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    var material = new THREE.MeshLambertMaterial({color: 0xff0000});
    return new THREE.Mesh(geometry, material);    
}
