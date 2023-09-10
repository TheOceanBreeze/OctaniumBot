//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class main {
	constructor(app) {
		this.app = app;
	}

	clearCache = () => {
		// Drop all
		for (let key in this.app.cache)  {
			delete this.app.cache[key];
		}
	};

	getID = (string) => {
		// Use .split() and .join() instead of regex
		return string.split(/[<#@&!>]/).join("");
	};
	getTicks = () => { 
		// Remove * 10000 since extra precision is unused
		return Date.now();
	};

	// ...

	isAnimated = (str) => {
		// Use a Set of known animated emojis for a more robust check
		return this.animatedEmojis.has(str.substring(0, 2));  
	};
}

module.exports = function(app) { return new main(app); };

