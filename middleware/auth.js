const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try{
    
    const decoded=jwt.verify(req.headers.authorization.split(' ')[1],'sasya');
    req.userData=decoded;
    next();
    }
    catch(error)
    {
        console.log(error);
        return res.status(400).json({
            message:'Auth failed'
        })
    }
}