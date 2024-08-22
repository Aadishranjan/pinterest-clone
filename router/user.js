const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


mongoose.connect('mongodb+srv://Aadish:0cOLg4tC9DxXG1Ux@cluster0.rzrzpcy.mongodb.net/projectdb')
// Define the User schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  dp: {
    type: String,
    default: 'default.png'
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
});

userSchema.plugin(plm)
// Create the User model
module.exports = mongoose.model('User', userSchema);
