const {Router}=require('express');
const USER=require('../models/user');
const router=Router();

router.get('/signin',(req,res)=>{
    return res.render("signin")
})

router.get('/signup',(req,res)=>{
    return res.render("signup")
})

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    try {
        const token=await USER.matchPasswordandGenerateToken(email,password);

    return res.cookie('token',token).redirect('/');
    } catch (error) {
        return res.render('signin',{
            error:"Incorrect Email or Password"
        })
    }
})


router.post('/signup',async(req,res)=>{
    try{const {name,email,password}=req.body
    await USER.create({
        name,
        email,
        password,
    });
    res.redirect('/');
}
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error")
    }
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/');
})

module.exports=router;