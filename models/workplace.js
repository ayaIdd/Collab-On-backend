import mongoose, { Schema } from 'mongoose';

const workplaceSchema = new Schema(
  {
    name: { type: String, required: true },
    businessIndustry: { 
      type: String, 
      required: true,
      enum: ['Student', 'tech', 'finance', 'education', 'other']
    },
    size: { 
      type: String, 
      required: true,
      enum: ['1-4', '5-19', '20-199', '200+']
    },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
  },
  { timestamps: true }
);

const Workplace = mongoose.model('Workplace', workplaceSchema);

export default Workplace;
