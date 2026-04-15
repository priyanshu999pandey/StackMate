import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

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
      $or: [{ email: email }, { userName: userName }],
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

export const feed = async (req, res) => {
  try {
    const allUsers = await User.find({});

    if (!allUsers) {
      return res.status(400).json({
        message: "Users Not Found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Users Found Successfully",
      success: true,
      allUsers,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    res.status(200).json({
      message: "user found successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};

export const UpdateUser = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.userId;
    const {firstName, lastName ,email, phoneNo} = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId }, 
      {
        firstName,
        lastName,
        email,
        phoneNo
      },
      { new: true }, 
    );

    if (!updatedUser) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User Updated Successfully",
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (!user) {
      return res.status(401).json({
        message: "User Not Found",
        success: false,
      });
    }

    const matchPassword = bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        message: "Invalid credential",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
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
