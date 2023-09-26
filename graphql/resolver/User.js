const fs = require("fs");
const path = require("path");
const {bearerTokenSplit ,tokenVerify ,generateAccessToken , generateRefreshToken} = require(__dirname + "/../jwt.js")
const {getUserList , setUserList , getUserLastNum , setUserLastNum}= require(__dirname + "/../db.js")

module.exports = {
    Query: {
        getUser: function (_, { id }, context) {
            console.log(context);

            var data = getUserList().find(function (user) {
                console.log(user);
                console.log(id);
                console.log(user.id == id);
                return user.id == id;
            });
            console.log(data);
            return data;
        },
    },
    Mutation: {
        getUserInfo: function (_, _, context) {
            console.log(context);
            let bearerToken = context.req.header("authorization");

            if (bearerToken) {
                let accessToken = bearerTokenSplit(bearerToken);
                let UserId = tokenVerify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                console.log(UserId);
                if (UserId) {
                    return UserInfo(UserId);
                } else {
                    return null;
                }
            } else {
                return null;
            }

            //
        },

        getAccessToken: function (_, _, context) {
            let bearerToken = context.req.header("authorization");
            if (bearerToken) {
                let reflashToken = bearerTokenSplit(bearerToken);
                console.log(reflashToken);
                let UserId = tokenVerify(reflashToken, process.env.REFRESH_TOKEN_SECRET);
                console.log(UserId);
                if (UserId) {
                    console.log(generateAccessToken(UserId));
                    return generateAccessToken(UserId);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        UserSignUp:async function (_, { email, password, name }) {
            let UserList = getUserList();
            try {
                var user = UserList.find(function (user) {
                    return user.email == email;
                });

                if (user) {
                    return { success: false, message: "이미사용하고 있는 이메일 입니다." };
                }
                let userId = getUserLastNum() + 1
                let newUser = new User(userId, name, email, password, 2);

                UserList.push(JSON.parse(JSON.stringify(newUser)));
                console.log(UserList)
                await setUserList(UserList);
                await setUserLastNum(userId)
                return { success: true, message: "성공" };
            } catch (error) {
                return false;
            }
        },
        UserLogin: function (_, { email, password }) {
            var user = getUserList().find(function (user) {
                return user.email == email && user.password == password;
            });
            
            if (user) {
                let accessToken = generateAccessToken(user.id);
                let refreshToken = generateRefreshToken(user.id);
                console.log(accessToken.signature);

                return { accessToken, refreshToken };
            } else {
                return null;
            }
        },

        UserLogout: function (_, _, context) {
            return "logout success";
        },
    },
};


function UserInfo(id) {
    var user = getUserList().find(function (user) {
        return user.id == id;
    });
    return user;
}

class User {
    constructor(id, name, email, password, authority) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.authority = authority;
    }
}
