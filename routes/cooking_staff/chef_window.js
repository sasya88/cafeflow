const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const checkAuth = require('../../middleware/auth');
//getting all active orders
//has to change response json
router.get('/orders', (req, res, next) => {
    User.find({ 'orderDetails.status': 'paid' })
        .select('userId orderDetails')
        .exec()
        .then(users => {
            const AllOrderDetails = users.map(user => ({
                userId: user.userId,
                orderDetails: user.orderDetails
            .filter(order => order.status === 'paid')
            .map(order => ({
                date: order.date,
                itemName: order.itemName,
                quantity: order.quantity,
                token:order.token
            }))
            }));
            return res.status(200).json({
                message: 'active orders',
                AllOrderDetails: AllOrderDetails
            });
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal server error.'
            });
        });
});
//notifying user 
router.post('/notify/:orderId',async (req,res,next)=>{
    const orderId=req.params.orderId;
    const {userId}=req.body;
    try {
        const user = await User.findOne({ userId }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const order = user.orderDetails.find(order => order._id.toString() === orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        order.status = 'ready';
        await user.save();
        return res.status(200).json({ message: 'order is ready' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});
//delivered
router.post('/deliver/:orderId',async (req,res,next)=>{
    const orderId=req.params.orderId;
    const {userId}=req.body;
    try {
        const user = await User.findOne({ userId }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const order = user.orderDetails.find(order => order._id.toString() === orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        order.status = 'delivered';
        await user.save();
        return res.status(200).json({ message: 'order delivered' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});
//selecting items for cooking
router.post('/select/:orderId',async (req,res,next)=>{
    const orderId=req.params.orderId;
    const {userId}=req.body;
    try {
        const user = await User.findOne({ userId }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const order = user.orderDetails.find(order => order._id.toString() === orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        order.status = 'in progress';
        await user.save();
        return res.status(200).json({ message: 'order is getting ready' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
    
});
module.exports = router;
