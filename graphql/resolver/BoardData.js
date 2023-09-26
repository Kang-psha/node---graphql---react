const fs = require("fs");
const path = require("path");

const { bearerTokenSplit, tokenVerify, generateAccessToken, generateRefreshToken } = require(__dirname + "/../jwt.js");
const { getUserList, setUserList, getPostList, setPostList , getPostLastNum ,setPostLastNum } = require(__dirname + "/../db.js");

module.exports = {
    Query: {},
    Mutation: {
        PostList: function (_, _, context) {
            let bearerToken = context.req.header("authorization");
            let userid = false;
            if (bearerToken) {
                let accessToken = bearerTokenSplit(bearerToken);

                if (accessToken) {
                    userid = tokenVerify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                }
            }

            let userIdName = {};
            let userList = getUserList();
            for (let i = 0; i < userList.length; i++) {
                userIdName[userList[i].id] = userList[i].name;
            }
            let postList = getPostList();
            for (let j = 0; j < postList.length; j++) {
                postList[j].userName = userIdName[postList[j].userId];

                if (userid == 1) {
                    postList[j].authority = true;
                } else {
                    userid == postList[j].userId ? (postList[j].authority = true) : (postList[j].authority = false);
                }

                delete postList[j].userId;
            }

            return postList;
        },

        PostUpload: async function (_, { files, title, desc }, context) {
            console.log(context);
            let bearerToken = context.req.header("authorization");
            let userid = false;

            if (bearerToken) {
                let accessToken = bearerTokenSplit(bearerToken);
                console.log(accessToken);
                if (accessToken) {
                    userid = tokenVerify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                    console.log(userid);
                }
            }
            if (userid) {
                let PostList = getPostList();
              
                let PostId = getPostLastNum() + 1;

                let fileList = [];
                if (files) {
                    let filePath = __dirname + "/../PostFile/" + PostId + "/";
                    if (!fs.existsSync(path.join(filePath))) {
                        fs.mkdirSync(filePath);
                    }

                    for (let i = 0; i < files.length; i++) {
                        let fileArrayBuffer = await files[i].arrayBuffer();
                        let fileName = files[i].name;
                        fileList.push(fileName);

                        await fs.promises.writeFile(path.join(filePath, fileName), Buffer.from(fileArrayBuffer));
                    }
                }
                let newPost = new Post(PostId, title, desc, userid, fileList, dateFormat(new Date()));
                PostList.unshift(JSON.parse(JSON.stringify(newPost)));
                await setPostList(PostList);
                await setPostLastNum(PostId);
                return true;
            } else {
                return false;
            }
        },
        PostModify: async function (_, { files, title, desc, id }, context) {
            console.log(files, title, desc, id);
            let bearerToken = context.req.header("authorization");
            let userid = false;

            if (bearerToken) {
                let accessToken = bearerTokenSplit(bearerToken);
                console.log(accessToken);
                if (accessToken) {
                    userid = tokenVerify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                    console.log(userid);
                }
            }
            if (userid) {
                let PostList = getPostList();
                let newid;
                let newPostList = PostList.filter(function (data) {
                    console.log(data);
                    if (data.id != id) {
                        return true;
                    }
                });

                let postdata = PostList.find(function (data) {
                   
                    if (data.id == id) {
                        return true;
                    }
                });
           
                userid = postdata.userId
                let fileList = [];
                let filePath = __dirname + "/../PostFile/" + id + "/";

                if (fs.existsSync(path.join(filePath))) {
                    fs.rm(filePath, { recursive: true }, function () {});
                }

                if (files) {
                    if (!fs.existsSync(path.join(filePath))) {
                        fs.mkdirSync(filePath);
                    }

                    for (let i = 0; i < files.length; i++) {
                        let fileArrayBuffer = await files[i].arrayBuffer();
                        let fileName = files[i].name;
                        fileList.push(fileName);

                        await fs.promises.writeFile(path.join(filePath, fileName), Buffer.from(fileArrayBuffer));
                    }
                }

                let newPost = new Post(id, title, desc, userid, fileList,  dateFormat(new Date()));
                newPostList.unshift(JSON.parse(JSON.stringify(newPost)));
                console.log(newPostList);
                await setPostList(newPostList);

                return true;
            } else {
                return false;
            }
        },

        PostDelete: async function (_, { id }, context) {
            let bearerToken = context.req.header("authorization");
            let userid = false;

            if (bearerToken) {
                let accessToken = bearerTokenSplit(bearerToken);
                console.log(accessToken);
                if (accessToken) {
                    userid = tokenVerify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                    console.log(userid);
                }
            }

            if (userid) {
                let PostList = getPostList();

                let newPostList = PostList.filter(function (data) {
                    if ((data.id != id) && ((data.userid == userid) || (userid == 1))) {
                        return true;
                    }
                });
                await setPostList(newPostList);
            }
            return true;
        },
    },
};


function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

class Post {
    constructor(id, title, desc, userId, files, date) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.userId = userId;
        this.files = files;
        this.date = date;
    }
}
