import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controller/product.controller.js";
import { productValidator } from "../validator/product.validator.js";
import { checkRole, verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

router.route("/create-product").post(productValidator(), createProduct);
router.route("/all-products").get(getAllProducts);
router.route("/all-products/:productId").get(getProductById);
router.route("/update-product/:productId").put(verifyJWT,checkRole, updateProduct);
router.route("/delete-product/:productId").delete(verifyJWT, checkRole, deleteProduct);


export default router;
