import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
const protectRoute = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            success:false,
            error:"Not authorized to access this route"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user  = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({
                success:false,
                error:"Not authorized to access this route"
            })
        }
        req.user = user;
        next();
    }catch(e){
        return res.status(401).json({
            success:false,
            error:"Not authorized to access this route"
        })
    }
}
export default protectRoute;