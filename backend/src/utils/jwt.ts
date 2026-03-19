import jwt from 'jsonwebtoken';
interface payloadProps {
  id: string;
  email: string;
  username: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const jwttoken = {
  sign: (payload: payloadProps) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    } catch (err: unknown) {
      throw new Error('Failed to generate token');
    }
  },
  verify: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new Error('Session expired');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Unauthorized');
    }
  },
};
