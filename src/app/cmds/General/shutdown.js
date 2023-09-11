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
			name: "shutdown",
			description: "Shutdown the bot",
			author: "TheOceanBreeze",
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
		app.log.debug("SYSTEM", "Starting shutdown procedure");
		app.log.debug("SYSTEM", "Setting Bot to Status Offline/Invisisble");
		app.client.user.setPresence({ status: "offline" });
		app.log.debug("SYSTEM", "Destroying Client");
		// eslint-disable-next-line n/no-process-exit
		app.client.destroy().catch(err => {if (err.code === "ABORT_ERR") console.error("The Websocket was aborted"); else console.error("Failed to destroy Client. Crashing manually." + err); });
		app.log.debug("SYSTEM", "Goodbye!");
	};
	
	execute = (app) => {
		return {
			embeds: [{
				title: "Shutting Down",
				color: app.system.embedColors.blue,
				description: ":wave: Goodbye!",
				footer: { text: app.footerText }
			}]
		};
	};
}

module.exports = function() { return new command(); };