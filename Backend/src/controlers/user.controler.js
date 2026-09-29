
import { asyncHandler } from "../utiles/AsyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import { User } from "../models/user.model.js"
import { Apiresponse } from "../utiles/ApiResponse.js";
import { UploudOnCloundinary } from "../utiles/cloundinary.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, phone, password, address, PinCode, City, State,role } =
      req.body;
      
      
      
    if (
      [fullName, email, phone, password, address, PinCode, City, State,role].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
    const exitedUser = await User.findOne({
      $or: [{ phone }, { email }],
    });
    
    if (exitedUser) {
      throw new ApiError(409, "User with email or phone already exist");
    }
   
     
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Email Id is not valide");
    }

    if (password.length < 8) {
      throw new ApiError(
        400,
        "Password should strong and it contain minimum 8 lenght"
      );
    }
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path ;
    let avatar = null;

    if (avatarLocalPath) {
       avatar = await UploudOnCloundinary(avatarLocalPath);
    }
    
    const user = await User.create({
      fullName,
      avatar:  avatar?.url || "Not Photo",
      email,
      password,
      address: address.toLowerCase(),
      phone,
      PinCode,
      City,
      State,
      role,
    });
    const createUser = await User.findById(user._id).select(
      "-password  -refreshToken"
    );
    if (!createUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }
    return res
      .status(201)
      .json(new Apiresponse(201, { user: createUser }, "user registered Successfully"));
  } catch (error) {
    // If ApiError → use its status and message
    const status = error.statusCode || 500;
    

    return res
      .status(status)
      .json(
        new Apiresponse(status ,  error.message , "Registration failed")
      );
  }
});
const loginuser = asyncHandler(async (req, res) => {
  try {
    const  {email,password} = req.body; 
    
    // Strictly block admin email from normal user/farmer login
    if (email === process.env.ADMIN_EMAIL) {
      throw new ApiError(403, "Admin credentials cannot be used for user login");
    }
     
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "EmailId is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user's Password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const loggedInuser = await User.findById(user._id).select(
      " -password  -refreshToken"
    );
    
    return res
      .status(202)
      .json(
        new Apiresponse(
          202,
          {
            user: loggedInuser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(new Apiresponse(status,  error.message , "Login failed"));
  }
});



const LogoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
   

    return res
      .status(200)
      .json(new Apiresponse(200, {}, "User logged Out"));
  } catch (error) {
     const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, "Logout failed"));
  }
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // 1. Get refresh token from body or cookies
    const incomingRefreshToken =
      req.body?.refreshToken 

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    // 2. Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 3. Find user
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // 4. Match refresh token with DB
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or already used");
    }

    // 5. Generate new tokens
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user._id);
   

    // 7. Send response
    return res
      .status(201)
      .json(
        new Apiresponse(
          201,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
      const status = error.statusCode || 500;
      return res
         .status(status)
         .json(
             new Apiresponse(
                   status,
                     null,
                     error.message || "Could not refresh access token"
                   )
                 );
  }
});


const changePassword = asyncHandler(async (req, res) => {
  try {
    
    const { oldPassword, NewPassword } = req.body;
    
    
    const user = await User.findById(req.user?._id);
    
    
    const ispassword = await user.isPasswordCorrect(oldPassword);
    if (!ispassword) {
      throw new ApiError(401, "Invalid old password");
    }
    user.password = NewPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(201)
      .json(new Apiresponse(201, {}, "Password changed successfuly"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Could not change password"
        )
      );
  }
});

const updatedAccountDetail = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, phone, address, City, State, PinCode } = req.body;
    if (!(fullName || City || State || PinCode)) {
      throw new ApiError(401, "All fields are required");
    }
    if (!(phone || address)) {
      throw new ApiError(401, "All fields are required");
    }
    if (email && !validator.isEmail(email)) {
      throw new ApiError(400, "EmailId is not valide");
    }
    
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullName: fullName,
          email: email,
          phone: phone,
          address: address,
          City: City,
          State: State,
          PinCode: PinCode,
          

        },
      },
      { returnDocument: "after" }
    ).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res.status(201).json(
      new Apiresponse(201,  { user: user }, " Account Detailed is updated successful")
    );
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          error.message , "Could not update avatar image"
        )
      );
  }
});
const updatedAvatarImage = asyncHandler(async (req, res) => {
  try {
    const avatarLocalpath = req.files?.avatar?.[0]?.path;
    
    
    if (!avatarLocalpath) {
      throw new ApiError(400, "File is required");
    }
    const newavatar = await UploudOnCloundinary(avatarLocalpath);
    
    if (!newavatar) {
      throw new ApiError(400, "file is not uploaded because of error");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: newavatar?.url,
        },
      },
      {
        returnDocument: "after",
      }
    ).select("-password");
    return res
      .status(201)
      .json(new Apiresponse(201, user, "Avatar image updated successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    console.log(error.message)
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          error.message , "Could not update avatar image"
        )
      );
  }
});

const adminPanel = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "email and password is required");
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "Farmiax107@gmail.com").trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || "Farmiax@2026").trim();

    if (
      email.trim().toLowerCase() !== adminEmail.toLowerCase() ||
      password.trim() !== adminPassword
    ) {
      return res
        .status(401)
        .json(new Apiresponse(401, null, "Invalid password or emailId"));
    }

    const payload = email.trim() + password.trim();
    const secret = process.env.ACCES_TOKEN_SECRET || "farmiax_access_token_secret_jwt_key_2026_super_secure";
    const token = jwt.sign({ payload }, secret, {
      expiresIn: process.env.ACCES_TOKEN_EXPIRY || "1d",
    });

    return res
      .status(200)
      .json(new Apiresponse(200, { Token: token }, "Admin login succefull"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(status,  error.message , "Admin login failed")
      );
  }
});
const forgetPassword = asyncHandler(async (req, res) => {
  try{
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // This will trigger your pre("save") hook
  user.password = password;
  await user.save();

  return res.status(201).json(
    new Apiresponse(201, {}, "Password updated successfully")
  );}
  catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message || "Failed to update password"));
  }
});

const healthCheck = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new Apiresponse(
      200,
        null,
        "Backend is healthy"   
    )
  );
});

export {
  healthCheck,
  registerUser,
  loginuser,
  LogoutUser,
  refreshAccessToken,
  changePassword,
  adminPanel,
  updatedAccountDetail,
  updatedAvatarImage,
  forgetPassword,
  
};