require('dotenv').config()
const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')



const Blog=require('./models/blog')

const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')

const { checkForAuthCookie } = require('./middleware/auth')
const app=express()

const PORT=process.env.PORT || 8000

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(e=>console.log('MongoDb connected'));

app.set("view engine","ejs");
app.set("views",path.resolve('./views'));

app.use(express.urlencoded({ extended: true }));  
app.use(express.json());  
app.use(cookieParser());
app.use(checkForAuthCookie('token'));
app.use(express.static(path.resolve('C:/Users/Hp/OneDrive/Desktop/Blogging App.js/public/images')));

app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find({}).sort('createdAt');
    res.render("home",{
        user:req.user,
        blogs: allBlogs
    })
})

app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(PORT,()=>console.log(`Server started at PORT:${PORT}`))