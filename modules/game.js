


//document.addEventListener("DOMContentLoaded", function() {

var MOVE_SPEED = 0;
var FPS = 0;
var ents = [];	
var current_ents = [];	


var intersected = null;

// var starTexture = new Image();
// starTexture.canDraw = false
// starTexture.crossOrigin = "Anonymous";
// starTexture.onload=function(){
	// starTexture.canDraw = true;
// }
// starTexture.src = 'textures/star.png';

var clusterNames = [];
clusterNames.push("Expanse");
clusterNames.push("Reaches");
clusterNames.push("Cluster");
clusterNames.push("Nebula");
clusterNames.push("Traverse");
clusterNames.push("Systems");
clusterNames.push("Frontier");
clusterNames.push("Sea");
clusterNames.push("Ranges");
clusterNames.push("Free Territories");
clusterNames.push("Borderlands");
clusterNames.push("Badlands");


var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
var starnames = [];
for (var i = 0; i<letters.length; i++) {
	for (var j = 0; j<letters.length; j++) {
		//for (var k = 1; k<letters.length; k++) {
			starnames.push((letters[i]+letters[j]).toUpperCase());
		//}
	}
}

console.log(starnames.length);

var startypes = [];

function startype(name, min, max, color, maxsats, chance) {
	this.name = name;
	this.min = min;
	this.max = max;
	this.color = color;
	this.maxsats = maxsats;
	this.chance = chance;	
}

function rgb(r,g,b) {
	this.g = g;	
	this.b = b;
	this.r = r;
	
	//this.a = a | 255;
}

var solarRad = 650

startypes.push(new startype("red dwarf", solarRad*0.5, solarRad*1.2, color = new rgb(255, 50, 50), 6, 0));
startypes.push(new startype("yellow dwarf", solarRad*0.7, solarRad*3, color = new rgb(255, 255, 50), 6, 0.5));
startypes.push(new startype("red giant", solarRad*15, solarRad*30, new rgb(255, 50, 50), 26, 0.95));
startypes.push(new startype("blue hypergiant", solarRad*20, solarRad*40, new rgb(50, 100, 255), 26, 0.99));

console.log(startypes);

var SEED = 666;

if ($_GET("seed") & Number($_GET("seed"))) {	
	SEED = Number($_GET("seed"));
}



var rand = new random(SEED);

console.log("SEED: " + rand.seed);
for (var k = 0; k < 245; k++) {
	rand.getRandom();
}
console.log("SEED: " + rand.seed);


var start_pos_set = false;
var start_pos = new THREE.Vector3(0,0,0); 


//var n;


var clusters = [];

var numClusters = Math.round(4+rand.getRandom() * 256);

var galaxy_radius = 5000000000000 * numClusters   // 1000000000000//000;	

var ticker = 0;

if (!start_pos_set) {
	start_pos.set(galaxy_radius*-2, 0, galaxy_radius*0.7);
	start_pos_set = true;
	
	
}

var numArms = Math.ceil(rand.getRandom() * 18);

var armBend = rand.getRandom() * 12 - 6;

