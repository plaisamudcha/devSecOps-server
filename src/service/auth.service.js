import { token } from "morgan";
import prisma from "../config/prisma.config.js";

const authService = {
  register: async (userData) => {
    return await prisma.user.create({
      data: userData,
    });
  },
  login: async (email) => {
    return (
      (await prisma.user.findUnique({
        where: { email },
      })) || null
    );
  },
  getUserProfile: async (userId) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { movies: true }, // Assuming a relation with movies
    });
  },
  findExistingUser: async (email) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
  refreshToken: async (userId, refreshToken) => {
    return await prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
  },
  resetPassword: async (userId, newPassword) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  },
  getRefreshToken: async (refreshToken) => {
    return await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
    });
  },
  deleteRefreshToken: async (refreshToken) => {
    return await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
  },
};

export default authService;
