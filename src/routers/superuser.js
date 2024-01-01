const db = require("../../db/index");
const User = db.user;
const SuperUser=db.superuser;

const superauth = require("../../middleware/superauth");

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const log=require("../../middleware/log")

const router = new express.Router();

//Register SuperUsers
router.post("/superuser/register",log, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user
    const newSuperUser = await SuperUser.create({
      username,
      email,
      password,
    });

    const token = await newSuperUser.generateToken(); //generating token
   
    const sanitizedsuperUser = await SuperUser.findByPk(newSuperUser.id, {
      attributes: { exclude: ['tokens'] },
    });

    res
      .status(201)
      .json({ message: "Boss registered successfully", sanitizedsuperUser, token });
  } catch (error) {
    console.error("Error registering Superuser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Login Superusers

router.post("/superuser/login",log, async (req, res) => {
  try {
    const { username, password } = req.body;

    const superuser = await SuperUser.findByCredentials(username, password)

    const sanitizedsuperUser = await SuperUser.findByPk(superuser.id, {
      attributes: { exclude: ['tokens'] },
    });

    const token = await superuser.generateToken();

    res.json({ message: "Boss Login successful", sanitizedsuperUser, token });
  } catch (e) {
    console.error("Error logging in user:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get authenticated Superusers
router.get("/superusers", superauth,log, async (req, res) => {
    res.status(200).send(req.superuser)
});

//Logout SuperUser
router.post('/superuser/logout',superauth,log,async(req,res)=>{
  try {
    // Get the current user from the authentication middleware
    const currsuperuser = req.superuser; // Retrieve the user from the auth middleware

    // Filter out the token to be removed

    const currentsuperTokens = JSON.parse(currsuperuser.tokens);
    console.log(currentsuperTokens)

    const filteredsuperTokens = currentsuperTokens.filter((token) => {
      return token.token !== req.token;
  })
    // const updatedTokens = curruser.getDataValue('tokens').filter;
    currsuperuser.tokens = JSON.stringify(filteredsuperTokens);

    // Save the changes to the database
    await currsuperuser.save();
    // Update the user's tokens
    //await User.update({ tokens: updatedTokens }, { where: { id: curruser.id } });

    res.json("Boss Logout successful");
  } catch (error) {
    console.error('Error logging out Boss:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})

//Delete Superuser

router.delete('/superuser/delete', superauth,async (req, res) => {
   
       const superuserId=req.superuser.id
  try {
    // Find the user by ID
    const superuser = await SuperUser.findByPk(superuserId);

    // If the user is not found, return a 404 status
    if (!superuser) {
      return res.status(404).json({ error: 'Boss not found' });
    }

    // Delete the Boss
    await superuser.destroy();

    res.status(204).json('Boss Deleted Succesfully'); // Respond with 204 No Content for a successful deletion
  } catch (error) {
    console.error('Error deleting Boss:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//(User related routes)

//User Creation 

router.post("/users/register",superauth, async (req, res) => {
  try {
    const bossId=req.superuser.id
    const { username, email, password } = req.body;

    //Create a new user                    
    const newUser = await User.create({
      username,
      email,
      password,
      bossId,
    });

    const token = await newUser.generateToken(); //generating token

    res
      .status(201)
      .json({ message: "User registered successfully", newUser, token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//user deletion
router.delete('/users/delete/:id', superauth,async (req, res) => {
   
  const userId=req.params.id
try {
// Find the user by ID
const user = await User.findByPk(userId);

// If the user is not found, return a 404 status
if (!user) {
 return res.status(404).json({ error: 'User not found' });
}

// Delete the user
await user.destroy();

res.status(204).json('User Deleted Succesfully'); // Respond with 204 No Content for a successful deletion
} catch (error) {
console.error('Error deleting user:', error);

}
});

// get all the users under superauthenticated superuser 
//Applied pagination here 
router.get('/myusers',superauth,async(req,res)=>{
    const BossId =req.superuser.id
  
  try{
        const myusers = await User.findAll({
        where: {BossId},
    });

    res.send(myusers)
    }
    catch(e)
    {
      res.status(500).json({ error: 'Internal Server Error' });
    }
})


//update user

router.patch('/user/update/:id',superauth, async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details based on the request body
    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save the updated user
    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
