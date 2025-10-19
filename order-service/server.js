const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const fetch = require('node-fetch');
const Order = require('./models/Order');

const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/orderdb';
const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3102';


let channel;
(async function connectRabbit() {
    try {
        const conn = await amqp.connect(rabbitUrl);
        channel = await conn.createChannel();
        await channel.assertQueue('order_events', { durable: false });
        console.log('Connected to RabbitMQ');
    } catch (e) {
        console.error('RabbitMQ error', e.message);
    }
})();


mongoose.connect(mongoUrl)
    .then(() => console.log('Order DB connected'))
    .catch(err => console.error('❌ MongoDB error:', err.message));


app.post('/create', async (req, res) => {
  const { userId, items } = req.body;

  try {
    // Reserve products (parallel)
    await Promise.all(items.map(async it => {
      const r = await fetch(`${productServiceUrl}/reserve`, {
        method: 'post',
        body: JSON.stringify({ productId: it.productId, qty: it.qty }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!r.ok) {
        const detail = await r.text();
        throw new Error(`Reserve failed for product ${it.productId}: ${detail}`);
      }
    }));

    // Create order
    const order = new Order({ userId, items, status: 'created' });
    await order.save();

    // Emit event to RabbitMQ
    if (channel) {
      channel.sendToQueue(
        'order_events',
        Buffer.from(JSON.stringify({ orderId: order._id, userId }))
      );
    } else {
      console.warn('⚠️ RabbitMQ channel not ready');
    }

    res.status(201).json(order);

  } catch (e) {
    console.error('❌ Order creation failed:', e.message);
    res.status(500).json({ error: e.message });
  }
});



app.get('/list', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});


app.get('/', (req, res) => res.send('Order Service'));


app.listen(3103, () => console.log('Order service listening on 3103'));