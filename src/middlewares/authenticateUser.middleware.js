import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const authenticateUser = async (req, res, next) => {
    try {
        // const { email, accessToken, refreshtoken } = req.headers;
        const email = req.headers.email;
        const accessToken = req.headers.accesstoken;
        const refreshToken = req.headers.refreshtoken;

        // console.log("accessToken:", accessToken)
        // console.log("refreshToken:", refreshToken, req.headers)
        if (!accessToken || !refreshToken) {
            return res.status(400).json(new ApiResponse(401, req.body, "PLEASE AUTHENTICATE USING VALID ACCESS_TOKEN AND REFRESH_TOKEN"));
        }

        try {
            // Verify the token
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

            // Check if the token is expired
            if (decodedToken.exp <= Date.now() / 1000) {
                try {
                    // Verify the refresh token
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

                    // Continue with the next middleware or route handler
                    next();
                } catch (refreshTokenError) {
                    if (refreshTokenError.name === 'TokenExpiredError') {
                        return res.status(407).json(new ApiResponse(407, req.body, "REFRESH_TOKEN_EXPIRED"));
                    } else if (refreshTokenError.name === 'JsonWebTokenError') {
                        return res.status(406).json(new ApiResponse(406, req.body, "INVALID_REFRESH_TOKEN"));
                    }

                    throw refreshTokenError; // Re-throw other errors for further handling
                }
            } else {
                // Continue with the next middleware or route handler if the access token is still valid
                console.log("ok")
                next();
            }

        } catch (error) {
            console.log(error)
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json(new ApiResponse(401, req.body, "INVALID_ACCESS_TOKEN"));
            }

        }

    } catch (error) {
        console.log(error)
        return res.status(error.code || 500).json(new ApiError(
            error.code, "CANNOT AUTHENTICATE THE USER...!", error
        ));
    }
}

export default authenticateUser;