for (var n_cluster = 0; n_cluster < numClusters; n_cluster++) {	
	var numStars = Math.round(2+rand.getRandom() * 45);
	var starDist = numStars * (100000000 + rand.getRandom() * 100000000);
	
	//var clusterPos = 

	var cluster = new entity("cluster");
	//cluster.pos = new THREE.Vector3(rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1).multiplyScalar((0.4 + (rand.getRandom()-0.4))*galaxy_radius);
	
	var arm = n_cluster % numArms;
	
	var posArm = n_cluster / numArms;
	
	cluster.pos = new THREE.Vector3(
	((-0.5+rand.getRandom()) * galaxy_radius*0.05) + Math.sin((arm/numArms)*360 + (n_cluster/numClusters*armBend)) * galaxy_radius*(n_cluster/numClusters), 
	((-0.5+rand.getRandom()) * galaxy_radius*0.05) + Math.cos((arm/numArms)*360 + (n_cluster/numClusters*armBend)) * galaxy_radius*(n_cluster/numClusters), 
	(-1 + (rand.getRandom()*2)) * ((galaxy_radius*0.2) * clamp(1-(n_cluster/numClusters), 0, 1)));//.multiplyScalar((0.4 + (rand.getRandom()-0.4))*galaxy_radius);
	
	
	cluster.color = rgbToHex(Math.round(rand.getRandom()*255), Math.round(rand.getRandom()*255), Math.round(rand.getRandom()*255));
	cluster.radius = starDist*1.5 //numStars * 100000;
	cluster.angles.set(rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1)
	
	cluster.name = randomName(rand) // starnames[n_cluster % starnames.length];
	cluster.canSee = false;
	cluster.spawned = false;
	clusters.push(cluster);
	
	cluster.subname = clusterNames[Math.floor(rand.getRandom()*clusterNames.length)];


	
	for (var n_star = 0; n_star<numStars; n_star++) { // 10000
		
		//console.log(rand.getRandom());
		
		//console.log(n_star)
		
		var star = new entity("star");
		star.angles.set(rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1)
		
		var myNum = rand.getRandom();	
		star.typedata = startypes[0];
		
		
		
		for (n_startype = 0; n_startype < startypes.length; n_startype++) {		
			if (myNum > startypes[n_startype].chance) {
				star.typedata = startypes[n_startype];
				//break;
			}
		}
		
		var numPlanets = Math.round(rand.getRandom()*star.typedata.maxsats)
		
		
		star.name = cluster.name + "-" + n_star; //"S"+(n_star+1);		
		
		star.color = rgbToHex(
			clamp(Math.round(star.typedata.color.r + (50*rand.getRandom())), 0, 255), 
			clamp(Math.round(star.typedata.color.g + (50*rand.getRandom())), 0, 255), 
			clamp(Math.round(star.typedata.color.b + (50*rand.getRandom())), 0, 255) 
		);
		
		if (numPlanets > 7 | rand.getRandom() > 0.7 | (n_cluster == 0 && n_star == 0)) {
		//star.specialname = 
			star.name = randomName(rand);
		}
		
		star.parent = cluster;
		
		
		
		
		star.pos = new THREE.Vector3(rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1).multiplyScalar((0.3+(rand.getRandom()*0.7))*starDist);
		
		star.pos.set(star.pos.x*cluster.angles.x + cluster.pos.x, star.pos.y*cluster.angles.y + cluster.pos.y, star.pos.z*cluster.angles.z + cluster.pos.z)
		star.angles.set(rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1)
	
		//star.angles = new THREE.Vector3((Math.random() * 2 - 1), (Math.random() * 2 - 1), (Math.random() * 2 - 1));
		//star.radius = rand.getRandom()	;
		
		
		star.radius = star.typedata.min + (rand.getRandom() * (star.typedata.max - star.typedata.min));
		
		star.spawned = false;
		cluster.children.push(star);
		
		
		var orbit_dist = star.radius * 10;
		for (var n_planet = 0; n_planet<numPlanets; n_planet++) {
			
			
			var num = rand.getRandom()*360;
			
			var sin = Math.sin(num % 180);
			var cos = Math.cos(num % 180);
			
			var planet = new entity("planet");
			
			planet.name = star.name + "-" + letters[n_planet];
			
			//if (star.specialname) {
			//	planet.name = star.specialname + "-" + letters[n_planet];
			//}
			
			planet.pos = new THREE.Vector3(star.pos.x + sin*orbit_dist, star.pos.y + cos*orbit_dist, star.pos.z)
			planet.color = rgbToHex(Math.round(rand.getRandom()*255), Math.round(rand.getRandom()*255), Math.round(rand.getRandom()*255));
			planet.angles.set(rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1)
			
			planet.radius = rand.getRandom() * (star.radius*0.02)
			
			star.children.push(planet);
			
			planet.parent = star;
			
			orbit_dist = orbit_dist + (planet.radius*(25+rand.getRandom()*90)) + (star.radius * (45*rand.getRandom()));
			
			if (!start_pos_set) {
				start_pos.set(planet.pos.x-(planet.radius*2), planet.pos.y, planet.pos.z);
				start_pos_set = true;
			}
			
			
			
			var numMoons = Math.round(rand.getRandom() * (14));
			
			var moonOrbitDist = planet.radius * 15;
			for (var n_moon = 0; n_moon<numMoons; n_moon++) {			
			
				var num = rand.getRandom()*360;
				
				var sin = Math.sin(num % 180);
				var cos = Math.cos(num % 180);
				
				var moon = new entity("moon");
				moon.angles.set(rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1, rand.getRandom() * 2 - 1)
				
				moon.name = planet.name + "-" + (n_moon+1);				
				
				
				moon.pos = new THREE.Vector3(planet.pos.x + sin*moonOrbitDist, planet.pos.y + cos*moonOrbitDist, planet.pos.z)
				moon.color = rgbToHex(Math.round(rand.getRandom()*255), Math.round(rand.getRandom()*255), Math.round(rand.getRandom()*255));
				
			
					moon.radius = rand.getRandom() * (planet.radius*0.1)					
			
				
				planet.children.push(moon);
				
				moon.parent = planet;
				
				moonOrbitDist = moonOrbitDist + (moon.radius*(10+rand.getRandom()*30)) + (planet.radius * (12*rand.getRandom()));
			}
		}			
	}
}

