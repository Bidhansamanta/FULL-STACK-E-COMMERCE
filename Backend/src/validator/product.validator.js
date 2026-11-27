import { body } from "express-validator";


const productValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Product Name is required to proceed"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Product Description is required to proceed"),

    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Product Price must be a number greater than 0"),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Product Category is required"),

    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ];
};


export {productValidator};
