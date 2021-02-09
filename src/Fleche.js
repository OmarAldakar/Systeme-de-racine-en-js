function Fleche(scene,source,but,nbr_fl1,nbr_fl2) {
    var c1 = source.circle.translation;
    var c2 = but.circle.translation;
    
    this.scene = scene;
    this.source = source;
    this.but = but;
    but.fleches.push(this);
    source.fleches.push(this);            

    this.nbr_fl1 = nbr_fl1;
    this.nbr_fl2 = nbr_fl2;

    this.circle = null;
    
    this.fleche = scene.two.makeLine(c1.x,c1.y,c2.x,c2.y);
    Fleche.init_line(this.fleche);    	
    this.bout1 = scene.two.makeLine(0,0,1,1);
    Fleche.init_line(this.bout1);
    this.bout2 = scene.two.makeLine(0,0,1,1);
    Fleche.init_line(this.bout2);

    scene.preview_list.push(this.fleche,this.bout1,this.bout2);
    this.init_cir_nbr();     
    this.update_fleche();

    scene.two.update();
}

Fleche.prototype.update_fleche = function() {
    var c1 = this.source.circle.translation;
    var c2 = this.but.circle.translation;
    
    var vect = new Two.Vector(c2.x - c1.x, c2.y - c1.y);
    vect.normalize();


    var s = this.source.circle.children[0];
    var b = this.but.circle.children[0];
    
    this.fleche.vertices[0].x = c1.x + s.radius * vect.x;
    this.fleche.vertices[0].y = c1.y + s.radius * vect.y;
    this.fleche.vertices[1].x = c2.x - b.radius * vect.x;
    this.fleche.vertices[1].y = c2.y - b.radius * vect.y;
       
    this.bout1.vertices[0].x = this.fleche.vertices[1].x;
    this.bout1.vertices[0].y = this.fleche.vertices[1].y;
    this.bout1.vertices[1].x = this.fleche.vertices[1].x - 5 * vect.y - s.radius * vect.x;
    this.bout1.vertices[1].y = this.fleche.vertices[1].y + 5 * vect.x - s.radius * vect.y;    

    this.bout2.vertices[0].x = this.fleche.vertices[1].x;
    this.bout2.vertices[0].y = this.fleche.vertices[1].y;
    this.bout2.vertices[1].x = this.fleche.vertices[1].x + 5 * vect.y - s.radius * vect.x;
    this.bout2.vertices[1].y = this.fleche.vertices[1].y - 5 * vect.x - s.radius * vect.y;

    this.update_cir_nbr();
}

Fleche.prototype.update = function(diff) {
    Fleche.add_vect(diff,this.fleche);
    Fleche.add_vect(diff,this.bout1);
    Fleche.add_vect(diff,this.bout2);
    this.circle.translation.add(this.circle.translation,diff);
}


Fleche.add_vect = function(vector,line) {
    line.vertices[0].x += vector.x;
    line.vertices[0].y += vector.y;
    line.vertices[1].x += vector.x;
    line.vertices[1].y += vector.y;
}

Fleche.init_line = function(line) {
    line.translation = new Two.Vector(0,0);
    line.linewidth = 2;
    line.stroke = "blue";
}

Fleche.prototype.remove = function() {
    this.scene.fleche_list = this.scene.fleche_list.filter(element => element != this);
    this.scene.preview_list = this.scene.preview_list.filter(element =>  {
	return element != this.fleche && element != this.bout1 && element != this.bout2
	&& element != this.circle;
    });
    
    console.log(this.scene.preview_list);
    this.but.fleches = this.but.fleches.filter(element => element != this);
    this.source.fleches = this.source.fleches.filter(element => element != this);
    this.scene.two.remove(this.fleche,this.bout1,this.bout2,this.circle);
    this.scene.two.update();    
}


Fleche.prototype.getCircleText = function() {
    return (this.scene.generalisation == true)? this.nbr_fl1 + "," +
	this.nbr_fl2:this.nbr_fl1;
}

Fleche.prototype.init_cir_nbr = function() {
    var circ_content = this.getCircleText();

    this.circle = this.scene.two.makeGroup(new Two.Circle(0,0,8),
					   new Two.Text(circ_content,0,0,"normal"));
    this.circle.children[1].scale = 0.8;
    this.update_cir_nbr();
    this.scene.preview_list.push(this.circle);
}

Fleche.prototype.update_cir_nbr = function() {
    var c1 = this.fleche.vertices[0];
    var c2 = this.fleche.vertices[1];
    
    var vect = new Two.Vector(c2.x - c1.x, c2.y - c1.y);
    var x = c1.x + vect.x/2;
    var y = c1.y + vect.y/2;

    this.circle.translation.x = x;
    this.circle.translation.y = y;    
}
