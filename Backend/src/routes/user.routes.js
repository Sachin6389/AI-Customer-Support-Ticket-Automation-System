import{Router}  from 'express'
import { registerUser  } from '../controlers/user.controler.js'
import {upload } from '../middleware/multer.js'
import { LogoutUser,adminPanel,forgetPassword  } from '../controlers/user.controler.js'
import { loginuser, healthCheck } from '../controlers/user.controler.js'
import { verifyjwt } from '../middleware/auth.middleware.js'
import{refreshAccessToken,
   changePassword,
   
   updatedAccountDetail,
   updatedAvatarImage,} 
   from '../controlers/user.controler.js'
   

   
const router= Router()
router.route("/register").post(
    upload.fields([
        {
        name:"avatar",
        maxCount:1
    },
        
    ]),
    registerUser
)
router.route("/login").post(loginuser)
router.route("/health").get(healthCheck)
router.route("/adminlogin").post(adminPanel)
router.route("/logout").post(verifyjwt,LogoutUser)
router.route("/refresh_token").post(refreshAccessToken)
router.route("/changed-password").post(verifyjwt,changePassword)
router.route("/forget-password").post(forgetPassword)

router.route("/updated-account").patch(verifyjwt,updatedAccountDetail)
router.route("/avatar").patch(verifyjwt, upload.fields([
        {
        name:"avatar",
        maxCount:1
    },
        
    ]),updatedAvatarImage)

export default router