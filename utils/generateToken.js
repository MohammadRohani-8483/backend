import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res, nameToken, day, isRefresh) => {
  const token = jwt.sign(
    { userId },
    isRefresh ? process.env.REFRESH_SECRET : process.env.JWT_SECRET,
    {
      expiresIn: `${day}d`,
    }
  );

  const genrateOption = {
    maxAge: day * 24 * 60 * 60 * 1000, // Mili second
    httpOnly: true,
    samesite: "strict", // CSRF attacks
    secure: true,
  };

  res.cookie(nameToken, token, genrateOption);
  return token
};

export default generateTokenAndSetCookie;
