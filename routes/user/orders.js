const express = require('express');
const router = express.Router();
const max=100;
const User=require('../../models/users');
const checkAuth=require('../../middleware/auth');
const products=require('../../models/products');
//getting order details of user
router.get('/',checkAuth, (req, res,next) => {
    const userId = req.userData.userId;
    User.findOne({userId}).exec()
    .then(user=>{
        if(!user){
            return res.status(400).json({
                message:'user not found'
            })
        }
        else{
            res.status(200).json({
                message:'listed order details of user',
                userId:userId,
                orderDetails:user.orderDetails
            })
        }
    })
    .catch(err=>{
        return res.status(500).json({
            message:'Internal server error'
        })
    });
});
//ordering food
router.post('/',checkAuth, async (req, res, next) => {
    const userId = req.userData.userId;
    const { date, items } = req.body;

    try {
        const user = await User.findOne({ userId }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        let totalAmount = 0;
        const orderItems = [];
        const plasticItems = [];

        for (const item of items) {
            try {
                const product = await products.findOne({ itemName: item.itemName }).exec();
                if (!product) {
                    return res.status(400).json({
                        message: 'Product is not available'
                    });
                }
                const token = Math.floor(Math.random() * max);

                if (product.category === 'plastic') {
                    const itemDetails = {
                        date: date,
                        itemName: item.itemName,
                        token: token,
                        quantity: item.quantity
                    };
                    plasticItems.push(itemDetails);
                    totalAmount += ((product.cost + 10) * item.quantity);
                } else {
                    const itemDetails = {
                        itemName: item.itemName,
                        quantity: item.quantity
                    };
                    orderItems.push(itemDetails);
                    totalAmount += (product.cost * item.quantity);
                }
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        }
        const status = 'pending';
        const token = Math.floor(Math.random() * max);
        const order_details={ date, orderItems, totalAmount, status,token};
        
        user.orderDetails.push(order_details);
        user.plasticDetails.push(...plasticItems);
        await user.save();
        
        return res.status(200).json({
            message: 'Ordered placed',
            items:items,
            totalAmount: totalAmount
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

//confirming order by user
//took orderid
router.put('/confirm',checkAuth, async (req, res, next) => { 
    const userId = req.userData.userId;
    const { orderId } = req.body;
    
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
        order.status = 'confirmed';
        await user.save();
        return res.status(200).json({ message: 'Order confirmed successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});
// cancelling order
router.put('/cancel',checkAuth,async (req,res,next)=>{
    const userId = req.userData.userId;
    const { orderId } = req.body;
    
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
        order.status = 'cancelled';
        await user.save();
        return res.status(200).json({ message: 'Order cancelled successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});
//payment
router.put('/pay',checkAuth,async (req,res,next)=>{
    const userId = req.userData.userId;
    const { orderId } = req.body;
    
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
        order.status = 'paid';
        await user.save();
        return res.status(200).json({ message: 'payment successfull' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    };
});
module.exports = router;

