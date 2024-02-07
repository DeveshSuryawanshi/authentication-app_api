const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SpecialKey = process.env.tokenkey;


const userRouter = express.Router();
userRouter.post("/register", async (req, res) => {
    try {
      const { name, email, password} = req.body;
      const existingUser = await UserModel.find({ email });
      if (existingUser.length) {
        return res
          .status(400)
          .json({ msg: "Registration failed User already exists, go to Login Page" });
      }
       bcrypt.hash(password, 5, async (err, hash) => {
          const user = new UserModel({
            name,
            email,
            password: hash,
          });
          await user.save();
          return res.status(200).json({
            msg: "The new User has been registered",
            registeredUser: user,
            isOK: true
          });
        });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  });
  
  userRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if(!existingUser) return res.status(200).json({msg: "User dose not exist. Please register", isAuth: false})
      if (existingUser) {
        bcrypt.compare(password, existingUser.password, (err, result) => {
          const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
          if (result) {
            const token = jwt.sign(
              { userID: existingUser._id, username: existingUser.name },
              SpecialKey,
              {
                expiresIn: expiration,
              }
            );
            return res
              .status(200)
              .json({
                msg: "Login Successfull",
                token: token,
                user: existingUser,
              });
          } else {
            res
              .status(400)
              .json({ msg: "Invalid Credentials! Wrong password provided" });
          }
        });
      } else {
        res
          .status(400)
          .json({ msg: "Invalid Credentials! Wrong email provided" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  module.exports = {
    userRouter,
  };