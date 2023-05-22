//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

class messageCreate {
	constructor() {
		this.functions = [];
	}

	meta = () => {
		return {
			name: "messageCreate",
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
		let message = params[0];
		message = await message.fetch().catch(err => { console.error(err); });
		if (!message) return;

		if (!message.content.startsWith(process.env.COMMANDS_PREFIX_DEFAULT)) return;
		return message.reply("Messages are deprecated. Use Slash Commands instead.");
	};
}

module.exports = function() { return new messageCreate(); };