// start three js shit			
var scene = new THREE.Scene();



var ply = new player("droke");
ply.camera.position.set(0,0,0);

ply.pos.set(start_pos.x, start_pos.y, start_pos.z);

// Create shortcuts for window size.
var width = window.innerWidth;
var height = window.innerHeight;

// We will use 2D canvas element to render our HUD.  
var hudCanvas = document.createElement('canvas');

// Again, set dimensions to fit the screen.
hudCanvas.width = width;
hudCanvas.height = height;

// Get 2D context and draw something supercool.
var hudBitmap = hudCanvas.getContext('2d');
hudBitmap.font = "Normal 16px Monospace";
hudBitmap.textAlign = 'center';
hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
hudBitmap.fillText('Initializing...', width / 2, height / 2);

// Create the camera and set the viewport to match the screen dimensions.
 var cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );

// Create also a custom scene for HUD.
sceneHUD = new THREE.Scene();

// Create texture from rendered graphics.
var hudTexture = new THREE.Texture(hudCanvas) 
hudTexture.minFilter = THREE.LinearFilter;
hudTexture.needsUpdate = true;

// Create HUD material.
var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
material.transparent = true;

// Create plane to render the HUD. This plane fill the whole screen.
var planeGeometry = new THREE.PlaneGeometry( width, height );
var plane = new THREE.Mesh( planeGeometry, material );
sceneHUD.add( plane );



// start 3js
var renderer = new THREE.WebGLRenderer({antialias: false});
renderer.setSize( width, height );
renderer.autoClear = false;
document.body.appendChild(renderer.domElement);	

var light = new THREE.PointLight( 0xffffff, 1, 1000000 );
light.position.set( 0, 0, 0 ).normalize();
scene.add( light );

var light2 = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light2 );





var viewVec = []; //new THREE.Vector3(0,0,0);
viewVec.x = 0;
viewVec.y = 0;
viewVec.z = 0;	

var MOUSEX = 0;
var MOUSEY = 0;		
var MOUSEX_prev = 0;
var MOUSEY_prev = 0;

//	var MOUSEX_VEL = 0;
//var MOUSEY_VEL = 0

//var CAMX_VEL = 0;
//var CAMY_VEL = 0;
//var CAMZ_VEL = 0;

tooltip = [];
//tooltip.text
//tooltip.killat


var intersectFromScr = false;

var closest = -1;
var closestName = "";
var closestDist = 9999999999999999;	

var dot = 0;
var length = 0;
var lightMoved = false;

var parent = null;
var parentPos = new THREE.Vector3(0,0,0);
var parentScr = new THREE.Vector2( MOUSEX, MOUSEY );
	
