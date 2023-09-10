//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

const cmdArgs = Bun.argv.slice(2);

const debugMode = cmdArgs.includes("--debug") || cmdArgs.includes("-d"); // Determine if user wants debug.
console.log(debugMode);

const clearCacheCmd = cmdArgs.includes("--clearCache") || cmdArgs.includes("-cc");
console.log(clearCacheCmd);

import runBot from "./src/bot.js";
runBot(debugMode, clearCacheCmd);

// require(`${process.cwd()}/src/bot.js`)(debugMode, clearCacheCmd);