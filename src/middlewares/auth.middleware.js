const jwt = require("jsonwebtoken");
const _ = require("lodash");
const User = require("../models/users.model");
const { sendApiResponse } = require("../config/api_response");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
    try {
        
        const authorizationHeader = _.get(req, "headers.authorization", "");

        if (!authorizationHeader) {
            return sendApiResponse(res, "Auth token missing", 401, false);
        }

        const parts = authorizationHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return sendApiResponse(res, "Invalid authorization format", 401, false);
        }

        const token = parts[1];

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return sendApiResponse(res, "Invalid or expired token", 401, false);
        }

        const user = await User.findOne({ user_id: decodedToken.user_id }).lean();

        if (!user) {
            return sendApiResponse(res, "Unauthorized user", 401, false);
        }

        req.user = { ...decodedToken, ...user };
        req.user.user_id = req.user?._id;

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return sendApiResponse(res, "Authentication failed", 500, false);
    }
};

module.exports = {
    authenticateUser
};
