const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//Generate token
const generateToken = (userId)=>
{
    return jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

//Register a token
//@route - POST /api/auth/register
//@access public

const registerUser = async(req, res)=>
{
    try {
        const {name, email, password,} = req.body;
       
        //check whether the user exists or not
        const userExists = await User.findOne({email})
        if(userExists)
        {
           return res.status(400).json({message:"User already exists"}) 
        }
    

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

          // Build profile image URL
        let profileImageUrl = null;
            if (req.file) {
            profileImageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
            }

        const user = await User.create({
            name, email, password :hashedPassword,profileImageUrl,
        })

        res.status(201).json({
            _id:user._id,
            name:user.name, 
            email:user.email,
             profileImageUrl: user.profileImageUrl,
             token: generateToken(user._id),          

        })
        
    } catch (error) {
        res.status(500).json({message:"server error", error: error.message})
    }
}

const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const loginUser = async(req, res)=>
{
 try {

    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user)
    {
        return res.status(401).json({message:"Invalid email or password"});
    }

    //compare password

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
    {
         return res.status(401).json({message:"Invalid password"});
    }

    //Return user data with JWT
      res.json({
            _id:user._id,
            name:user.name, 
            email:user.email,
             profileImageUrl: user.profileImageUrl,
              token: generateToken(user._id),

        })  
    } catch (error) {
        res.status(500).json({message:"server error", error: error.message})
    }
}

const getUser= async(req,res)=>
{
    try {
    const user = await User.find();
    if(!user)
    {
        return res.status(404).json({message:"User not found"})
    }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message:"server error", error: error.message})
    }
}

const update= async(req, res)=>
{
  try {
    const id= req.params.id;     
    const userId = await User.findById(id)
  if(!userId)
        {
            res.status(404).json({message:"User doesnot exists"})
        }
     
        const updateData = await User.findByIdAndUpdate(id, req.body,{new:true})
          res.status(200).json(updateData)


  } catch (error) {
     res.status(500).json({errorMessage: error.Message})
  }
}

const delById = async (req,res)=>
{
    try {
        const id = req.params.id;
        const delData = await User.findByIdAndDelete(id)
        if(!delData)
        {
            res.status(404).json({message:'Data not found'})
        }
        // res.status(200).json(delData);
        res.status(200).json({message:"Deleted Successfully"});
    } catch (error) {
        res.status(500).json({errorMessage: error.Message})
    }
}


module.exports={registerUser, loginUser,getUser,update, delById, getMe}