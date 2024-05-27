import jwt from "jsonwebtoken";
import cookieSession from "cookie-session";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  const option = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // Mili second
    httpOnly: true,
    samesite: "strict", // CSRF attacks
    secure: true,
    secure: process.env.NODE_ENV !== "development",
  };

  res.cookie("jwt", token, option);
};

export default generateTokenAndSetCookie;
