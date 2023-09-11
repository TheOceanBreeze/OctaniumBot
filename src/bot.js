//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

async function start(debugMode, clearCacheCmd) {
	// Init
	const startTime = new Date().getTime();
	const botDirectory = `${Bun.cwd}/src/app`;
	const app = require(`${botDirectory}/cfg/system.js`);
	app.debugMode = debugMode;
	app.startUp = {
		startTime,
		finishTime: 0
	};
	app.botDirectory = botDirectory;
	app.functions = require(`${botDirectory}/func/main.js`)(app);


	app.log = require(`${botDirectory}/func/logger.js`)(app);
	if (clearCacheCmd) app.log.debug("SYSTEM", "Clearing cache") && app.functions.clearCache();
	app.log.debug("SYSTEM", "Hello World! Now starting up!");
	// Import dependencies
	async function importDependencies() {
		const dependencyCache = new Map();
		try {
			if (app.system.dependencies) {
				app.log.info("SYSTEM", "Importing dependencies...");
				if (!app.dependencies) app.dependencies = {};
				await Promise.all(Object.values(app.system.dependencies).map(async dependency => {
					if (dependencyCache.has(dependency.name)) {
						const cachedDependency = dependencyCache.get(dependency.name);
						app.log.info("SYSTEM", `Imported dependency from cache: ${dependency.name}`);
						return cachedDependency;
					} 
					else {
						return import(`${dependency.name}`).then(mod => {
							if (dependency.name == "dotenv") mod.config();
							app.dependencies[dependency.name] = mod;
							dependencyCache.set(dependency.name, mod);
							app.log.info("SYSTEM", `Imported dependency: ${dependency.name} in ${new Date().getTime() - startTime}ms`);
						});
					}
				})).catch(Ex => {
					console.log(`Error: ${Ex}`);
				});
				return; // Return undefined if the function runs successfully
			}
		} catch (Ex) {
			console.log("Error:" + Ex);
			throw Ex; // Throw an error if there is an error
		}
	}
	await importDependencies();

	const glob = app.dependencies["glob"];
	const { Client, GatewayIntentBits, Partials, Collection, PermissionsBitField } = app.dependencies["discord.js"];

	async function configureClient() {
		// Move client configuration into a separate function
		app.log.info("SYSTEM", "Configuring Discord Client...");
		app.client = new Client({
			ws: {
				WebSocket: Bun.WebSocket
			},
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent,
			],
			partials: [
				Partials.Channel,
				Partials.Message,
				Partials.User,
				Partials.GuildMember,
				Partials.Reaction
			]
		});

	}
	configureClient();

	async function login() {
		// Login now!!
		app.log.info("DISCORD", "Now logging in...");
		app.client.login(process.env.BOT_TOKEN).catch((err) => {
			process.exitcode = -1;
			throw new Error("Failed to login to Discord" + err);
		});
	}
	login();

	async function importFunctions() {
		// Cache require() calls
		if (!app.functions.updateChecker) {
			app.functions.updateChecker = require(`${botDirectory}/func/update.js`)(app);
			app.functions.updateChecker.init();
		}
	}
	importFunctions();

	// Import events
	async function importEvents() {
		app.log.info("SYSTEM", "Importing events...");
		app.events = new Collection();
		const eventFiles = glob.sync(`${botDirectory}/evts/**/*.js`);
		try {
			await Promise.all(
				eventFiles.map(async (file) => {
					if (file.endsWith(".js")) {
						const startImport = new Date().getTime();
						if (!app.events.has(file)) {
							let event = await require(file)();
							const eventMeta = event.meta();
							if (eventMeta.type == "rest") {
								app.client.rest.on(eventMeta.name, (...args) =>
									event.run(app, args)
								);
							} else {
								app.client.on(eventMeta.name, (...args) =>
									event.run(app, args)
								);
							}
							app.events.set(file, event);
							app.log.debug(
								"SYSTEM",
								`Imported ${eventMeta.type} event - ${eventMeta.name} in ${new Date().getTime() - startImport
								}ms.`
							);
						} else {
							app.log.debug("SYSTEM", `Event - ${file} already imported.`);
						}
					}
				})
			);
		} catch (error) {
			console.error(error);
		}
	}
	importEvents();

	async function importCommands() {
		app.log.info("SYSTEM", "Importing commands...");
		app.commands = {
			slash: new Collection(),
			prefix: new Collection(),
			slash_data: []
		};
		const commands = glob.sync(`${botDirectory}/cmds/**/**/*.js`);
		await Promise.all(commands.map(async (file) => {
			const command = require(file)();
			const commandMeta = command.meta();
			if (process.env.COMMANDS_SLASH_ENABLED == "true" && commandMeta.supportsSlash) {
				await app.commands.slash.set(commandMeta.name, command);
				await app.commands.slash_data.push({
					name: commandMeta.name,
					type: commandMeta.type || 1,
					description: commandMeta.description,
					options: commandMeta.options,
					default_permission: commandMeta.permissions.DEFAULT_PERMISSIONS || null,
					default_member_permissions: commandMeta.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(commandMeta.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null,
				});
				app.log.debug("SYSTEM", `Imported slash command - ${commandMeta.name} in ${new Date().getTime() - startTime}ms.`);
			}
		})).catch(Ex => {
			app.log.error("SYSTEM", "Could not load command!");
			console.log(Ex);
		});
	}
	importCommands();


	process.on("SIGINT" || "SIGTERM" || "uncaughtException", (err) => {
		if (err && !"SIGINT" && !"SIGTERM") console.error(err);
		app.log.debug("SYSTEM", "Starting shutdown procedure");
		app.log.debug("SYSTEM", "Setting Bot to Status Offline/Invisisble");
		app.client.user.setPresence({ status: "offline" });
		app.log.debug("SYSTEM", "Destroying Client");
		// eslint-disable-next-line n/no-process-exit
		app.client.destroy().catch(err => {if (err.code === "ABORT_ERR") console.error("The Websocket was aborted"); else console.error("Failed to destroy Client. Crashing manually." + err); });
		app.log.debug("SYSTEM", "Goodbye!");
		return;
	});

	process.on("unhandledRejection", (reason, promise) => {
		console.error("Unhandled Rejection:", reason);
		console.log("Promise:", promise);
		// You can optionally handle or log the unhandled rejection here
	});

}
module.exports = function (debugMode) { return start(debugMode); };
if (require.main === module) { console.log("\x1b[31mPlease call index.js.\x1b[0m"); }