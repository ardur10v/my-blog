const {Router}=require('express');
const multer=require('multer');
const path=require('path')

const Blog=require('../models/blog')
const Comment=require('../models/comment')
const router=Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(`C:/Users/Hp/OneDrive/Desktop/Blogging App.js/public/images/uploads`))
//   },
//   filename: function (req, file, cb) {
//     const filename=`${Date.now()}-${file.originalname}`
//     cb(null,filename);

//   }
// })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage })

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user: req.user,
    })
})

router.post('/add-new', upload.single('coverImage'),async(req,res)=>{
    const {title,body}=req.body
    const blog =await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageUrl: req.file.filename
    })
    console.log("Uploaded pic",req.file)
    return res.redirect(`/blog/${blog._id}`);
})

router.get('/:id',async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate('createdBy')
    const comments=await Comment.find({blogId:req.params.id}).populate('createdBy');
    return res.render('blog',{
        user:req.user,
        blog,
        comments
    })
})

router.get('/delete/:id',async(req,res)=>{
    const blogId=req.params.id;
    try{
        await Blog.findByIdAndDelete(blogId);
        await Comment.deleteMany({blogId});
        return res.redirect('/');
    }
    catch(err){
        console.error(err);
        res.status(500).send("Failed to delete blog")
    }
})

router.post('/comment/:blogId',async(req,res)=>{
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
    console.log(req.body)
    return res.redirect(`/blog/${req.params.blogId}`);
})
module.exports=router;