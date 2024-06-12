import User from "../models/user.model.js";

export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error in get users controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};
