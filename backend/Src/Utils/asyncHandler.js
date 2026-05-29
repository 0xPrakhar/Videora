// // asyncHandler is a wrapper function
// // It takes another function (fn) as input
// // and returns a new async function that catches errors
// const asyncHandler = (fn) => {
//     return async (req, res, next) => {
//         try {
//             // Run the original request handler
//             await fn(req, res, next);
//         } catch (error) {
//             // If an error happens, send a response instead of crashing
//             res.status(error.code || 500).json({
//                 message: "Internal Server Error",
//                 success: false,
//             });
//         }
//     };
// };





// asyncHandler is another wrapper function
// It takes a request handler (reqhandler) as input
const asyncHandler = (reqhandler) => {
    return (req, res, next) => {
        // Wrap the handler in Promise.resolve
        // If it throws or rejects, .catch() will send the error to next()
        Promise.resolve(reqhandler(req, res, next))
        .catch((err) => next(err));
    };
};

export { asyncHandler };