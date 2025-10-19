const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const app = express();
app.use(express.json());


const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/productdb';
mongoose.connect(mongoUrl).then(() => console.log('Product DB connected'));


app.post('/create', async (req, res) => {
    try {
        const p = new Product(req.body);
        await p.save();
        res.status(201).json(p);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});


app.get('/list', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});


app.post('/reserve', async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const p = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { new: true }
    );
    if (!p) return res.status(400).json({ error: 'Insufficient stock or not found' });
    res.json({ ok: true, product: p });
  } catch (err) {
    console.error('Reserve error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


app.get('/', (req, res) => res.send('Product Service'));


app.listen(3102, () => console.log('Product service listening on 3102'));