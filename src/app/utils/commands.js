async function importCommands() { 
	const commands = glob.sync(`${botDirectory}/cmds/**/**/*.js`);
	for (const file of commands) {
		try {
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
		} catch (Ex) {
			app.log.error("SYSTEM", `Could not load command - ${file}!`);
			console.log(Ex);
		}
	}
}