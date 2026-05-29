import router from 'express';
import { registerUser, loginUser, logoutUser, refreshToken, changeCurrentPassword, getUserProfile, updateAccountDetails, updateUserAvatar, updateUsercoverImage, getUserChannelProfile, getWatchHistory } from '../Controllers/users.controller.js';
const userRouter = router();
import { upload } from '../Middlewares/multer.middleware.js';
import checkJWT from '../Middlewares/auth.middleware.js';
import { verify } from 'crypto';


userRouter.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
    registerUser
);
// ✅ Groups multiple HTTP methods (GET, POST, PUT, DELETE) for the same path.
// ✅ Cleaner when you want to chain several handlers for one route.
// userRouter.post("/register", registerUser);
// ✅ Defines only a POST handler for this path.
// ✅ Simpler and shorter when you need just one method.

userRouter.route("/login").post(loginUser);

//secured routes
userRouter.route("/refresh-token").get(checkJWT, refreshToken);
userRouter.route("/logout").post(checkJWT, logoutUser);
userRouter.route('/change-password').post(checkJWT, changeCurrentPassword)
userRouter.route('/user-profile').get(checkJWT, getUserProfile)
userRouter.route('/update-account').patch(checkJWT, updateAccountDetails)
userRouter.route('/update-avatar').patch(checkJWT, upload.single('avatar'), updateUserAvatar)
userRouter.route('/update-coverImg').patch(checkJWT, upload.single('coverImg'), updateUsercoverImage)
userRouter.route('/c/:username').get(checkJWT, getUserChannelProfile)
userRouter.route('/history').get(checkJWT, getWatchHistory)
export default userRouter;


