import mongoose, {Schema, model} from 'mongoose';

const BookSchema = new mongoose.Schema({
  title:{type:String},
  slug:{type:String},
  coverImage:{type:String},
  author:{type:String},
  year:{type:Number,default:2000},
  stock:{type:Number,default:0},
  categoryId:{type:Schema.Types.ObjectId,ref:'Category',default:null},
  userId:{type:Schema.Types.ObjectId,ref:'User',default:null},
  isActive:{type:Boolean, default:true},
}, {
  timestamps: true
});

BookSchema.methods.toJSON = function(){
  const {__v, _id, password, ...data} = this.toObject();
  data.id = _id;
  return data;
}

const Book = model('Book',BookSchema,'books');
export default Book;