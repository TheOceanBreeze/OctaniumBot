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
			name: "reconnect",
			description: "Reconnect the bot",
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
	};
	
	execute = (app) => {
		console.log(process.env.BOT_TOKEN);
		app.client.destroy().catch(err => { throw new Error("Failed to destroy the client." + err); });
		app.log.info("DISCORD", "Now logging in...");
		app.client.login(process.env.BOT_TOKEN).catch((err) => {
			process.exitcode = -1;
			throw new Error("Failed to login to Discord" + err);
		});
		return {
			embeds: [{
				title: "Bot Status",
				color: app.system.embedColors.blue,
				description: "Reconnecting the bot...",
				footer: { text: app.footerText }
			}]
		};
	};
}

module.exports = function() { return new command(); };