import {Router} from "express"
import { feed, getUserById, login, signup, UpdateUser } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/auth/signup",signup);
userRouter.post("/auth/login",login);
userRouter.get("/feed",auth,feed);
userRouter.get("/getUserById",auth,getUserById);
userRouter.patch("/updateUser",auth,UpdateUser);

export default userRouter;

