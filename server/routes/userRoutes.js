import express from "express";
import {
  register,
  login,
  logout,
  loadUser,
  addUserPAN,
  downloadPANFile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

// Authenticated routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/load", isAuthenticated, loadUser);
router.post("/addUserPAN", isAuthenticated, singleUpload, addUserPAN);
router.get("/download", isAuthenticated, downloadPANFile);

export default router;
