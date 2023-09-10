async function importEvents() {
	app.log.info("SYSTEM", "Importing events...");
	app.events = new Collection();
	const eventFiles = glob.sync(`${botDirectory}/evts/**/*.js`);
	try {
		for (let file of eventFiles) {
			if (file.endsWith(".js")) {
				const startImport = new Date().getTime();
				// Cache require() calls
				if (!app.events.has(file)) {
					let event = require(file)();
					const eventMeta = event.meta();
					if (eventMeta.type == "rest") app.client.rest.on(eventMeta.name, (...args) => event.run(app, args));
					else app.client.on(eventMeta.name, (...args) => event.run(app, args));
					app.events.set(file, event);
					app.log.debug("SYSTEM", `Imported ${eventMeta.type} event - ${eventMeta.name} in ${new Date().getTime() - startImport}ms.`);
				} else {
					app.log.debug("SYSTEM", `Event - ${file} already imported.`);
				}
			}
		}
	} catch(Ex) {
		console.log(Ex);
	}
}