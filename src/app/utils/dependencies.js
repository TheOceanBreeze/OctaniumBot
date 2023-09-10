async function importDependencies() {
	try {
		if (app.system.dependencies) {
			app.log.info("SYSTEM", "Importing dependencies...");
			if (!app.dependencies) app.dependencies = {};
			for (let [dep, dependency] of Object.entries(app.system.dependencies)) {
				// Cache require() calls
				if (!app.dependencies[dependency.name]) {
					app.dependencies[dependency.name] = require(dependency.name);
				}
				// Additional configuration for some modules if needed
				if (dependency.name == "dotenv") app.dependencies[dependency.name].config();
				// Log that dependency was properly installed
				app.log.info("SYSTEM", `Imported dependency: ${dependency.name}`);
			}
			return; // Return undefined if the function runs successfully
		}
	} catch (Ex) {
		console.log("Error:" + Ex);
		throw Ex; // Throw an error if there is an error
	}
}