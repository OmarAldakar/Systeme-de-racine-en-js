$(".drop")
  .mouseover(function() {
  $(".dropdown").show(300);
});
$(".drop")
  .mouseleave(function() {
  $(".dropdown").hide(300);     
});

$(".drop2")
  .mouseover(function() {
  $(".dropdown2").show(300);
});
$(".drop2")
  .mouseleave(function() {
  $(".dropdown2").hide(300);     
});


var scene = new Scene(700,300);
scene.draw();

var elem2 = document.getElementsByTagName("svg")[0];

elem2.addEventListener("wheel",event => {
    event.stopPropagation();
    event.preventDefault();
    
    var delta = 0;
    if (event.deltaY > 0) {
	if (scene.grid.width > 15) {
	    scene.grid.width -=5;
	    delta = 1;
	} else {
	    return;
	}
    } else {
	if (scene.grid.width < 40) {
	    scene.grid.width +=5;
	    delta = -1;
	} else {
	    return;
	}
    }

    scene.circle_list.forEach(c => {
	var last_width = scene.grid.width + delta * 5;
	
	
	var x = (c.circle.translation.x - scene.grid.offset.x) / last_width;
	x = Math.round(x);
	c.circle.translation.x = (x * scene.grid.width) + scene.grid.offset.x;
	var y = (c.circle.translation.y - scene.grid.offset.y) / last_width;
	y = Math.round(y);
	c.circle.translation.y = (y * scene.grid.width) + scene.grid.offset.y;


	
	if (event.deltaY > 0) {
	    if (c.circle.children[0].radius > 3)
		c.circle.children[0].radius -= 1;

	    if (c.circle.children[1].scale > 0.5)
		c.circle.children[1].scale -= 0.1;

	    c.fleches.forEach(f => {
		if (f.circle.children[0].radius > 4)
		    f.circle.children[0].radius -= 1;

		if (f.circle.children[1].scale > 0.5)
		    f.circle.children[1].scale -= 0.1;

	    });
	    
	} else {
	    
	    if (c.circle.children[0].radius < 10)
		c.circle.children[0].radius += 1
	    
	    if (c.circle.children[1].scale < 1.2)
		c.circle.children[1].scale += 0.1;

	    c.fleches.forEach(f => {
		if (f.circle.children[0].radius < 8)
		    f.circle.children[0].radius += 1;
		
		if (f.circle.children[1].scale < 0.8)
		    f.circle.children[1].scale += 0.1;

	    });
	}
	
	c.update_associated_fleches();
	
    });
   

    scene.two.clear();
    scene.draw();
});
// two has convenience methods to create shapes.
var bouton_cercle = document.getElementById("cercle");
var bouton_fleche = document.getElementById("fleche");

var bouton_rpt1  = document.getElementById("rpt1");
var bouton_rpt2  = document.getElementById("rpt2");
var bouton_rpt3  = document.getElementById("rpt3");
var bouton_grille = document.getElementById("grille");
var bouton_algo_g = document.getElementById("algo_generaliser");
var bouton_algo_s = document.getElementById("algo_simple");


var grid_event = new DragEvent(elem2,scene);

bouton_cercle.addEventListener("click",event => {
    scene.add_circle(grid_event,100,100);
});

bouton_fleche.addEventListener("click",event=> {
    scene.fleche_buton_pressed = true;
    scene.fleche_buton = [];
});

bouton_rpt1.addEventListener("click",event=> {  
    scene.repetition(9,grid_event,1);
});

bouton_rpt2.addEventListener("click",event=> {  
    scene.repetition(9,grid_event,2);
});

bouton_rpt3.addEventListener("click",event=> {  
    scene.repetition(9,grid_event,3);
});

bouton_grille.addEventListener("click", event=> {
    scene.grid.grille_set = (scene.grid.grille_set + 1)%2;
    scene.two.clear();
    scene.draw();
});

bouton_algo_g.addEventListener("click", event => {
    scene.generalisation = true;
    scene.fleche_list.forEach (fleche =>  {
	fleche.circle.children[1].value = fleche.getCircleText();
    });
    scene.two.update();
});

bouton_algo_s.addEventListener("click", event => {
    scene.generalisation = false;
    scene.fleche_list.forEach (fleche =>  {
	fleche.nbr_fl2 = fleche.nbr_fl1;
	fleche.circle.children[1].value = fleche.getCircleText();
    })
    scene.two.update();
});
