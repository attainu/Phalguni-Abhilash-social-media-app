const express = require('express');
const router = express.Router();
//gravatar to load icon for profile
const gravatar = require('gravatar');
//express validator to check if is it in the correct way
const { check, validationResult } = require('express-validator');
//using bcrypt for hashing password
const bcrypt = require('bcryptjs');

const User = require('../../models/User');


//route get api/users
// access public
//register post

router.post('/',
[
    //setting rule for validation checking
    check('name','name is required')
    .not()
    .isEmpty(),
    check('email','please enter valid email')
    .isEmail(),
    check('password', 'password should be of length 6 or more character')
    .isLength({min:6})
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

const {name, email, password} = req.body;

try{
    //check user exist
    let user = await User.findOne({email : email});

    if(user){
        res.status(400).json({errors:[{msg:'user already exist'}]})
    }

    //gravatar for user avatar
    const avatar = gravatar.url(email,{
        s: '200',
        r: 'pg',
        d:'mm'
    })

    //create instance of user

    user = new User({
        name,
        email,
        avatar,
        password
    })
//whenever there is promise we are using await- because we use async
//password needed to be hashed using bcrypt
//creating salt for bcrypt

const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);
await user.save();


    res.send('user registered')

}catch(err){

    console.error(err.message);
    res.status(500).send('Server error')
}

    
});

module.exports = router;

