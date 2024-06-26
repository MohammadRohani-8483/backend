import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.access_chat;

    if (!token) {
      return res
        .status(401)
        .json({ error: "غیر مجاز - هیچ توکنی ارائه نشده است!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "غیر مجاز - توکن نامعتبر است!" });
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ error: "چنین کاربری موجود نیست!" });
    }

    req.user = user

    next();
  } catch (err) {
    console.error("Error in protect route middleware: ", err.message);
    res.status(500).json({ error: "خطای سرور داخلی رخ داده است!" });
  }
};

export default protectRoute;
