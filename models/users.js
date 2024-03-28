const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    plasticDetails: [
        {
            date: { type: String, required: true },
            itemName: { type: String, required: true },
            token: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    orderDetails: [
        {
            date: { type: String, required: true },
            orderItems: [
                {
                    itemName: { type: String, required: true },
                    quantity: { type: Number, required: true }
                }
            ],
            totalAmount: { type: Number, required: true },
            status: { type: String, required: true },
            token: { type: Number, required: true },
            
        }
    ],
});
module.exports = mongoose.model('User', userSchema);