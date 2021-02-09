function Scene(w,h) {
    var elem = document.getElementById('draw-shapes');
    var params = { width: w, height: h };

    this.two = new Two(params).appendTo(elem);
    this.grid = new Grid(this.two);
    this.last_diff = new Two.Vector(0,0);

    this.circle_list = [];
    this.fleche_list = [];

    this.preview_list = [];

    this.shift_down = false;

    this.fleche_buton_pressed = false; //CHANGER LES NOMS
    this.fleche_buton = []; //CHANGER LES NOMS

    this.setKeyDownEvent();
    this.setKeyUpEvent();

    this.generalisation = false;
}


Scene.prototype.setKeyDownEvent = function() {
    document.addEventListener("keydown",event => {
	if (event.key == "Shift")
	    this.shift_down = true;

	event.stopPropagation();
    });
}

Scene.prototype.setKeyUpEvent = function() {
    document.addEventListener("keyup",event => {
	if (event.key == "Shift")
	    this.shift_down = false;

	event.stopPropagation();
    });
}

Scene.prototype.draw = function() {
    this.two.update();
    if (this.grid.grille_set)
	this.grid.draw();
    this.two.add(this.preview_list);

    this.two.update();
}

Scene.prototype.dragAction = function(position) {
    this.two.clear();
    this.last_diff.sub(position,this.last_diff);
    this.grid.update(this.last_diff);

    this.circle_list.forEach(circle => {
	circle.update(this.last_diff);
    });

    this.fleche_list.forEach(fleche => {
	fleche.update(this.last_diff);
    });

    this.last_diff = position;
    this.draw();
}

Scene.prototype.reinitdiff = function() {
    this.last_diff.x = 0;
    this.last_diff.y = 0;
}

Scene.prototype.move_circle = function(circle_obj,position) {
    var circle = circle_obj.circle;

    if (this.shift_down) { //Coordonnées entieres
	var x = (position.x - this.grid.offset.x) / this.grid.width;
	x = Math.round(x);
	circle.translation.x = (x * this.grid.width) + this.grid.offset.x;
	var y = (position.y - this.grid.offset.y) / this.grid.width;
	y = Math.round(y);
	circle.translation.y = (y * this.grid.width) + this.grid.offset.y;
    } else { //Coordonnées normale
	circle.translation.x = position.x;
	circle.translation.y = position.y;
    }

    circle_obj.update_associated_fleches();
    this.two.update();
}

Scene.prototype.add_circle = function(grid_event,x,y) {
    this.circle_list.push((new Circle(this,grid_event,x,y)));
}

Scene.prototype.repetition = function(rep,grid_event,translation) {
    if (this.circle_list.length == 0)
	return;

    var translation_w = this.grid.width * translation;
    
    var min = this.circle_list[0];
    var max = this.circle_list[0];

    for (var i=0; i < this.circle_list.length; i++) {
	var number= this.circle_list[i].circle.translation.x;

	if (number < min.circle.translation.x) {
	    min = this.circle_list[i];
	}

	if (number > max.circle.translation.x) {
	    max = this.circle_list[i];
	}
    }

    var delta = Math.abs(min.circle.translation.x - max.circle.translation.x);
    var length = this.circle_list.length;

    var adjacence_matrice = this.get_adjacent_matrice(length);
    var puissance = math.identity(length);
    var sum = math.zeros(length,length);
    
    for(var i=0; i < length; i++) {
	sum = math.add(puissance,sum);
	puissance = math.multiply(puissance,adjacence_matrice);
    }


    
    for (var i=0; i < length; i++) {
	var circle = this.circle_list[i];
	circle.vector = math.subset(sum,math.index(math.range(0,length),i));
    }
    
    for (var i=1; i <= rep; i++) {
	for (var j=0; j < length; j++) {
	    var x = this.circle_list[j].circle.translation.x;
	    var y = this.circle_list[j].circle.translation.y;
	    this.add_circle(grid_event,x +  i * (delta + translation_w),y);
	}
    }

    for (var i=0; i < this.fleche_list.length; i++) {
	var fleche = this.fleche_list[i];
	var indice = fleche.source.numero + length;
	if (indice < this.circle_list.length) {
	    var new_fleche = new Fleche(this, fleche.but, this.circle_list[indice],
					fleche.nbr_fl2, fleche.nbr_fl1);	    	    
	    scene.fleche_list.push(new_fleche);
	}	
    }

    for (var i=0; i < this.circle_list.length - length; i++) {
	this.determine_tau_x(i+length,length);
    }

    this.circle_list.forEach(circle => {
	var str;
	if (Number.isInteger(circle.vector)) {
	    str = "["+circle.vector+"]"
	} else  {
	    str = "[";
	    var len = circle.vector.size()[0];
	    for (var i=0; i < len - 1; i++) {
		str = str + circle.vector.get([i,0]) + ",";
	    }
	    str = str  + circle.vector.get([i,0] ) + "]";	    
	}

	var p = document.createElement("p");
	var node = document.createTextNode(str);
	p.appendChild(node);

	var elem = document.getElementById("result-div");
	elem.appendChild(p);
	console.log(circle.vector);
    });

    
    
}

