import mongoose, {Schema, model, PaginateModel} from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IBook extends mongoose.Document {
  title: string; 
  slug: string; 
  coverImage: string; 
  author: string; 
  year: number;
  stock: number;
  categoryId: string;
  userId: string;
  isActive: boolean; 
};

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
  const {__v, _id, ...data} = this.toObject();
  data.id = _id;
  return data;
}
BookSchema.plugin(paginate);

// paginate with this plugin
interface InstitutionDocument extends Document, IBook {}

const Book = mongoose.model<
InstitutionDocument,
PaginateModel<InstitutionDocument>
>('Book',BookSchema,'books');

export default Book;