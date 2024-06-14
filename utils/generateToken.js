import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res, nameToken, day) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  const genrateOption = {
    maxAge: day * 24 * 60 * 60 * 1000, // Mili second
    httpOnly: true,
    samesite: "strict", // CSRF attacks
    secure: true,
  };

  res.cookie(nameToken, token, genrateOption);
};

export default generateTokenAndSetCookie;
