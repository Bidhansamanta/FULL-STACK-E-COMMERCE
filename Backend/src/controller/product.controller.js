import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHanlder.js";

// Genarate Stock Kiping Unit(SKU)
const genarateSKU = async (category) => {
  const count = await Product.countDocuments({ category });

  return `${category.toUpperCase()}-${String(count + 1).padStart(4, "0")}`;
};

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, stock } = req.body;

  // Check required fields
  if (
    !title ||
    !description ||
    price === undefined ||
    !category ||
    stock === undefined
  ) {
    throw new Error("All fields are required to proceed");
  }

  // Check existing product
  const isProductAlreadyExists = await Product.findOne({
    title,
    description,
  });

  if (isProductAlreadyExists) {
    throw new Error("This product already exists");
  }

  // Generate SKU
  const sku = await genarateSKU(category);

  // Create product
  const newProduct = await Product.create({
    title,
    description,
    price,
    category,
    stock,
    sku,
  });

  // Send response
  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    newProduct,
  });
});

// All Products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const allProducts = await Product.find();

    return res.status(200).json({ message: "All Product", allProducts });
  } catch (error) {
    throw new Error("Internal Server Error");
  }
});

// Product By Id
const getProductById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      throw new Error("Product Id not found");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    return res
      .status(200)
      .json({ message: "Product Fetch Successfully", product });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      throw new Error("Product Id not found");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { returnDocument: "after" },
    );

    if (!updatedProduct) {
      throw new Error("Error while creating product");
    }

    return res
      .status(200)
      .json({ message: "Product Updated Successfully", updatedProduct });
  } catch (error) {
    throw new Error("Internal Server Error");
  }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      throw new Error("Product Id not found");
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new Error("Product Not found");
    }

    return res
      .status(200)
      .json({ message: "Product Deleted Successfully", deletedProduct });
  } catch (error) {
    throw new Error("Internal Server Error", error);
  }
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
