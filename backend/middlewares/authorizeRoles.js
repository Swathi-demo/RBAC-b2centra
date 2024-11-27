const jwt = require("jsonwebtoken");

const authorizeRoles = (allowedRoles) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the correct secret or public key
    const userRoles = decoded.roles || decoded.userRole || [];

    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authorizeRoles;
