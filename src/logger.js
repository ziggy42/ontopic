const chalk = require('chalk');
const log = console.log;

const logMessage = ({ Timestamp, Message, MessageAttributes }) => {
    log();

    log(`${chalk.green(Timestamp)} message received:`);
    log(`Message:\n${chalk.cyan(Message)}\n`);
    if (MessageAttributes) {
        log(`Attributes:\n${chalk.cyan(JSON.stringify(MessageAttributes, null, 2))}`);
    }
};

module.exports = { logMessage };
