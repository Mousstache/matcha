const BaseModel = require("./orm");

class User extends BaseModel {
    static tableName = "users";
    static fields = {
        name: "TEXT",
        age: "INTEGER",
    };
}

module.exports = User;