function think() {

	// Update HUD graphics.
	//hudBitmap.clearRect(0, 0, width, height);
	//hudBitmap.fillText("space~~~~" , width / 2, height / 2);
	//hudTexture.needsUpdate = true;

	intersectFromScr = false;
	
	
	
	var data = "";
	
	data = data + "<i>WSAD to move</i></br>";
	data = data + "<i>Left click and drag to rotate camera</i></br>";
	data = data + "<i>Q to increase speed</i></br>";
	data = data + "<i>E to decrease speed</i></br>";
	data = data + "<i>J to teleport to tooltip object</i></br>";
	
	data = data + "<hr>";
	
	data = data + "<b>fps</b>: " + FPS + "</br>";	
	data = data + "<b>seed</b>: " + SEED + "</br>";
	data = data + "<b>num clusters</b>: " + numClusters + "</br>";
	data = data + "<b>num ents</b>: " + ticker + "</br>";
	data = data + "<b>dist from center</b>: " + distInAU(ply.pos.length()) + " AU</br>";
	//data = data + "<b>velocity</b>: " + ply.vel.z + " " + ply.vel.y + " " + ply.vel.z + "</br>";
	data = data + "<b>speed</b>: " + ply.speed + "</br>";
	
	if ((ply.jumpCooldown - curtime()) > 0) {
		data = data + "<b>jump cooldown</b>: " + (ply.jumpCooldown - curtime())/1000 + "</br>";
	}
	
	if (intersected) {
		//data = data + "<b>selected</b>: " + intersected + "</br>";
	}
	
	if (closestName != "") {
		data = data + "<b>system</b>: " + closestName + "</br>";
	}

	document.getElementById("dataview").innerHTML = data
	

	if (curtime() < tooltip.killat) {
		document.getElementById("tooltip").style.top = MOUSEY + "px";
		document.getElementById("tooltip").style.left = (MOUSEX+20) + "px";
		document.getElementById("tooltip").innerHTML = tooltip.text;
		//console.log(tooltip.killat, curtime, )
	}
	else {
		document.getElementById("tooltip").style.left = -1000 + "px";
	}
	
	
	
	
	
	
	var distBetween = 1
	
	var pos = new THREE.Vector3(ply.pos.x, ply.pos.y, ply.pos.z);

	//light.position.set( -pos.x, -pos.y, -pos.z ).normalize();
	
	

	
	
	//var entpos = new THREE.Vector3(ent.pos.x, ent.pos.y, ent.pos.z);
	
	var viewVec_norm = new THREE.Vector3(viewVec.x, viewVec.y, viewVec.z).normalize(); 
	
	
	
	
	
	var ent = null;
	
	var canSee = false;
	
	
	var temp_pos = new THREE.Vector3(0,0,0);
	
	var index = 0;
	
	var scr = new THREE.Vector2( 0, 0 );
	
	
	
	
	
	hudBitmap.strokeStyle="rgba(100,250,100,0.2)";
	hudBitmap.fillStyle="rgba(200,250,200,0.5)";
	
	
	
	for (var i = 0; i<clusters.length; i++) {	// clusters
		var cluster = clusters[i];
		
		cluster.draw();	
		
		if (cluster.inPlayerRadius) {
			for (j = 0; j < cluster.children.length; j++) { // stars
				var star = cluster.children[j];
				star.draw();	
				
				
				if (star.inPlayerRadius) {
					for (k = 0; k < star.children.length; k++) { // planets
						var planet = star.children[k];
						planet.draw();	
						
						if (planet.inPlayerRadius) {
							for (n = 0; n < planet.children.length; n++) { // moons
								var moon = planet.children[n];
								moon.draw();	
							}
						}
					}
				}
			}
		}
		
		
		//ent.position.set(entpos.x, entpos.y, entpos.z)
		
	}
	
	for (var i = 0; i < scene.children.length; i++) {
		var mesh = scene.children[i];
		
		if (mesh.ent && !mesh.ent.canSee) {
			scene.remove(mesh);
			
			ents.splice( i, 1 );
			
			if (mesh.ent) {
				mesh.ent.spawned = false;
				mesh.ent.mesh = null;
			}
			
			// i--;
		}

			
	}
	
	//if (intersected & intersects.length > 0 | ) {
		//if (!intersected.ent | !intersected.ent.canSee ) {
		//	intersected = null;
		//}
	//}

	//if (closest & !lightMoved) {
		
		//light.position.x = entpos.x;
		//light.position.y = entpos.y;
		//light.position.z = entpos.z;
		
		//lightMoved = true;
	
	//}
	
	
	

	
}

var intersects = [];

