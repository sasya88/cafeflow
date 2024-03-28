const express=require('express');
const router=express.Router();
const checkAuth=require('../../middleware/auth');
const User=require('../../models/users');
router.get('/',checkAuth,(req,res,next)=>{
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
                message:'listed plastic items of user',
                userId:userId,
                plasticDetails:user.plasticDetails
            })
        }
    })
    .catch(err=>{
        console.log(err);
        return res.status(400).json({
            message:'Internal server error'
        })
    });
});
router.get('/plastic_count',checkAuth,(req,res,next)=>{
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
                message:'listed count of plastic items of user',
                userId:userId,
                plasticCount:user.plasticDetails.length
            })
        }
    })
    .catch(err=>{
        console.log(err);
        return res.status(400).json({
            message:'Internal server error'
        })
    });
});
//select
//de select
//returning (quantity)
router.post('/return',checkAuth,(req,res,next)=>{
    const userId = req.userData.userId;
    const {date,item,token}=req.body;
    User.findOne( {userId})
        .exec()
    .then(user=>{
        if(!user){
            return res.status(400).json({
                message:'user not found'
            })
        }
        
        else{
            if(user.plasticDetails.length===0){
                return res.status(400).json({
                    message:'no palstics items to return'
                })
            }
            else{
            user.plasticDetails.pull({date,item,token});
            user.save()
            .then(result=>{
                res.status(200).json({
                    message:'returned plastic item',
                    userId:userId,
                    plasticItem:{date,item,token}
                })
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    message:'Internal server error'
                })
            })
        }
        }
    })
    .catch(err=>{
        return res.status(500).json({
            message:'Internal server error'
        })
    });
});
module.exports=router;