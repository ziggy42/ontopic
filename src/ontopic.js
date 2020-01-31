const { getAccountId, createQueue, subscribeToQueue, deleteQueue, deleteSubscription, getMessages } = require('./aws');

let QueueUrl;
let SubscriptionArn;

const listen = async ({ topicArn, region }) => {
    const accountId = await getAccountId();
    const queue = await createQueue(topicArn, region, accountId);

    QueueUrl = queue.url;

    const subscription = await subscribeToQueue(topicArn, queue.arn);

    SubscriptionArn = subscription.arn;

    console.log(`Listening to ${topicArn}...`);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const messages = await getMessages(queue.url);
        messages.forEach((message) => console.dir(message, { colors: true }));
    }
};

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGABRT', 'SIGTERM'].forEach((signal) => process.on(signal, async () => {
    if (SubscriptionArn) {
        console.log('Deleting ' + SubscriptionArn);
        await deleteSubscription(SubscriptionArn);
    }

    if (QueueUrl) {
        console.log('Deleting ' + QueueUrl);
        await deleteQueue(QueueUrl);
    }

    process.exit(0);
}));

module.exports = { listen };
