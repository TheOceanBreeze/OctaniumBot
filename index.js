//
// TheCodingBot
// Netro Corporation
//
// https://codingbot.gg

const cmdArgs = process.argv.slice(2);

const debugMode = cmdArgs.includes("--debug") || cmdArgs.includes("-d"); // Determine if user wants debug.

require(`${process.cwd()}/src/bot.js`)(debugMode);