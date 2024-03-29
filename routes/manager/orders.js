const express = require('express');
const router = express.Router();
const User=require('../../models/users');
const checkAuth=require('../../middleware/managerAuth');
router.get('/:id', checkAuth,async (req, res,next) => {
    const userId=req.params.id;
    try {
        const user = await User.findOne({ userId }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        const pendingOrders = {
            userId: user.userId,
            orderDetails: user.orderDetails
            .filter(order => order.status === 'pending')
            .map(order => ({
                date: order.date,
                itemName: order.itemName,
                quantity: order.quantity,
                token:order.token
            }))
        };
        return res.status(200).json({
            message: ' orders listed of specific user',
            orderDetails:pendingOrders
        });
        
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
    
});
router.get('/', checkAuth,(req, res,next) => {
    User.find()
    .exec()
    .then(users=>{
        const usersWithPendingOrders = users.filter(user => {
            return user.orderDetails.some(order => order.status === 'pending');
        });

        const pendingOrders = usersWithPendingOrders.map(user => ({
            userId: user.userId,
            orderDetails: user.orderDetails
            .filter(order => order.status === 'pending')
            .map(order => ({
                date: order.date,
                itemName: order.itemName,
                quantity: order.quantity,
                token:order.token
            }))
        }));
        return res.status(200).json({
            message: 'All orders listed',
            orderDetails:pendingOrders
        });
         
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
            message:'Internal server error.'
        });
    });
    
});
//route accepting the order
router.put('/accept',checkAuth,async (req,res,next)=>{
    const {userId,orderId}=req.body;
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
        order.status = 'accepted';
        await user.save();
        return res.status(200).json({ message: 'Order is accepted by manager' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});
//route for rejecting order by manager
router.put('/reject',checkAuth,async (req,res,next)=>{
    const {userId,orderId}=req.body;
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
        order.status = 'Rejected';
        await user.save();
        return res.status(200).json({ message: 'Order is rejected by manager' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});
module.exports = router;
