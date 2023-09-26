const jwt = require("jsonwebtoken");
module.exports = {
     bearerTokenSplit :function(bearerToken) {
        var bearer = bearerToken.split(" ");
        return bearer[1];
    },
     tokenVerify : function(token, TokenSecret) {
        try {
            let userTokenInfo = jwt.verify(token, TokenSecret);
            return userTokenInfo.id;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    // access token을 secret key 기반으로 생성
     generateAccessToken :function(id){
        let expiresIn = 60 * 1000;
        var signature = jwt.sign(
            {
                id: id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: expiresIn,
                issuer: "psha",
            }
        );
        let today = new Date();
        let exp = today.getTime() + expiresIn;
    
        return { signature, exp };
    },
    
    // refersh token을 secret key  기반으로 생성
    generateRefreshToken :function(id){
        let expiresIn = 60 * 10 * 1000;
        var signature = jwt.sign(
            {
                id: id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: expiresIn,
                issuer: "psha",
            }
        );
        let today = new Date();
        let exp = today.getTime() + expiresIn;
    
        return { signature, exp };
    }
    
}
