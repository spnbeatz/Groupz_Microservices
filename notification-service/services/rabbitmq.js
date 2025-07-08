const amqp = require('amqplib');
const {Notification} = require("../database/models/notificationModel");
const { getIo } = require("./socket");
const userService = require("../services/userService");

async function connectRabbitMQ() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('postQueue', { durable: true });

    channel.consume('postQueue', async (msg) => {
        if (msg !== null) {
            const message = JSON.parse(msg.content.toString());
            console.log("otrzymano wiadomosc o nowym poscie: ", message.content, message.token);

            const notification = new Notification({
                contentId: message.contentId,
                content: `Nowy post: ${message.content}`
            });

            await notification.save();

            const io = getIo();

            const subscibers = message.subscribers // zamiast tego pobierz uzytkownikow ktorzy interesuja sie tym kontentem

            subscibers.forEach((user) => {
                // zapis do bazy danych id notyfikacji w liscie
                io.to(user.socketId).emit('new-notification', notification)
                
            })

            channel.ack(msg)
        }
    })
}

module.exports = { connectRabbitMQ }