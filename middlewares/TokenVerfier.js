import jwt from "jsonwebtoken";

const TokenVerfier = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      return res.status(401).json({ msg: "unauthorized Action ", status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ msg: "Token Expired or Invalid Token", status: 401 });
    }
    console.log(decoded?.email);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired", status: 401 });
    }

    return res.status(401).json({ msg: "Invalid token", status: 401 });
  }
};

export default TokenVerfier;