Scene.prototype.determine_tau_x = function(indice,length) {
    var tau_x = this.circle_list[indice];

    if (tau_x.vector != null) {
	return;
    }
    
    var x = this.circle_list[indice - length];
    var s_alpha_x = this.fleche_list.filter(fleche => fleche.source == x);

    var sum2 = math.zeros(length,1);
    
    for (var j=0; j < s_alpha_x.length; j++) {
	var vect = s_alpha_x[j].but.vector;

	if (vect == null) {
	    this.determine_tau_x(s_alpha_x[j].but.numero,length);
	    vect = s_alpha_x[j].but.vector;
	}
	vect = math.multiply(vect,s_alpha_x[j].nbr_fl2);	
	sum2 = math.add(sum2,vect);
    }

    sum2 = math.subtract(sum2,x.vector);
    tau_x.vector = sum2;
}

Scene.prototype.get_adjacent_matrice = function(size) {
    var adjacence = math.zeros(size,size);

    for (var i=0; i < size; i++) {
	var sommet = this.circle_list[i];
	var sommet_adjacent = sommet.fleches.filter(fleche => fleche.source == sommet);
	sommet_adjacent.forEach(fleche => {
	    adjacence.set([i,fleche.but.numero],fleche.nbr_fl1);
	});
    }

    return adjacence;
}

Scene.prototype.have_cycle = function() { // 0 -> blanc 1 -> gris 2 -> noir
    var color = Array(this.circle_list.length).fill(0);

    for (var i=0; i < this.circle_list.length;i++) {
	var circle = this.circle_list[i];
	
	if(color[circle.numero] != 2 && this.PP(circle,color)) {
	    return 1;
	}
    }
    
    return 0;
}


Scene.prototype.PP = function(circle,color) {
    color[circle.numero] = 1;
    var adjacent = circle.fleches.filter(fleche => fleche.source == circle);
    
    for(var i=0; i < adjacent.length; i++) {
	var num = adjacent[i].but.numero;

	if (color[num] == 1 || (color[num] == 0 && this.PP(adjacent[i].but,color))) {
	    return 1;
	}
    }
    
    color[circle.numero] = 2;
    return 0;
}


Scene.prototype.get_fleche = function(source,but) {
    var list = this.fleche_list.filter(f=>f.source == source && f.but == but);

    if (list.length == 0)
	return null;
    
    return list[0];    
}

Scene.prototype.add_fleche = function(source,but) {
    var fleche = this.get_fleche(source,but); 
        
    if (fleche == null && this.generalisation == true) {
	fleche = this.get_fleche(but,source);
	if (fleche != null) {
	    fleche.nbr_fl2 += 1;
	    fleche.circle.children[1].value = fleche.getCircleText();
	    this.two.update();
	    return fleche;
	}
    }
    
    if (fleche == null) {
	fleche = new Fleche(this,source, but, 1, 1);
	this.fleche_list.push(fleche);
	return fleche;
    } 
    
    fleche.nbr_fl1 += 1;
    if (this.generalisation == false) {
	fleche.nbr_fl2 = fleche.nbr_fl1;
    }
    
    fleche.circle.children[1].value = fleche.getCircleText();
    console.log(fleche);
    this.two.update();
    
    return fleche;
}
 
