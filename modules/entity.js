
function entity(type) {
    ticker++;
	
	this.name = "unknown";
	this.subname = "";
    this.color = "white";
	this.type = type;
	this.pos = new THREE.Vector3(0,0,0);
	this.vel = new THREE.Vector3(0,0,0);
	this.angvel = new THREE.Vector3(0,0,0);
	this.angles = new THREE.Vector3(0,0,0);
	this.children = [];
	this.canSee = false;
	this.inPlayerRadius = false;
	this.scr = new THREE.Vector2(0,0);
	this.scr_temp = new THREE.Vector2(0,0);
	
	this.spawned = false;
	
	this.draw = function() {
		var ent = this;
		var entpos = new THREE.Vector3(ent.pos.x - ply.pos.x, ent.pos.y - ply.pos.y, ent.pos.z - ply.pos.z);
		
		length = entpos.length();
		
		ent.canSee = length < (ent.radius*1000000000);
		var dot = -1;
		
		
		ent.scr = toScreen(ply.camera, entpos);
		
		ent.scr_temp.set((ent.scr.x/renderer.context.canvas.width)*2 - 1, - (ent.scr.y/renderer.context.canvas.height)*2 - 1)
		
		if (ent.canSee) {
			if (ply.camera.dir) {
				dot = entpos.normalize().dot(ply.camera.dir);
			}			
			
			if (dot < 0.3 & length > (ent.radius * 2)) {				
				ent.canSee = false;
			}
			else {
				// ply.raycaster.setFromCamera( -ent.scr_temp, ply.camera );
				// intersects = ply.raycaster.intersectObjects(ents);
				
				// if (intersects.length > 0) {
					// ent.canSee = false;
				// }
			}
			
			
			ent.inPlayerRadius = true;	
		}
		else {
			ent.inPlayerRadius = false;
		}
		
		
		
		
		ent.scr.x = clamp(ent.scr.x, 0, renderer.context.canvas.width);
		ent.scr.y = clamp(ent.scr.y, 0, renderer.context.canvas.height);
		
		if (!ent.spawned && ent.canSee) {
			//console.log(ent.name);
			
			if (ent.type == "cluster") {
				ent.spawned = true;
				ent.mesh = null;
			}
			else {
				ent.geometry = new THREE.SphereGeometry( ent.radius, 16, 16); //new THREE.BoxGeometry( ent.radius, ent.radius, ent.radius ); //

				ent.material = new THREE.MeshPhongMaterial( { color: ent.color} );
				
				ent.mesh = new THREE.Mesh( ent.geometry, ent.material );
				
				scene.add(ent.mesh);
				//console.log(n, ent.name, "added");
				ent.spawned = true;
				
				ent.mesh.position.set(ent.pos.x, ent.pos.y, ent.pos.z);
				
				ent.mesh.ent = ent;
				
				
				ents.push(ent.mesh);
			}
			// current_ents.push(ent.mesh);			
		}
		
		
		var mouseVec = new THREE.Vector2( MOUSEX, MOUSEY );
		if (!intersected & ent.scr.distanceTo( mouseVec ) < 10) {
			// if (!ent.canSee) {intersected = ent.parent;}
			intersected = ent;
			intersectFromScr = true;
		}
		
		if (ent.spawned) {
		
			
		
			//scr = toScreen(ply.camera, entpos);
			
			//if (length < (ent.radius*2000)) {				
			if (ent.canSee) {
				var name = ent.name;
				var color = rgbToHex(ent.color);
				
				if (ent.subname) {
					name = name + " " + ent.subname;
				}
				
				var fontSize = 12;
				
				if (intersected == ent) {
					fontSize = 16;
				}
				
				//if (length > ent.radius*10 & length > (ent.radius*10000)) {	
					//name = ".";
					// = 6+Math.round(ent.radius/100000000)
				 // hudBitmap.fillStyle="rgba("+ent.color.r+","+ent.color.g+","+ent.color.b+",0.5)";	
				 
				if (ent.type == "cluster") {
					hudBitmap.fillStyle="rgba(250,50,50,0.5)";				
				}
				
				if (ent.type == "star") {
					hudBitmap.fillStyle="rgba(255,180,25,0.5)";
				}
				
				if (ent.type == "planet") {
					hudBitmap.fillStyle="rgba(50,250,50,0.5)";	
				}
				
				if (ent.type == "moon") { 
					hudBitmap.fillStyle="rgba(50,150,250,0.5)";	
				}
				 
				hudBitmap.beginPath();
				hudBitmap.arc(ent.scr.x, ent.scr.y, 2+Math.round(ent.radius/10000000000), 0, 2 * Math.PI, false);
				// hudBitmap.fillStyle = "rgba("+ent.color.r+","+ent.color.g+","+ent.color.b+", 0.5)";
				hudBitmap.fill();
				
				//}	

				if (intersected == ent) {
					hudBitmap.fillRect(ent.scr.x + 10,ent.scr.y-2,4,4);
					hudBitmap.fillRect(ent.scr.x - 14,ent.scr.y-2,4,4);
				}
				
				if (length < (ent.radius*10000) | intersected == ent) {
					
					// hudBitmap.fillStyle = "rgba(0,200,0, 0.5)";
					
					
					
					// hudBitmap.arc(ent.scr.x, ent.scr.y, 1+Math.round(ent.radius/10000000000), 1, 2 * Math.PI, false);
					
					// hudBitmap.lineWidth = 1;
					// hudBitmap.strokeStyle = '#00AA00';
					// hudBitmap.stroke();
				
				
					hudBitmap.font = "Normal "+fontSize+"px Monospace";	
					hudBitmap.fillStyle="rgba(150,250,150,0.5)";						
					hudBitmap.fillText(name, ent.scr.x, ent.scr.y - ((3+Math.round(ent.radius/10000000000))*2 + fontSize/2));	
				// }
				
				
				}
			
			}
		//}			
			
			if (ent.parent) {			
				parentPos.set(ent.parent.pos.x - ply.pos.x, ent.parent.pos.y - ply.pos.y, ent.parent.pos.z - ply.pos.z);

				if (ent.parent.canSee & intersected == ent.parent) {	
					var parentScr = toScreen(ply.camera, parentPos);
				
					parentScr.x = clamp(parentScr.x, 0, renderer.context.canvas.width);
					parentScr.y = clamp(parentScr.y, 0, renderer.context.canvas.height);
				
					hudBitmap.beginPath();
					
					hudBitmap.moveTo(ent.scr.x, ent.scr.y);
					hudBitmap.lineTo(parentScr.x, parentScr.y);
					hudBitmap.stroke();					
				}				
			}
				
			if (ent.mesh != null){
				ent.mesh.position.set(ent.pos.x - ply.pos.x, ent.pos.y - ply.pos.y, ent.pos.z - ply.pos.z);			

				ent.mesh.updateMatrix();
			}			
			
			// if (length < ent.radius * 30 && closestDist > length && ent.type == "star" && closest != ent) {
				// console.log("entered system - " + ent.name);
				// closestDist = length;
				// closest = ent;
				
				// closestName = ent.name;
			// }
			
			// if (closest == ent && length > ent.radius * 30) {
				// console.log("left system - " + closestName);
				// closest = null;
				// closestDist = 99999999;
				
				// closestName = "";
			
			// }
		}

		
		if (intersected == ent.mesh & !ent.canSee) {
			intersected = null;
		}
		
	}
}

