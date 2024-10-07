import mongoose, { Schema } from 'mongoose';

const workspaceSchema = new Schema(
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
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // The owner of the workspace
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    users: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, required: true, enum: ["owner", "admin",'manager', "member"] }
      }
    ],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
  },
  { timestamps: true }
);

const Workspace = mongoose.model('Workspace', workspaceSchema);


export default Workspace;
