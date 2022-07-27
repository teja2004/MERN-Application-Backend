const express = require('express');
const User = require('../Models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const  JWT_AUTH = "mynameist@j@";

router.post('/createUser', 
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async function(req, res) {
    // If there are Errors then response gives bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user email is already existing
    try{
    let user = await User.findOne({ email: req.body.email });
    if(user)
    {
        return res.status(400).json({ errors: { msg: 'Email already exists' }});
    }
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email
    })

    const data = {
        user : {
            id : user.id
        }
    }
    const authToken = jwt.sign(data,JWT_AUTH);
    // console.log(authToken);

    res.json({authToken});
}

    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
});

// A End point for Login Credentials
router.post('/login', 
    [body('email',"Enter a Valid Email").isEmail(),
    body('password',"Password Unknown").exists(),],
    async function(req, res) {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ error: "Please Login with Correct Credintials"})
        }

        const passwordCompare = await bcrypt.compare(password , user.password);
        if (!passwordCompare){
            return res.status(400).json({ error: "Please Login with Correct Credintials"})
        }

        const data = {
            user : {
                id : user.id
            }
        }
        const authToken = jwt.sign(data,JWT_AUTH);
        // console.log(authToken);
    
        res.json({authToken});

    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})


module.exports = router;