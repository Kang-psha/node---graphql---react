const fs = require("fs");
module.exports = {
    getUserLastNum : function () {
        let jsonFile = fs.readFileSync(__dirname + "/db.json", "utf8");
        let jsonData = JSON.parse(jsonFile);
        return jsonData.lastUserNum;
    },
    getPostLastNum : function () {
        let jsonFile = fs.readFileSync(__dirname + "/db.json", "utf8");
        let jsonData = JSON.parse(jsonFile);
        return jsonData.lastPostNum;
    },

    setUserLastNum :async function (num) {
        try {
            let jsonFile = fs.readFileSync(__dirname + "/db.json", "utf8");
            let jsonData = JSON.parse(jsonFile);
            jsonData.lastUserNum = num;
            console.log(jsonData);
            await fs.writeFileSync(__dirname + "/db.json", JSON.stringify(jsonData));

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    setPostLastNum :async function (num) {
        try {
            let jsonFile = fs.readFileSync(__dirname + "/db.json", "utf8");
            let jsonData = JSON.parse(jsonFile);
            jsonData.lastPostNum = num;
            console.log(jsonData);
            await fs.writeFileSync(__dirname + "/db.json", JSON.stringify(jsonData));

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    getUserList: function () {
        let jsonFile = fs.readFileSync(__dirname + "/db.json", "utf8");
        let jsonData = JSON.parse(jsonFile);
        return jsonData.Users;
    },

    setUserList: async function (UserList) {
        try {
            let jsonFile = fs.readFileSync(__dirname + "/db.json", "utf8");
            let jsonData = JSON.parse(jsonFile);
            jsonData.Users = UserList;
            console.log(jsonData);
            await fs.writeFileSync(__dirname + "/db.json", JSON.stringify(jsonData));

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    getPostList: function () {
        let jsonFile = fs.readFileSync(__dirname + "/db.json", "utf8");
        let jsonData = JSON.parse(jsonFile);
      

        return jsonData.Posts;
    },

    setPostList: async function (PostList) {
        try {
            let jsonFile = fs.readFileSync(__dirname + "/db.json", "utf8");
            let jsonData = JSON.parse(jsonFile);
            jsonData.Posts = PostList;
            console.log(jsonData);
            await fs.writeFileSync(__dirname + "/db.json", JSON.stringify(jsonData));

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
};
