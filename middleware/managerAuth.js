const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try{
    
    const decoded=jwt.verify(req.headers.authorization.split(' ')[1],'sasya');
    req.userData=decoded;
    if(decoded.userRole!=='manager'){
        return res.status(403).json({
            message: 'Access forbidden'
        });
    }
    next();
    }
    catch(error)
    {
        if(error.name === 'TokenExpiredError'){
            return res.status(400).json({
                message:'token has expired'
            })
        }
        else{
        return res.status(400).json({
            message:'Auth failed'
        });
    }
    }
}
