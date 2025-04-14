import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No acces token provided" });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(401).json({ message: "Unauthorized - User not found" });
            }

            req.user = user;

            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Token expired" });
            }
            throw error;
        }
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: error.message });
    }
};
