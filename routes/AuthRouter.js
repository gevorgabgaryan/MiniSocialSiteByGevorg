const express = require('express');
const { registerNewUser, verifyemail, loginUser, logOut, deleteAccount } = require('../controllers/AuthController');
const { checkEmailUnique } = require('../middlewares/checkEmailUnique');
const { validateRegisterInfo, validateLoginInfo } = require('../middlewares/validate');
const {createNewTokens}=require("../controllers/TokenController")
const router = express.Router();

/* register path Post method ,. */
router.post('/register',validateRegisterInfo,checkEmailUnique,registerNewUser);


/* email verify route. */
router.post('/verifyemail',verifyemail);


/* login path Post method ,. */
router.post('/login',validateLoginInfo,loginUser);

//refresh tokens path
router.post("/refreshtokens",createNewTokens)

//log out

router.post("/logout",logOut)

//delete account

router.post("/deleteAccount",deleteAccount)


module.exports = router;
