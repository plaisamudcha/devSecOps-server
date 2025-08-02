import express from "express";
import authController from "../controller/auth.controller.js";
import validate from "../validation/validate.validatation.js";
import authSchema from "../validation/authSchema.validation.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validate(authSchema.register),
  authController.register
);
authRouter.post("/login", validate(authSchema.login), authController.login);
authRouter.post(
  "/forgot-password",
  validate(authSchema.forgotPassword),
  authController.forgotPassword
);
authRouter.post(
  "/reset-password/:token",
  validate(authSchema.resetPassword),
  authController.resetPassword
);
authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
