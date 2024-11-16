import { Router } from "express";
import { registerUser } from "../controllers/userController.js";

const router = Router();

// Define the routes
router.route('/register').post(registerUser);

export default router;
