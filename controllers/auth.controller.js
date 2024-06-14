import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupUser = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({
        error:
          "لطفا تمام مقادیر مورد نیاز را ارسال کنید: نام، نام کاربری، رمز عبور، تکرار رمز عبور و جنسیت!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "رمز عبور یکسان نیست!" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res
        .status(400)
        .json({ error: "این نام کاربری قبلا استفاده شده است!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashesPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashesPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      // Generate JWT token
      generateTokenAndSetCookie(user._id, res, access_chat, 2);
      generateTokenAndSetCookie(user._id, res, refresh_chat, 365);

      await newUser.save();

      res.status(201).json({
        id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "داده های کاربر نامعتبراست !" });
    }
  } catch (err) {
    console.error("Error in signup controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordCorrect || !user) {
      return res
        .status(400)
        .json({ error: "نام کاربری یا رمز عبور اشتباه است!" });
    }

    generateTokenAndSetCookie(user._id, res, "access_chat", 2);
    generateTokenAndSetCookie(user._id, res, "refresh_chat", 365);

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("Error in login controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.cookie("access_chat", "", { maxAge: 0 });
    res.cookie("refresh_chat", "", { maxAge: 0 });
    res
      .status(200)
      .json({ message: "با موفقیت از حساب کاربری خود خارج شدید." });
  } catch (err) {
    console.error("Error in logout controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "نام کاربری اشتباه است!" });
    }

    generateTokenAndSetCookie(user._id, res, "access_chat", 2);

    res
      .status(200)
      .json({ message: "کوکی جدید ست شد" });
  } catch (err) {
    console.error("Error in logout controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};
