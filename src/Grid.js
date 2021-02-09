function Grid(two) {
    this.offset = new Two.Vector(10,10);
    this.width = 40;
    this.two = two;
    this.grille_set = 1;
}

Grid.prototype.draw = function () {
    for (var i=this.offset.x; i < this.two.width; i+=this.width) {
	this.two.makeLine(i,0,i,this.two.height);
    }

    for (var i=this.offset.y; i < this.two.height; i+=this.width) {
	this.two.makeLine(0,i,this.two.width,i);	
    }
}

Grid.prototype.update = function (diff) {
    this.offset.x = (this.offset.x + diff.x) % this.width;
    this.offset.y = (this.offset.y + diff.y) % this.width;   
}
