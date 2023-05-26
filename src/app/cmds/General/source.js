//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class command {
	constructor() {
	}

	meta = () => {
		return {
			name: "source",
			description: "Bot is open source??",
			author: "Aisuruneko",
			version: "1.0.0",

			supportsPrefix: true,
			supportsSlash: true,

			options: [],
			permissions: {
				DEFAULT_MEMBER_PERMISSIONS: ["SendMessages"]
			}
		};
	};

	slashRun = async(app, interaction) => {
		await interaction.reply(this.execute(app));
	};
	
	execute = (app) => {
		return {
			embeds: [{
				title: "Octanium Bot",
				color: app.system.embedColors.blue,
				description: "OctaniumBot is made possible by NetroCorp, as well as those on the GitHub (thanks!)\nYou can obtain the source code and contribute at [here](https://github.com/octaniumdev/OctaniumBot).",
				footer: { text: app.footerText }
			}]
		};
	};
}

module.exports = function() { return new command(); };