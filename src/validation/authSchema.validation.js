import { object, ref, string } from "yup";

const authSchema = {
  register: object({
    name: string().required("Name is required"),
    email: string().email("Invalid email format").required("Email is required"),
    password: string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: string()
      .oneOf([ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  }),
  login: object({
    email: string().email("Invalid email format").required("Email is required"),
    password: string().required("Password is required"),
  }),
  forgotPassword: object({
    email: string().email("Invalid email format").required("Email is required"),
  }),
  resetPassword: object({
    password: string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: string()
      .oneOf([ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  }),
};

export default authSchema;
