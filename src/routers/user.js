const db = require("../../db/index");
const User = db.user;
const auth = require("../../middleware/auth");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const router = new express.Router();

//Register Users (User can't register users)
// router.post("/users/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Create a new user                    //Cant create user
//     // const newUser = await User.create({
//     //   username,
//     //   email,
//     //   password,
//     // });

//     const token = await newUser.generateToken(); //generating token

//     res
//       .status(201)
//       .json({ message: "User registered successfully", newUser, token });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

//Login users

router.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByCredentials(username, password)
    const token = await user.generateToken();

    res.json({ message: "Login successful", user, token });
  } catch (e) {
    console.error("Error logging in user:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Logout User
router.post('/users/logout',auth,async(req,res)=>{
  try {
    // Get the current user from the authentication middleware
    const curruser = req.user; // Retrieve the user from the auth middleware

    // Filter out the token to be removed

    const currentTokens = JSON.parse(curruser.tokens);
    console.log(currentTokens)

    const filteredTokens = currentTokens.filter((token) => {
      return token.token !== req.token;
  })
    // const updatedTokens = curruser.getDataValue('tokens').filter;
    curruser.tokens = JSON.stringify(filteredTokens);

    // Save the changes to the database
    await curruser.save();
    // Update the user's tokens
    //await User.update({ tokens: updatedTokens }, { where: { id: curruser.id } });

    res.json("Logout successful");
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})

//Delete user (Cant Delete Users)

// router.delete('/users/delete', auth,async (req, res) => {
   
//        const userId=req.user.id
//   try {
//     // Find the user by ID
//     const user = await User.findByPk(userId);

//     // If the user is not found, return a 404 status
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Delete the user
//     await user.destroy();

//     res.status(204).json('User Deleted Succesfully'); // Respond with 204 No Content for a successful deletion
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



module.exports = router;
