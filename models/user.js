const {Schema,model}=require('mongoose')
const { createTokenForUser }=require('../services/auth')
const {createHmac,randomBytes}=require("node:crypto")

const userSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        default:'C:/Users/Hp/OneDrive/Desktop/Blogging App.js/public/images/def.png',
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    }

},
{timestamps:true});

userSchema.pre("save",function(next){
    const user=this;
    if(!user.isModified("password")) return next();
    const salt=randomBytes(16).toString('hex');
    const hashPassword=createHmac("sha256",salt)
        .update(user.password)
        .digest("hex");
        this.salt=salt;
        this.password=hashPassword;
        next();
})

userSchema.static('matchPasswordandGenerateToken',async function(email,password){
    const user=await this.findOne({email});
    if (!user) throw new error('User not found');
    const salt=user.salt;
    const hashPassword=user.password;

    const userProvidedHash=createHmac("sha256",salt)
      .update(password)
      .digest("hex");
    
    if (hashPassword !==userProvidedHash) throw new error('Incorrect Password');
    const token=createTokenForUser(user);
    return token;
})

const USER=model('user',userSchema);
module.exports=USER