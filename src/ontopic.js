const { getAccountId, createQueue, subscribeToQueue, deleteQueue, deleteSubscription, getMessages } = require('./aws');

let QueueUrl;
let SubscriptionArn;

const listen = async (topic, region) => {
    const accountId = await getAccountId();
    const queue = await createQueue(topic, region, accountId);

    QueueUrl = queue.url;

    const subscription = await subscribeToQueue(topic, queue.arn);

    SubscriptionArn = subscription.arn;

    console.log('Listening....');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const messages = await getMessages(queue.url);
        console.dir(messages, { colors: true });
    }
};

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach((sig) => {
    process.on(sig, async () => {

        if (SubscriptionArn) {
            console.log('Deleting ' + SubscriptionArn);
            await deleteSubscription(SubscriptionArn);
        }
        if (QueueUrl) {
            console.log('Deleting ' + QueueUrl);
            await deleteQueue(QueueUrl);
        }

        process.exit(0);
    });
});

module.exports = { listen };
