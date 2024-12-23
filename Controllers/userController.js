const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

const JWT_KEY = "276058dd7e1e902376bb799e8097da7657e99a5d0e2312a8cc39be629094f160df3e2dad06e310434d1375c6b3a6a8b760cc319818170b43041cb3e411f13584d91bfd35178e37a7ff1db6b7ea2da462864e70ff70367196e3a449308556985f33dbf933948479cb77eaf02aa19f55fe9c56b70e6b2dd50833cba92d294dd95b19b3747128b57a7d204ca0a6d240006bd0aa2e37000a149078456cf144d2e3938123afbe1a6d01f36d2b90e46ec707bee9f944761ca8e53a87220db41c68e9b53e88e7dde8c2b487dbe367de09d630156f87e9637d5a1dcdc7383c50222201df000c9bc9c73dd1ff4da02b45dd0a0bd77983259e596220f7c970d82b828971f2"

// Assigning users to the variable User
const User = db.users;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
 try {
   const { uname, uemail, phoneno, upassword } = req.body;
   const data = {
     uname,
     uemail,
     phoneno,
     upassword: await bcrypt.hash(upassword, 10),
   };
   // saving the user
   const user = await User.create(data);

   // if user details is captured
   // generate token with the user's id and the secretKey
   // set cookie with the token generated
   if (user) {
     let token = jwt.sign({ id: user.id }, JWT_KEY, {
       expiresIn: 1 * 24 * 60 * 60 * 1000,
     });

     res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
     console.log("user", JSON.stringify(user, null, 2));
     console.log(token);
     //send users details
     return res.status(201).send(user);
   } else {
     return res.status(409).send("Details are not correct");
   }
 } catch (error) {
   console.log(error);
 }
};

const login = async (req, res) => {
  try {
    const { uemail, upassword } = req.body;

    // Debugging: Log the incoming request body
    console.log("Request body:", req.body);

    // Check if uemail and upassword are provided
    if (!uemail || !upassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find a user by their email
    const user = await User.findOne({ where: { uemail } });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed: User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isSame = await bcrypt.compare(upassword, user.upassword);

    if (!isSame) {
      return res.status(401).json({ message: "Authentication failed: Invalid password" });
    }

    // Generate a token using the user's ID and the secret key from the environment file
    const token = jwt.sign({ id: user.id }, JWT_KEY, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Set the token as an HTTP-only cookie
    res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true });

    // Log success details
    console.log("Authenticated user:", JSON.stringify(user, null, 2));
    console.log("Generated token:", token);

    // Respond with user data
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
 signup,
 login,
};