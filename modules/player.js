//player = new Object()

function player(name) {
    this.name = name;
    this.color = "white";
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 50000000 );
	this.pos = new THREE.Vector3(0,0,0);
	this.vel = new THREE.Vector3(0,0,0);
	this.angvel = new THREE.Vector3(0,0,0);
	this.jumpCooldown = 0;
	this.raycaster = new THREE.Raycaster();
	
	// this.closestCluster = null;
	// this.closestStar = null;
	// this.closestPlanet = null;
	// this.closestMoon = null;
	
	this.camX = 0;
	this.camY = 0;
	this.camZ = 0;
	
	this.speed = 10;
	
	
	//return this;
}

cameraThink = function(ply) {
	// CAMERA
	
	//var CAMVEL = ply.CAMVEL;
	
	var DIFFX = (MOUSEX - MOUSEX_prev) * (window.innerWidth/window.innerHeight) * 0.1;
	var DIFFY = (MOUSEY - MOUSEY_prev) * (window.innerWidth/window.innerHeight) * 0.1;				
	
	ply.angvel.x = ply.angvel.x * 0.9;
	ply.angvel.y = ply.angvel.y * 0.9;
	
	if (mouseDown) {
		ply.angvel.x = ply.angvel.x + DIFFX*-0.1;
		ply.angvel.y = ply.angvel.y + DIFFY*-0.1;				
	}
		
	viewVec.x = viewVec.x + ply.angvel.x; // yaw
	
	if (viewVec.x > 180) {
		viewVec.x = -180 + (viewVec.x - 180)
	}
	
	if (viewVec.x < -180) {
		viewVec.x = 180 - (viewVec.x + 180)
	}
	
	viewVec.y = clamp(viewVec.y + ply.angvel.y, -80, 80); // pitch
	
	
	MOUSEX_prev = MOUSEX;
	MOUSEY_prev = MOUSEY;
	
	//document.getElementById("text").innerHTML = "DIFFX: " + DIFFX + "DIFFY: " + DIFFY;
					
	var text = "<p>Yaw: " + viewVec.x + " Pitch: " + viewVec.y + "</p>";
	
	
	
	var zoom = -20;				
	
	var yaw = THREE.Math.degToRad(viewVec.x)
	var pitch = THREE.Math.degToRad(viewVec.y)
	
	// strafe
	
	var yawRight = (viewVec.x+90);
	
	if (yawRight > 180) {yawRight = -180 + (yawRight - 180);}
	if (yawRight < -180) {yawRight = 180 - (yawRight + 180);}
	
	var pitchUp = (90);

	
	
	ply.camX = Math.cos(yaw)*Math.cos(pitch)
	ply.camY = Math.sin(yaw)*Math.cos(pitch)
	ply.camZ = Math.sin(pitch)
	
	
	//text = text + "<p>yawRight: " + yawRight + "</p>";
	
	if (keyDown[81]) { // Q
		ply.speed = ply.speed * 0.9;	
	}
	
	if (keyDown[69]) { // E
		ply.speed = ply.speed * 1.1;	
	}
	
	//var forward = 
	
	//console.log(keyDown[key_W]);
	
	var addX = 0;
	var addY = 0;
	var addZ = 0;
	
	if (keyDown[87] == true) { // W
		addX = addX + (ply.camX*ply.speed);
		addY = addY + (ply.camY*ply.speed);
		addZ = addZ + (ply.camZ*ply.speed);
	}
	
	
	if (keyDown[83] == true) { // S
		addX = addX + (ply.camX*-ply.speed);
		addY = addY + (ply.camY*-ply.speed);
		addZ = addZ + (ply.camZ*-ply.speed);
	}
	
	

	// right

	yawRight = THREE.Math.degToRad(yawRight);

	var camX_rot = Math.cos(yawRight)*Math.cos(0);
	var camY_rot = Math.sin(yawRight)*Math.cos(0);
	var camZ_rot = Math.sin(0);

	if (keyDown[65] == true) { // A
		addX = addX + (camX_rot*ply.speed);
		addY = addY + (camY_rot*ply.speed);
		addZ = addZ + (camZ_rot*ply.speed);
	}
	
	if (keyDown[68] == true) { // D					
		addX = addX + (camX_rot*-ply.speed);
		addY = addY + (camY_rot*-ply.speed);
		addZ = addZ + (camZ_rot*-ply.speed);
	}		

	
	
	ply.vel = ply.vel.multiplyScalar(0.93); //(ply.vel.x*0.9 + addX, ply.vel.y*0.9 + addY, ply.vel.z*0.9 + addZ);	
	ply.vel = ply.vel.add(new THREE.Vector3(addX, addY, addZ));
	
	
	
	//ply.camera.position.set(ply.camera.position.x + ply.vel.x, ply.camera.position.y + ply.vel.y, ply.camera.position.z + ply.vel.z);
	
	ply.pos.add(ply.vel);
	
	
	//
//	console.log(ply.pos, ply.camera.position);
	
	//ply.camera.position.set(ply.pos.x, ply.pos.y, ply.pos.z);
	
	ply.camera.position.set(0, 0, 0);
	ply.camera.dir = new THREE.Vector3(ply.camX, ply.camY, ply.camZ);
	ply.camera.lookAt(ply.camera.dir);				
	ply.camera.up = new THREE.Vector3(0,0,1);			
	ply.camera.updateMatrixWorld();				
		
	ply.camera.updateProjectionMatrix();	
		
	//MOVE_SPEED = new THREE.Vector3(ply.vel.x, ply.vel.y, ply.vel.z).length()	
	
	
	

		
}
