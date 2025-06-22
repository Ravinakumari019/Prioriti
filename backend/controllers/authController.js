const User = require("../models/User");
const bcrypt= require("bcryptjs");
const jwt = require ("jsonwebtoken");

// Generate JWT token 
const generateToken =(userId) =>{
    return jwt.sign({id: userId},process.env.JWT_SECRET,{expiresIn:"7d"});
};
// @desc Register a new user
// @route POST/api/auth/register
// @acess Public
const  registerUser = async (req , res)=>{
    try {
        const {name, email, password,profileImageUrl,adminInviteToken} = req.body;

        // Check if user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        // determine user role:Admin is correct token is provided
        let role = "member"; // Default role
        if(adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN){
            role = "admin"; // Set role to admin if token is valid
        }
        // hash password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         
    
        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // return user data and token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        });
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc login user
// @route POST/api/auth/login
// @acess Public
const  loginUser = async (req , res)=>{
    try {
        const {email, password} = req.body;

        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }
        // return user data and token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id),
        });
     } 
     catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc Get user profile
// @route POST/api/auth/profile
// @acess Private(Requires JWT)
const  getUserProfile = async (req , res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
      res.json(user);
     } 
     catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc Update  user profile
// @route PUT/api/auth/profile
// @acess Private(Require JWT)
const  updateUserProfile = async (req , res)=>{
    try {
        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
       
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImageUrl: updatedUser.profileImageUrl,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
     } 
     catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
};

module.exports = {registerUser,loginUser,getUserProfile,updateUserProfile};