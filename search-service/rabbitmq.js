const amqp = require("amqplib");

const startConsumer = async (esClient) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME, { durable: true });

        console.log(`✅ Listening on queue: ${process.env.QUEUE_NAME}`);

        channel.consume(process.env.QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const product = JSON.parse(msg.content.toString());
                console.log("📥 Received:", product);

                // 📌 Wstawianie do Elasticsearch
                await esClient.index({
                    index: "search",
                    id: product._id.toString(),
                    body: {
                        id: product._id.toString(),
                        username: product.username,
                        email: product.email,
                        avatar: product.avatar,  // Przechowywane, ale nie indeksowane
                        category: "users"        // Przechowywane, ale nie indeksowane
                    }
                });

                console.log("✅ Added to Elasticsearch:", product);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("❌ RabbitMQ Consumer Error:", error.message);
    }
};

module.exports = startConsumer
