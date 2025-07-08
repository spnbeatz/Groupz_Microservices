
const amqp = require("amqplib");

const QUEUE_NAME = process.env.QUEUE_NAME;

const sendToQueue = async (data) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)), { persistent: true });
        console.log("📤 Sent to queue:", data);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("RabbitMQ Publisher Error:", error.message);
    }
};

module.exports = sendToQueue

