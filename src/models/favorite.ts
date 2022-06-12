import mongoose, {Schema, model} from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId:{type:Schema.Types.ObjectId,ref:'User',default:null},
  bookId:{type:Schema.Types.ObjectId,ref:'Book',default:null},
}, {
  timestamps: true
});

favoriteSchema.methods.toJSON = function(){
  const {__v, _id, ...data} = this.toObject();
  data.id = _id;
  return data;
}

const Favorite = model('Favorite',favoriteSchema,'favorites');
export default Favorite;