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
};

const loginData = (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔎 Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // 🔐 Check credentials
    if (email === "admin@gmail.com" && password === "admin@123") {

      // Create session
      req.session.user = {
        email,
        role: "admin"
      };

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: req.session.user
      });
    }

    // ❌ Invalid credentials
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = loginData;



module.exports= {registerAdmin, loginData}