import amqp from "amqplib";

let connection, channel;

// Rabbit MQ connection
async function start() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    await channel.assertQueue("task_created");

    console.log("Connected to RabbitMQ ✅");
    console.log("Notification service is listening to messages! 🔔");

    channel.consume("task_created", (message) => {
      const taskData = JSON.parse(message.content.toString());

      console.log("🔔 New Task Notification:", taskData.title);
      console.log("📦 Full Task Data:", taskData);

      channel.ack(message);
    });

  } catch (error) {
    console.error("RabbitMQ connection error:", error.message);
  }
}

start();
