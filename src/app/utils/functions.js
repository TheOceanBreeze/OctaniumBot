async function importFunctions() {
	// Cache require() calls
	if (!app.functions.updateChecker) {
		app.functions.updateChecker = require(`${botDirectory}/func/update.js`)(app);
		app.functions.updateChecker.init();
	}
}