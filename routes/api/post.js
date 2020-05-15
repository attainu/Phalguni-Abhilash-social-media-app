const express = require('express');
const router = express.Router();

//route get api/post
// access public

router.get('/',(req,res)=>res.send('post route'));

module.exports = router;