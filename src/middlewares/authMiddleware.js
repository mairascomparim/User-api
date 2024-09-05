const jwt = require('jsonwebtoken');

const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: 'Token not found' });
    }

    jwt.verify(token, 'liven', (err, user) => {
        if (err) {
            return response.status(403).json({ message: 'Invalid token' });
        }

        request.user = user;
        next(); 
    });
};

module.exports = authenticateToken;
