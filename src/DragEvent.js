function DragEvent(element,scene) {
    this.clicked = false;
    this.begin = new Two.Vector(0,0);
    this.moving_circle = null;

    this.setMouseUpEvent(element);
    this.setMouseDownEvent(element);
    this.setMouseMoveEvent(element);
    this.setMouseLeaveEvent(element);
}

DragEvent.get_position = function(event, elem) {
    var rect = elem2.getBoundingClientRect();
    
    return new Two.Vector(event.clientX - Math.ceil(rect.left),
			  event.clientY - Math.ceil(rect.top));
}

DragEvent.prototype.setMouseDownEvent = function(element) {
    element.addEventListener("mousedown",event => {
	this.clicked = (event.button == 0);
	
	if (this.clicked) {
	    this.begin = DragEvent.get_position(event,element);
	}
	event.stopPropagation();
    });
}

DragEvent.prototype.setMouseUpEvent = function(element) {
    element.addEventListener("mouseup",event => {
	if (event.button == 0) {
	    this.clicked = false;
	    scene.reinitdiff();

	    if (this.moving_circle != null) {
		this.moving_circle.clicked = false;
		this.moving_circle = null;
	    }
	}
	event.stopPropagation();
    });    
}

DragEvent.prototype.setMouseMoveEvent = function(element) {
    element.addEventListener("mousemove",event => {
	var position = DragEvent.get_position(event,element);
	
	if (this.moving_circle != null) {
	    scene.move_circle(this.moving_circle,position);
	} else if (this.clicked) {	    
	    var diff = new Two.Vector(0,0);
	    diff.sub(position,this.begin);
	    
	    scene.dragAction(diff);	    
	}
	event.stopPropagation();
    });
}

DragEvent.prototype.setMouseLeaveEvent = function(element) {
    element.addEventListener("mouseleave",event => {
	if (this.clicked) {
	    this.clicked = false;
	    scene.reinitdiff();
	    event.stopPropagation();
	}
    });    
}
