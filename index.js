const { ArgumentParser } = require('argparse');
const { listen } = require('./src/ontopic');

const DEFAULT_AWS_REGION = 'eu-central-1';

const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Listen to SNS notifications'
});

parser.addArgument(
    ['-r', '--region'],
    {
        help: `AWS region to use. Defaults to ${DEFAULT_AWS_REGION}`,
        defaultValue: DEFAULT_AWS_REGION,
    }
);

parser.addArgument('topicArn', {
    help: 'The SNS Topic ARN to subscribe to'
});

(async () => {
    const { topicArn, region } = parser.parseArgs();

    try {
        await listen(topicArn, region);
    } catch (err) {
        console.dir(err, { colors: true });
    }
})();
