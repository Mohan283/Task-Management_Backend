const Admin = require('../model/adminModel')


const registerAdmin = async(req,res)=>
{
    try {
        const newData = new Admin(req.body);
        const savedData = newData.save();

        return res.status(201).json({
            message:"Data Saved Successfully",
            data:savedData
        })
    } catch (error) {
         return res.status(500).json({
        message: "Error saving data",
        error: error.message,
    });

    }
}

const loginData=(req, res)=>
{
    const{email, password} = req.body;
    if(email==='admin@gmail.com'&&password==='admin@123')
    {
        
    // 🔐 CREATE SESSION
    req.session.user = {
      email,
      role: "admin"
    };
        return res.status(201).json({
            message:"login successful"
        })
    } else {
    return res.status(401).json({
      message: "Invalid email or password"
    })}
}


module.exports= {registerAdmin, loginData}