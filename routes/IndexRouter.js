const express = require('express');
const { index, homePageInfo, getOneToOnemessages, profileView, changePhoto, friendRequest, confirmRequest, profileInfo, deleteFriend } = require('../controllers/IndexController');
const { verifyToken } = require('../middlewares/auth');
const { upload, imageResizer } = require('../middlewares/uplaod');
const router = express.Router();

/* GET home page. */
router.get('/',index);

/* Post method for getting home page info. */
router.post('/',verifyToken, homePageInfo);

//get one to one message
router.post('/getmessages',verifyToken,getOneToOnemessages );

//profile get method

router.get("/profile/:id",profileView)

//change photo

router.post("/changePhoto", verifyToken,upload,imageResizer,  changePhoto)

//send friend reuest

router.post("/addFriend", verifyToken,friendRequest)

//confirm friend reuest

router.post("/confirmFriend", verifyToken,confirmRequest)

//profile info
router.post("/profile", verifyToken,profileInfo)

//delete friend

router.post("/deleteFriend", verifyToken,deleteFriend)

module.exports = router;
