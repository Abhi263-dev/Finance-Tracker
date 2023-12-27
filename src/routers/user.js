const db = require('../../db/index')
const User = db.user

const express =require('express')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

const router = new express.Router()

//Register Users
router.post('/users/register',async (req,res)=>{
    try{ 
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = await User.create({
          username,
          email,
          password: hashedPassword,
        });
    
        const token = await newUser.generateToken();         //generating token

        // newUser.tokens = newUser.tokens.concat({ token });  //saving it to the table
        // await newUser.save();

        res.status(201).json({ message: 'User registered successfully', token, user: newUser });
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

//Login users

router.post('/users/login',async(req,res)=>{
  try  
  { const {username,password}=req.body;
    
    const user= await User.findOne({ where: { username } });
   
    //Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate and send a JWT token upon successful login
    const token =await user.generateToken();

    // user.tokens = user.tokens.concat({ token });  //saving it to the table
    // await user.save();
    res.json({ message: 'Login successful', token });
   
  } catch (e) {
    console.error('Error logging in user:', e);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})


module.exports = router;