import mongoose, {Schema, model} from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId:{type:Schema.Types.ObjectId,ref:'User',default:null},
  bookId:{type:Schema.Types.ObjectId,ref:'Book',default:null},
  quantity:{type:Number,default:1},
}, {
  timestamps: true
});

cartSchema.methods.toJSON = function(){
  const {__v, _id, ...data} = this.toObject();
  data.id = _id;
  return data;
}

const Cart = model('Cart',cartSchema,'carts');
export default Cart;