import mongoose, {Schema, model} from 'mongoose';

const loanSchema = new mongoose.Schema({
  userId:{type:Schema.Types.ObjectId,ref:'User',default:null},
  authorizedId:{type:Schema.Types.ObjectId,ref:'User',default:null},
  receivedId:{type:Schema.Types.ObjectId,ref:'User',default:null},
  bookId:{type:Schema.Types.ObjectId,ref:'Book',default:null},
  quantity:{type:Number,default:1},
  turnInDate:{type:Date,default:null},
  status:{type:String,enum:['Loan','TurnedIn'],default:'Loan'},
}, {
  timestamps: true
});

loanSchema.methods.toJSON = function(){
  const {__v, _id, ...data} = this.toObject();
  data.id = _id;
  return data;
}

const Loan = model('Loan',loanSchema,'loans');
export default Loan;