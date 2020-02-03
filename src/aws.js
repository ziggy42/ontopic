const { STS, SQS, SNS } = require('aws-sdk');
const { v4 } = require('uuid');
const { chunk } = require('./utils');

const sqs = new SQS();
const sns = new SNS();
const sts = new STS();

const MAXIMUM_WAIT_TIME_SECONDS = 20;

const tags = {
    'ontopic': 'This resource was automatically created by ontopic and can be safely deleted'
};

const getAccountId = async () => {
    const { Account } = await sts.getCallerIdentity().promise();
    return Account;
};

const createQueue = async (topicArn, region, accountId) => {
    const QueueName = v4();
    const { QueueUrl } = await sqs.createQueue({
        Attributes: {
            Policy: JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: '*',
                        Action: 'SQS:SendMessage',
                        Resource: `arn:aws:sqs:${region}:${accountId}:${QueueName}`,
                        Condition: {
                            ArnEquals: {
                                'aws:SourceArn': topicArn
                            }
                        }
                    }
                ]
            })
        },
        QueueName,
        tags
    }).promise();

    return {
        name: QueueName,
        url: QueueUrl,
        arn: `arn:aws:sqs:${region}:${accountId}:${QueueUrl.split('/').pop()}`
    };
};

const subscribeToQueue = async (topicArn, queueArn) => {
    const { SubscriptionArn } = await sns.subscribe({
        Protocol: 'sqs',
        TopicArn: topicArn,
        Endpoint: queueArn
    }).promise();
    return { arn: SubscriptionArn };
};

const deleteQueue = async (QueueUrl) => sqs.deleteQueue({ QueueUrl }).promise();

const deleteSubscription = async (SubscriptionArn) => sns.unsubscribe({ SubscriptionArn }).promise();

const getMessages = async (QueueUrl) => {
    const { Messages } = await sqs.receiveMessage({
        QueueUrl,
        WaitTimeSeconds: MAXIMUM_WAIT_TIME_SECONDS
    }).promise();

    if (!Messages) {
        return [];
    }

    const batches = chunk(Messages.map(({ ReceiptHandle, MessageId: Id }) => ({ ReceiptHandle, Id })), 10);

    await Promise.all(
        batches.map((Entries) => sqs.deleteMessageBatch({ Entries, QueueUrl }).promise())
    );

    return Messages.map(({ Body }) => JSON.parse(Body));
};

module.exports = { getAccountId, createQueue, subscribeToQueue, deleteQueue, deleteSubscription, getMessages };
