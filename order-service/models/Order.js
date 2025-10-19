const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    userId: String,
    items: [{ productId: String, qty: Number }],
    status: String
});
module.exports = mongoose.model('Order', OrderSchema);