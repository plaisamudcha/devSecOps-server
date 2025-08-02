import authService from "../service/auth.service.js";
import bcrypt from "bcryptjs";
import createError from "../util/create-error.util.js";
import genTokenJWT from "../util/jwt.util.js";
import resetEmail from "../util/reset-email.util.js";
import prisma from "../config/prisma.config.js";

const authController = {
  register: async (req, res) => {
    const userData = req.body;
    const { name, email, password } = userData;
    const hashPassword = bcrypt.hashSync(password, 10);
    const existingUser = await authService.findExistingUser(email);
    if (existingUser) createError(400, "User already exists");
    await authService.register({
      name,
      email,
      password: hashPassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.login(email);
    if (!user) createError(404, "email or password is incorrect");
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) createError(401, "email or password is incorrect");
    const payload = { id: user.id };
    const accessToken = genTokenJWT.loginToken(payload);
    const refreshToken = genTokenJWT.refreshToken(payload);
    await authService.refreshToken(user.id, refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: userWithoutPassword,
    });
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const user = await authService.findExistingUser(email);
    const payload = { id: user.id };
    const resetToken = genTokenJWT.resetPasswordToken(payload);
    await resetEmail(email, resetToken);
    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  },
  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const payload = genTokenJWT.verifyToken(
      token,
      process.env.JWT_RESET_SECRET
    );
    const user = await authService.getUserProfile(payload.id);
    if (!user) createError(404, "User not found");
    const hashPassword = bcrypt.hashSync(password, 10);
    await authService.resetPassword(user.id, hashPassword);
    res.status(200).json({ message: "Password reset successfully" });
  },
  refreshToken: async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) createError(401, "No refresh token provided");
    const refresh = await authService.getRefreshToken(refreshToken);
    if (!refresh) createError(401, "Invalid refresh token");
    const userId = refresh.userId;
    if (new Date() > new Date(refresh.expiresAt)) {
      await authService.deleteRefreshToken(refreshToken);
      createError(401, "Refresh token expired");
    }
    const newRefreshToken = genTokenJWT.refreshToken({ id: userId });
    const newAccessToken = genTokenJWT.loginToken({ id: userId });
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }, // 30 days
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(200).json({
      message: "Tokens refreshed successfully",
      accessToken: newAccessToken,
    });
  },
};

export default authController;
