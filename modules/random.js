function random(seed) {
	this.seed = seed;	
	this.getRandom = function() {
		this.seed = ((this.seed * 1.1)) % 1024;
		//this.seed = 
		
		//console.log(this.seed);
		
		return Math.sin(this.seed%180) / 2 + 0.5;
	}
}
		
