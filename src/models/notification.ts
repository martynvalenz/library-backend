import mongoose, {Schema, model} from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId:{type:Schema.Types.ObjectId,ref:'User',default:null},
  text:{type:String,default:null},
}, {
  timestamps: true
});

notificationSchema.methods.toJSON = function(){
  const {__v, _id, ...data} = this.toObject();
  data.id = _id;
  return data;
}

const Notification = model('Notification',notificationSchema,'notifications');
export default Notification;