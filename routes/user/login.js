const mongoose=require('mongoose');
const express = require('express');
const bcrypt=require('bcrypt');
const {signAccessToken}=require('../../helpers/jwt_helper');
const router = express.Router();
const User=require('../../models/users');
const Manager=require('../../models/managers')
//manager authentication
router.post('/', async (req, res, next) => {
    const { userId, password ,userRole} = req.body;
    if(userRole === 'manager'){
        Manager.findOne({userId}).exec()
    .then(manager=>{
        if(!manager){
           return  res.status(400).json({
                message:'Invalid Credentials'
            });
        }
        if(manager.password===password){
            signAccessToken(manager.userId,userRole)
                .then(token=>{
                    return res.status(200).json({
                        message:'Logged in Successfully',
                        token:token
                    });
                })
                .catch(err=>{
                    console.log(err);
                    return res.status(500).json({
                        message:'Internal server error'
                    });
                });
        }
        else{
            return  res.status(400).json({
                message:'Invalid Credentials'
            });
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message:'Internal server error.'
        })
    });
    }
    else{
    User.findOne({userId}).exec()
    .then(user=>{
        if(!user){
           return  res.status(400).json({
                message:'Invalid Credentials'
            });
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(err){
                console.log(err);
                return  res.status(400).json({
                    message:'Invalid Credentials'
                });
            }
            if(result){
                signAccessToken(user.userId,userRole)
                .then(token=>{
                    return res.status(200).json({
                        message:'Logged in Successfully',
                        token:token
                    });
                })
                .catch(err=>{
                    console.log(err);
                    return res.status(500).json({
                        message:'Internal server error'
                    });
                });
                
            }
            else{
                console.log(password);
                return  res.status(400).json({
                    message:'Invalid Credentials'
                });
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message:'Internal server error.'
        })
    });
}
   
});


module.exports = router;