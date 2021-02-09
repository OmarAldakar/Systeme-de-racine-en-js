function Circle(scene,grid_event,x,y) {
    this.numero = scene.circle_list.length;
    this.circle =
	scene.two.makeGroup(new Two.Circle(0,0,10),
                            new Two.Text(this.numero + 1,0,0,"normal"));
    this.circle.translation.x = x;
    this.circle.translation.y = y;

    scene.preview_list.push(this.circle);

    this.clicked = false;
    this.begin = new Two.Vector(0,0);
    this.grid_event = grid_event;

    scene.two.update();

    var elem = this.circle._renderer.elem;
    this.setMouseDownEvent(elem);
    this.setMouseLeaveEvent(elem);
    this.setMouseUpEvent(elem);
    this.setMouseMoveEvent(elem);
    this.setClickEvent(elem);


    this.circle.children[0].fill = 'red';
    scene.two.update();

    this.fleches = [];

    this.vector = null;
}


Circle.prototype.setMouseDownEvent = function(element) {
    element.addEventListener("mousedown",event => {
	this.clicked = (event.button == 0);

	if (this.clicked) {
	    this.begin = DragEvent.get_position(event,element);
	}
	event.stopPropagation();
    });
}

Circle.prototype.setMouseUpEvent = function(element) {
    element.addEventListener("mouseup",event => {
	if (event.button == 0) {
	    this.clicked = false;
	    this.grid_event.moving_circle = null;
	    scene.reinitdiff();
	}
	event.stopPropagation();
    });
}

Circle.prototype.setMouseMoveEvent = function(element) {
    element.addEventListener("mousemove",event => {
	if (this.clicked) {
	    var position = DragEvent.get_position(event,element);
	    scene.move_circle(this,position);
	}
	event.stopPropagation();
    });
}

Circle.prototype.setMouseLeaveEvent = function(element) {
    element.addEventListener("mouseleave",event => {
	if (this.clicked) {
	    this.grid_event.moving_circle = this;
	}
	event.stopPropagation();
    });
}

Circle.prototype.setClickEvent = function(element) {
    element.addEventListener("click", event =>  {
	if (scene.fleche_buton_pressed) {
	    scene.fleche_buton.push(this);
	    if (scene.fleche_buton.length == 2) {

		var fleche = scene.add_fleche(scene.fleche_buton[0],
					      scene.fleche_buton[1]);

		if (scene.have_cycle()) {
		    console.log(scene.have_cycle() == 1);
		    fleche.remove();
		}
		
		scene.fleche_buton_pressed = false;
	    }
	}

    });
}

Circle.prototype.update = function(diff) {
    this.circle.translation.x += diff.x;
    this.circle.translation.y += diff.y;
}

Circle.prototype.update_associated_fleches = function() {
    this.fleches.forEach(fleche => {
	fleche.update_fleche();
    });
}
