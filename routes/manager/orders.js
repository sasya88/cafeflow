const express = require('express');
const router = express.Router();
const User=require('../../models/users');
const checkAuth=require('../../middleware/managerAuth');
router.get('/:id',checkAuth, async (req, res,next) => {
    const userId=req.params.id;
    try {
        const user = await User.findOne({ userId }).exec();
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: ' orders listed of specific user',
            orderDetails:user.orderDetails
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
        const orderDetails=users.map(user=>{
            return {
                userId:user.userId,
                orderDetails:user.orderDetails
            }
        });
        return res.status(200).json({
            message: 'All orders listed',
            orderDetails:orderDetails
        });
         
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
            message:'Internal server error.'
        });
    });
    
});

module.exports = router;
