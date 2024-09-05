import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extensão da interface Request para incluir o campo user
interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

// Função de autenticação do token
const authenticateToken = (request: AuthenticatedRequest, response: Response, next: NextFunction): void => {
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
         response.status(401).json({ message: 'Token not found' });
    }

    jwt.verify(String(token), 'liven', (err, user) => {
        if (err) {
            return response.status(403).json({ message: 'Invalid token' });
        }

        request.user = user as JwtPayload;
        next(); 
    });
};

export default authenticateToken;
