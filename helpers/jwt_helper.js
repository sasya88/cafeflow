const jwt = require('jsonwebtoken');

module.exports = {
    signAccessToken: (userId,userRole) => {
        return new Promise((resolve, reject) => {
            const payload = {
                userId: userId,
                userRole:userRole
            };
            const options = {
                expiresIn: '1h'
            };
            
            jwt.sign(payload, process.env.JWT_KEY, options, (err, token) => {
                if (err) {
                    console.log('error signing access token:', err);
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }
};
