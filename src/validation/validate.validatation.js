const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errMsg = error.errors.map((err) => err).join(", ");
    const mergedError = new Error(errMsg);
    next(mergedError);
  }
};

export default validate;
