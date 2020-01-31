#!/usr/bin/env node

const { ArgumentParser } = require('argparse');
const { listen } = require('./src/ontopic');
const { version } = require('./package.json');

const DEFAULT_AWS_REGION = 'eu-central-1';

const parser = new ArgumentParser({
    version,
    addHelp: true,
    description: 'Listen to SNS notifications'
});

parser.addArgument(
    ['-r', '--region'],
    {
        help: `AWS region to use. Defaults to ${DEFAULT_AWS_REGION}.`,
        defaultValue: DEFAULT_AWS_REGION,
    }
);

parser.addArgument('topicArn', {
    help: 'The SNS Topic ARN to subscribe to.'
});

(async () => {
    try {
        await listen(parser.parseArgs());
    } catch (err) {
        console.dir(err, { colors: true });
    }
})();
