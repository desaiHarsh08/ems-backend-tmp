import ApiError from "./ApiError.js";

const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).json(new ApiError(1, error.message));
    }
}

export default asyncHandler;