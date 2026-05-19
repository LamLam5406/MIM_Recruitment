const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: "No token provided" });

    const tokenValue = token.split(" ")[1];

    jwt.verify(tokenValue, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.user = { id: decoded.id, role: decoded.role };
        next();
    });
};

module.exports = verifyToken;