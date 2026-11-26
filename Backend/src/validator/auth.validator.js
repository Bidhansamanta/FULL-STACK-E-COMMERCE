import { body } from "express-validator";

// Registration Validator
const registrationValidator = () => {
  return [
    body("userName")
      .trim()
      .notEmpty()
      .withMessage("User Name Can not be Empty")
      .isLength({ min: 3, max: 15 })
      .withMessage("User can be minimum 3 char to maximum 15 char"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email can not be Empty")
      .isEmail()
      .withMessage("Invalid Email Id"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password can not be Empty")
      .isLength({ min: 5, max: 10 })
      .withMessage("Password can be minimum 5 char to maximum 10 char"),
  ];
};

// Login Validator
const loginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email can not be Empty")
      .isEmail()
      .withMessage("Invalid Email Id"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password can not be Empty")
      .isLength({ min: 5, max: 10 })
      .withMessage("Password can be minimum 5 char to maximum 10 char"),
  ];
};

export { registrationValidator, loginValidator };
