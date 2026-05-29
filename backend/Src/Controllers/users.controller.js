import { asyncHandler } from '../Utils/asyncHandler.js';
// Utility wrapper to handle async errors without writing try/catch everywhere

import ApiError from '../Utils/ApiError.js';
// Custom error class to standardize API error responses

import User from '../Models/User.model.js';
// Mongoose User model for interacting with the database

import { uploadToCloudinary } from '../Utils/cloudinay.js';
// Utility function to upload files to Cloudinary and return their URLs

import { ApiResponse } from '../Utils/ApiResponse.js';
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async (userId) => {
  // Implementation for generating access and refresh tokens
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken };


  } catch (error) {
    throw new ApiError(500, "Failed to generate  Refresh and Access tokens");
  }
};
// Custom response class to standardize API responses


// Controller function to register a new user
const registerUser = asyncHandler(async (req, res) => {

  // Extract user details from request body
  const { username, email, fullname, password, avatar, coverImage } = req.body;

  // Validate required fields: none should be empty strings
  if ([username, email, fullname, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const normalizedUsername = username.toLowerCase();
  // Alternative validation (commented out) using simple if-checks
  // if (!username || !email || !fullname || !password) {
  //   throw new ApiError(400, "All fields are required");
  // }

  // Check if a user already exists with the same username OR email
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }

  // Get uploaded file paths for avatar and cover image from request
  const avatarLocalPath = req.files?.avatar[0]?.path || null;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path||null;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  console.log("avatar", avatarLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  console.log("coverImage", coverImageLocalPath);
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  // Upload images to Cloudinary and get back URLs
  const avatarResult = await uploadToCloudinary(avatarLocalPath);
  const coverImageResult = await uploadToCloudinary(coverImageLocalPath);

  if (!avatarResult || !coverImageResult) {
    throw new ApiError(500, "Failed to upload images to Cloudinary");
  }

  // Create new user in database
  const newUser = await User.create({
    username: normalizedUsername, // normalize username
    email,
    fullname,
    password,
    avatar: avatarResult.url, // store Cloudinary URL
    coverImage: coverImageResult?.url || "", // fallback to empty string
  });

  // Fetch the created user again, excluding sensitive fields
  const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  // Send success response back to frontend
  return res.status(201).json(
    new ApiResponse(200, "User registered successfully", createdUser, 201)
  );
});

const loginUser = asyncHandler(async (req, res) => {
  // Extract data sent from frontend (email, username, password)
  const { email, username, password } = req.body;

  // ✅ Validation checks
  if (!email && !username) {
    throw new ApiError(400, "Either email or username is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // 🔎 Find user in DB by either email OR username
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(404, "User not found with this email or username");
  }

  // 🔐 Verify password using model method (comparePassword)
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  // 🎟️ Generate JWT access & refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  // 📦 Fetch user data again, excluding sensitive fields
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // 🍪 Cookie options (httpOnly = not accessible by JS, secure = HTTPS only)
  const options = {
    httpOnly: true,
    secure: true,
  };

  // 📤 Send response: set cookies + return user info
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", loggedInUser)
    );
});


const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    // Remove refresh token from user record in DB
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken:1 } },
      { new: true }
    );

    // Cookie options for security
    const options = {
      httpOnly: true,
      secure: true,
    };

    // Clear cookies by setting empty values and immediate expiry
    return res
      .status(200)
      .cookie("accessToken", "", { ...options, expires: new Date(0) })
      .cookie("refreshToken", "", { ...options, expires: new Date(0) })
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(new ApiError(500, "Logout failed"));
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
  )


  const user = await User.findById(decodedToken?.id).then(async (user) => {
    if (!user) {
      throw new ApiError(401, "Unauthorized request: User not found");
    }
     if(user.refreshToken !== incomingRefreshToken){
      throw new ApiError(401, "Unauthorized request: Invalid refresh token");
     }
const options={
  httpOnly:true,
  secure:true
}
 const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id);
return res.status(200)
.cookie("refreshToken", newrefreshToken, options)
.cookie("accessToken", accessToken, options)
.json(
  new ApiResponse(200, "Access token refreshed successfully", null)
)
  })


})

