import { Router } from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUser,
  getProfile,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controller/auth.controller.js";
import {
  loginValidator,
  registrationValidator,
} from "../validator/auth.validator.js";
import { checkRole, verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router.route("/register-user").post(registrationValidator(), registerUser);
router.route("/login-user").post(loginValidator(), loginUser);
router.route("/logout-user").get(verifyJWT, logoutUser);
router.route("/all-user").get(verifyJWT, checkRole, getAllUser);
router.route("/all-user/:userId").get(verifyJWT, getUserById);
router.route("/all-user/:userId").get(verifyJWT, checkRole, getProfile);
router.route("/update-user/:userId").put(updateUser);
router.route("/delete-user/:userId").delete(deleteUser);
router.route("/forgot-password").post(forgotPassword);

export default router;
