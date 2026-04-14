import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    //getting the data from  frontend
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      userName,
      confirmPassword,
    } = req.body;
    console.log(req.body);

    // validating the fields are filled or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !userName ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All Fields are required",
      });
    }

    // checking the password is matching with confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and Confirm Password Dont Match ",
      });
    }

    // checking that user already have account with same email or not
    const userExist = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (userExist) {
      return res.status(400).json({
        message: "User Already Exist",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create User
    const userCreated = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userName,
      phoneNo,
    });

    // return response
    return res.status(201).json({
      message: "User Created Successfully",
      success: true,
      user: {
        _id: userCreated._id,
        firstName: userCreated.firstName,
        lastName: userCreated.lastName,
        email: userCreated.email,
        phoneNo: userCreated.phoneNo,
        username: userCreated.username,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};