function castRays() {
	
	//console.log(mouse);

	// raycaster.setFromCamera( mouse, ply.camera );
	// intersects = raycaster.intersectObjects( current_ents );

	 if (!intersectFromScr) {
	 
		// if ( intersects.length > 0 ) {
			// if (intersected != intersects[ 0 ].object) {
				// intersected = intersects[ 0 ].object;
				// console.log("hovered");
			// }				
		// } else {
			 if (intersected) {
				 intersected = null;
			 }
		// }
	 }
	
	// var intersects = raycaster.intersectObjects( scene.children );

	// for ( var i = 0; i < intersects.length; i++ ) {

		// intersects[ i ].object.material.color.set( 0xff0000 );
	
	// }
		
	
	//document.getElementById("selected").innerHTML = intersected + " " + intersects.length;
	
	if (intersected) {
		
		
		
		var pos = new THREE.Vector3(ply.pos.x, ply.pos.y, ply.pos.z); 
		var entpos = new THREE.Vector3(intersected.pos.x - pos.x, intersected.pos.y - pos.y, intersected.pos.z - pos.z);
		//var viewVec_copy = new THREE.Vector3(viewVec.x, viewVec.y, viewVec.z).normalize();
		var dist = entpos.length();
		
		
		
		if (intersected.subname) {
			tooltip.text = "<b>" + intersected.name + " " + intersected.subname + "</b></br>";
		}
		else {
			tooltip.text = "<b>" + intersected.name + "</b></br>";
		}
		
		tooltip.text = tooltip.text + "<b>pos</b>: " + intersected.pos.x + ", " + intersected.pos.y + ", " + intersected.pos.z + "</br>";
		
		
		if (distInLY(dist)> 0.1) {
			tooltip.text = tooltip.text + "<b>dist</b>: " + distInLY(dist) + " LY</br>";
		}
		else if (distInAU(dist)> 0.1) {
			tooltip.text = tooltip.text + "<b>dist</b>: " + distInAU(dist) + " AU</br>";
		}	
		else {
			tooltip.text = tooltip.text + "<b>dist</b>: " + distInKM(dist) + " KM</br>";
		}
		
		if (distInLY(intersected.radius)> 0.1) {
			tooltip.text = tooltip.text + "<b>radius</b>: " + distInLY(intersected.radius) + " LY</br>";
		}
		else if (distInAU(intersected.radius) > 0.1) {
			tooltip.text = tooltip.text + "<b>radius</b>: " + distInAU(intersected.radius) + " AU</br>";
		}	
		else {
			tooltip.text = tooltip.text + "<b>radius</b>: " + distInKM(intersected.radius) + " KM</br>";
		}
		
		
		if (intersected.children.length > 0) {
			tooltip.text = tooltip.text + "<b>satellites</b>: " + intersected.children.length + "</br>";
		}
		
		if (intersected.typedata) {
			tooltip.text = tooltip.text + "<b>type</b>: " + intersected.typedata.name + "</br>";
		}
		
		if (intersected.type == "planet") {
			tooltip.text = tooltip.text + "<b>planet class</b>: "
			
			if (intersected.radius < 16) {
				tooltip.text = tooltip.text + "terrestrial";
			}
			else {
				tooltip.text = tooltip.text + "gas";
				
				if (intersected.radius > 45) {
					tooltip.text = tooltip.text + " giant";
				}
				else {
					tooltip.text = tooltip.text + " dwarf";
				}
				
				//if (ent.radius) 
				
			}
			
			
			tooltip.text = tooltip.text + "</br>";
		}
		
		
		
		
		tooltip.killat = (new Date() - 1) + 64;
		
		var now = (new Date());
		if (keyDown[74] & intersected != null & curtime() > ply.jumpCooldown) { // J // jump
			ply.jumpCooldown = curtime() + 1000;
		
			ply.pos.x = intersected.pos.x - (ply.camX*(intersected.radius*10));
			ply.pos.y = intersected.pos.y - (ply.camY*(intersected.radius*10));
			ply.pos.z = intersected.pos.z - (ply.camZ*(intersected.radius*10));	

			ply.vel.x = ply.camX * (intersected.radius)*0.6;
			ply.vel.y = ply.camY * (intersected.radius)*0.6;
			ply.vel.z = ply.camZ * (intersected.radius)*0.6;
			
			intersected = null;	
		}
		
		
	}
	
	//console.log(tooltip);

}

var oldTime = new Date;
var newTime = 0;
function animate() {
	newTime = new Date;					
	FPS = 1000 / (newTime - oldTime);
	oldTime = newTime;
	
	// Update HUD graphics.
    hudBitmap.clearRect(0, 0, width, height);

  	
	
	think();
	
	cameraThink(ply);
	
	castRays();
	
	renderer.render( scene, ply.camera );	
	
	renderer.render(sceneHUD, cameraHUD);
	
	requestAnimationFrame( animate );
	
	hudTexture.needsUpdate = true;
}

animate();

		
//})
// droke / luke st jack :)