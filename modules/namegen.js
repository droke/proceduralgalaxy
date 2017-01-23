//var syllables = "arikerebakacalavexeterorotohobonokaoalabanacaxaeutukurubufijasadafagazahogozoxovoborotoyosisitirizixic";

//var syllables = "aeacasopapoveviveilusurotoraroninonumimumomagagisisy"; // latiny
//var syllables = "vakatapahazaravoporozodowovitityvykyveneseschzevetevurutupu"; // russian

var syllables = "varavenvidiviciousmortaugustusjuliusimperiusporoniuspovolus";

if ($_GET("syllables")) {	
	syllables = $_GET("syllables");
}



function capFirst(string) {	
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function randomName(randomObj) {
	
	var numSylls = 1+Math.ceil(randomObj.getRandom() * 3);
	
	var name = "";
	
	for (var i = 0; i < numSylls; i++) {
		var start = Math.ceil(randomObj.getRandom() * (syllables.length - 2))
		
		var len = 2; // + Math.round(Math.random()*1)
		
		name = name + syllables.substring(start, Math.min(start+len, syllables.length));		
	}
	
	return capFirst(name);
}