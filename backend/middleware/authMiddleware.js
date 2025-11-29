const jwt = require("jsonwebtoken");

exports.verifyOwnerToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "owner") return res.status(403).json({ success: false, message: "Owner access only" });

    req.user = decoded;
    next();
  } catch (err) {
    console.error("verifyOwnerToken Error:", err);
    if (err.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expired" });
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

exports.verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ success: false, message: "Admin access only" });

    req.user = decoded;
    next();
  } catch (err) {
    console.error("verifyAdminToken Error:", err);
    if (err.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expired" });
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};
