const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

function clientAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Client Auth Middleware:', { authHeader, token });

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Invalid token:', err.message);
            return res.status(403).json({ message: 'Access Denied: Invalid Token!' });
        }
        req.user = user;
        console.log('clientAuthenticateToken: req.user =', user);
        next();
    });
}

module.exports = clientAuthenticateToken;
