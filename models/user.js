import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
      name: { type: String, required: true },
      accountname :{type: String , required:true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      isActive: { type: Boolean, required: true, default: true },

     lastLogin: { type: Date },
    //  refreshToken : [String]
    },
   
    { timestamps: true }
  );
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;