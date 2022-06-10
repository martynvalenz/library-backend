import mongoose, {Schema, model} from 'mongoose';

const userSchema = new mongoose.Schema({
  initials:{type:String},
  name:{type:String,required:true},
  lastName:{type:String,required:true},
  email:{type:String},
  password:{type:String},
  color:{type:String},
  role:{type:String,enum:['Admin','User'],default:'User'},
  loans:{type:Number,default:0},
  isActive:{type:Boolean, default:true},
  hasAccess:{type:Boolean, default:true},
  lastLogin:{ type:Date},
  deletedAt:{ type:Date}
}, {
  timestamps: true
});

userSchema.methods.toJSON = function(){
  const {__v, _id, password, ...data} = this.toObject();
  data.id = _id;
  return data;
}

const User = model('User',userSchema,'users');
export default User;