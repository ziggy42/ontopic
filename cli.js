#!/usr/bin/env node

const { ArgumentParser } = require('argparse');
const { listen } = require('./src/ontopic');
const { version, description, name } = require('./package.json');

const DEFAULT_AWS_REGION = 'eu-central-1';

const parser = new ArgumentParser({
    addHelp: true,
    prog: name,
    description,
    version
});

parser.addArgument(
    ['-r', '--region'],
    {
        help: 'AWS region to use for the queue. If absent, it will be set to the environment variable '
            + `AWS_DEFAULT_REGION, AWS_REGION or defaulted to ${DEFAULT_AWS_REGION}.`,
        defaultValue: process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || DEFAULT_AWS_REGION
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
