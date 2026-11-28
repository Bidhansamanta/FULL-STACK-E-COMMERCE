import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";
import crypto from "crypto";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "user"],
      default: "user",
    },
    forgotPassword: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Hash Password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Create Temporary Token
userSchema.methods.genarateTemporaryToken = function () {
  const unHashToken = crypto.randomBytes(20).toString("hex");

  const hashToken = crypto
    .createHash("sha256")
    .update(unHashToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000;

  return { unHashToken, hashToken, tokenExpiry };
};

const User = model("User", userSchema);

export { User };
