import { signin, signup } from "@/controllers/auth.controller";
import { Router } from "express";


export const authRoute = Router()

authRoute.post("/signup", signup)
authRoute.post("/signin", signin)