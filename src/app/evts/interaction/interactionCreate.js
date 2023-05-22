//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class interactionCreate {
	constructor() {
		this.functions = [];
	}

	meta = () => {
		return {
			name: "interactionCreate",
			type: "normal",
			author: "Aisuruneko",
			version: "1.0.0"
		};
	};

	add = (fun) => {
		this.functions.push(fun);
	};

	run = (app, params) => {
		this.default(app, params); // Run default function
		for (let func of this.functions) {
			this.functions[func](app, params);
		}
	};

	default = async(app, params) => {
		const interaction = params[0];
		if (interaction.isChatInputCommand()) {
			const command = app.commands.slash.get(interaction.commandName);
			if (!command) return interaction.reply("I couldn't find that command.");

			try {
				await command.slashRun(app, interaction);
			} catch (Ex) {
				interaction.reply(`Something went wrong! - ${Ex.message}`);
				console.log(Ex);
			}
		}
	};
}

module.exports = function() { return new interactionCreate(); };