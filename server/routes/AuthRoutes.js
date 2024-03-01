import { Router } from "express";
import { checkUser, onBoardUser, getAllUsers } from "../controllers/AuthController.js";



const router = Router()


router.post('/check-user', checkUser);
router.post("/onboard-user", onBoardUser);
router.get("/get-contacts", getAllUsers)


export default router;