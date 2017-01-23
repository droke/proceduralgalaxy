var mouse = new THREE.Vector2();

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function curtime() {
	return Number(new Date());
}

console.log("Core initialized at " + curtime());

function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

// Detect if the browser is IE or not.
// If it is not IE, we assume that the browser is NS.
var IE = document.all?true:false

// If NS -- that is, !IE -- then set up for mouse capture
if (!IE) document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// mouse clicks
var mouseDown = false;
document.onmousedown = function(e) {
	mouseDown = true;
}

document.onmouseup = function(e) {
	mouseDown = false;
}


// keys
var keyDown = [];
function code(e) {
	e = e || window.event;
	return(e.keyCode || e.which);
}			

document.onkeydown = function(e){
	var key = code(e);
	keyDown[key] = true;
	
	 console.log(key);
};

document.onkeyup = function(e){
	var key = code(e);
	delete keyDown[key];
};

var tempX = 0;
var tempY = 0;
function getMouseXY(e) {
	if (IE) {
		tempX = e.clientX + document.body.scrollLeft
		tempY = e.clientY + document.body.scrollTop
	} else {  
		tempX = e.pageX
		tempY = e.pageY
	}  

	if (tempX < 0){tempX = 0}
	if (tempY < 0){tempY = 0} 

	MOUSEX = tempX;
	MOUSEY = tempY;

	//mouse.x = MOUSEX;
	//mouse.y = MOUSEY;
	
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	
	
	
	//return true
}

function distInKM(dist) {
	return dist * 1000;
}

function distInAU(dist) {
	return distInKM(dist) / 149597870.700
}

function distInLY(dist) {
	return distInAU(dist) / 63241.1
}


function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}

//var drawDistance = 18000;

function toScreen(camera, pos)
{
	
	var width = window.innerWidth, height = window.innerHeight;
	var widthHalf = width / 2, heightHalf = height / 2;

	var vec = pos.clone();
	vec.project(camera);
	vec.x = ( vec.x * widthHalf ) + widthHalf;
	vec.y = - ( vec.y * heightHalf ) + heightHalf;

	
	return (new THREE.Vector2(vec.x, vec.y));

};