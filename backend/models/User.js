const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
       name: {type: String , required:true},
       email: {type:String , required:true , unique:true} , 
       password: {type: String , required:true},
       profileImageUrl:{type:String, default:null},
       role:{type:String , enum : ["admin", "member"], default:"member"}, //Roled-based access
    },
    {timestamps:true}
    //Mongoose automatically adds two fields to each document:
// "createdAt": "2025-06-19T11:30:00.123Z",
//   "updatedAt": "2025-06-19T11:30:00.123Z"

);


module.exports =mongoose.model("User",UserSchema);