import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const logedInUserid = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: logedInUserid } });
    console.log(filteredUsers);

    res.status(200).json(filteredUsers);
    // res.status(200).json({ message: "hello" });
  } catch (err) {
    console.error("Error in get users controller: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};
