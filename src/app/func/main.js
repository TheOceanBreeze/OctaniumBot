//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class main {
	constructor(app) {
		this.app = app;
	}
	sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };
	clearCache = (mod) => {
		if (!mod) Object.keys(require.cache).forEach(function(key) { delete require.cache[key]; });
		else delete require.cache[mod];
	};

	getID = (string) => { return string.replace(/[<#@&!>]/g, ""); };
	getTicks = () => { return ((new Date().getTime() * 10000) + 621355968000000000); };

	attachmentGrabber = (attachment) => {
		const imageLink = attachment.split(".");
		const typeOfImage = imageLink[imageLink.length - 1];
		const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage); // ew regex, but its ok
		return (image) ? attachment : "";
	};
	removeFromArr = (arr, value) => { return arr.filter(e => e !== value); };
	isAnimated = (str) => { return str.substring(0, 2) === "a_"; };
}

module.exports = function(app) { return new main(app); };