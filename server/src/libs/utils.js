import jwt from 'jsonwebtoken';

const isProduction = () => process.env.NODE_ENV === 'production';

// When the frontend and API live on different domains (e.g. vercel.app and
// onrender.com) the browser treats them as cross-site, and SameSite=Strict
// cookies are never sent. Cross-origin deployment requires SameSite=None + Secure.
export const getCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? 'none' : 'strict',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
});

export const generateToken = (userId, res) => {
    const payload = {
        id: userId
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.cookie('token', token, getCookieOptions());
    return token;
}

export const clearAuthToken = (res) => {
    const { maxAge, ...options } = getCookieOptions();
    res.clearCookie('token', options);
}
