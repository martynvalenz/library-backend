import mongoose, {Schema, model} from 'mongoose';

const categorySchema = new mongoose.Schema({
  category:{type:String},
  slug:{type:String},
  books:{type:Number,default:0},
  isActive:{type:Boolean, default:true},
}, {
  timestamps: true
});

categorySchema.methods.toJSON = function(){
  const {__v, _id, ...data} = this.toObject();
  data.id = _id;
  return data;
}

const Category = model('Category',categorySchema,'categories');
export default Category;