const changeCurrentPassword = asyncHandler(async (req, res) => {
const { currentPassword, newPassword, confirmNewPassword } = req.body;
if (!currentPassword || !newPassword || !confirmNewPassword) {
  throw new ApiError(400, "All fields are required");}
if (newPassword !== confirmNewPassword) {
  throw new ApiError(400, "New password and confirm new password do not match");
}

const user = await User.findById(req.user._id);
const isPasswordCorrect = await user.comparePassword(currentPassword);
if (!isPasswordCorrect) {
  throw new ApiError(400, "Current password is incorrect");
}
user.password = newPassword;
await user.save({ validateBeforeSave: false });

return res.status(200).json(new ApiResponse(200, "Password updated successfully"));
});
 

const getUserProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, "User profile fetched successfully", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email, fullname } = req.body;
  if (!email || !fullname) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email,
        fullname
      }
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, "Account details updated successfully", user)
  );
}); // <-- properly closed here

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }
  const avatarResult = await uploadToCloudinary(avatarLocalPath);
  if (!avatarResult) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatarResult.url } },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, "Avatar updated successfully", user)
  );
});


const updateUsercoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }
  const coverImageResult = await uploadToCloudinary(coverImageLocalPath);
  if (!coverImageResult) {
    throw new ApiError(500, "Failed to upload cover image to Cloudinary");
  }
  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      coverImage: coverImageResult.url
    }
  }, { new: true }).select("-password");
  return res.status(200).json(new ApiResponse(200, "Cover image updated successfully", user));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
const {username}=req.params
if(!username?.trim()){
  throw new ApiError(400,"Username is required")}
  // const user =await User.findOne({username}).select("-password -refreshToken")
const channel = await User.aggregate([
  { $match: { username: username?.toLowerCase() }},
  {$lookup: {
    from: "subscribemodels",
    localField: "_id",
    foreignField: "channel",
    as: "subscribers"
  }},
  {$lookup: {
    from: "subscribemodels",
    localField: "_id",
    foreignField: "subscribers",
    as: "subscribedTo"
  }},
  {$addFields: {
    "subscribersCount": { $size: "$subscribers" },
    "subscribedToCount": { $size: "$subscribedTo" },
    isSubscribed: {
      $cond:{
        if:{ $in: [req.user?._id, "$subscribers.subscriber"] },
        then: true,
        else: false
      }
    }
  }},
  {$project: {
    username: 1,
    email: 1,
    fullname: 1,
    avatar: 1,
    coverImage: 1,
    subscribersCount: 1,
    subscribedToCount: 1,
    isSubscribed: 1
  }}
])
if(!channel?.length){
  throw new ApiError(404, "Channel not found");
}
return res.status(200).json(new ApiResponse(200, "Channel profile fetched successfully", channel[0]));
});
// // console.log("channel", channel)
// console.log(getUserChannelProfile);

const getWatchHistory = asyncHandler(async (req, res) => {

const user = await User.aggregate([
  { 
    $match: { 
      _id: new mongoose.Types.ObjectId(req.user._id) 
      // because req.user._id is a string, but in MongoDB the _id is stored as an ObjectId.
      // So we convert the string into ObjectId using mongoose.Types.ObjectId
    } 
  },
  { 
    $lookup: {
      from: "videos", 
      localField: "watchHistory", 
      foreignField: "_id", 
      as: "watchHistory",
      pipeline: [
        {
          $lookup: {
            from: "users", 
            localField: "owner", 
            foreignField: "_id", 
            as: "owner",
            pipeline:[
              {
                $project:{
                  fullname:1,
                  avatar:1,
                  username:1
                },
                // This stage selects only specific fields (fullname, avatar, username)
                // from the owner document instead of returning everything.
              },
              {
                $addFields:{
                  owner:{
                    $first:'$owner'
                  }
                }
                // Because $lookup returns an array of matching owners,
                // we use $first to take just the first one and store it in "owner".
              }
            ]
          }
        }
      ]
    }
  }
])
return res
.status(200)
.json(
  new ApiResponse(200,
    user[0].watchHistory,
    "Watch histroy fetched"
  )
)

})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  changeCurrentPassword,
  getUserProfile,
  updateAccountDetails,
  updateUsercoverImage,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory,
};

