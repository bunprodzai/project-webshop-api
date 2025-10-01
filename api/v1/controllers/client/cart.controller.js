const { getQuantityBySize } = require("../../../../helpers/getQuantityBySize");
const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");
const User = require("../../models/users.model");
const mongoose = require("mongoose");


// [GET] /cart/get-cart
module.exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Kiểm tra giá trị cartId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.json({
        code: 400,
        message: "Giỏ hàng không hợp lệ",
      });
      return;
    }

    // Tìm giỏ hàng
    const recordsCart = await Cart.findOne({ user_id: userId }).lean();

    if (recordsCart) {
      let totalQuantity = 0;
      if (recordsCart.products.length > 0) {
        for (const item of recordsCart.products) {
          const productInfo = await Product
            .findOne({ _id: item.product_id }).select("price discountPercentage title thumbnail slug")
          item.price = productInfo.price
          item.discountPercentage = productInfo.discountPercentage
          item.title = productInfo.title
          item.thumbnail = productInfo.thumbnail
          item.slug = productInfo.slug

          totalQuantity += item.quantity;
        }
      }

      return res.json({
        code: 200,
        message: "Giỏ hàng",
        data: recordsCart,
        totalQuantity: totalQuantity
      });
    } else {
      return res.json({
        code: 201,
        message: "Không tìm thấy giỏ hàng!",
      });
    }
  } catch (error) {
    console.log(error.message);

    res.json({
      code: 500,
      message: "Đã xảy ra lỗi trong khi lấy giỏ hàng"
    });
  }
};

// [PATCH] /cart/add/:productId
module.exports.addPatch = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const userId = req.user.id;
    const size = req.body.size;

    const cart = await Cart.findOne({ user_id: userId });

    const existsProductCart = cart.products.find(item => item.product_id === productId && item.size === size);

    if (existsProductCart) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
      let quantityNew = quantity + existsProductCart.quantity;

      const stockProduct = await Product.findOne({
        _id: productId,
        sizeStock: {
          $elemMatch: { $regex: `^${size}-` } // ví dụ: "^S-" sẽ match "S-32"
        }
      });

      const quantityStock = getQuantityBySize(stockProduct.sizeStock, size);

      if (quantityNew > quantityStock) {
        // Nếu số lượng mới vượt quá số lượng trong kho, đặt số lượng mới bằng số lượng trong kho
        quantityNew = quantityStock;
      }

      await Cart.updateOne({
        user_id: userId,
        'products.product_id': productId
      }, {
        $set: { 'products.$.quantity': quantityNew }
      });

    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới
      const objCart = {
        product_id: productId,
        quantity: quantity,
        size: size
      }
      await Cart.updateOne({
        user_id: userId
      }, {
        $push: { products: objCart }
      });
    }

    const cartExists = await Cart.findOne({ user_id: userId });
    let totalQuantity = 0;
    if (cartExists.products.length > 0) {
      for (const item of cartExists.products) {
        totalQuantity += item.quantity;
      }
    }

    res.json({
      code: 200,
      message: "Thêm vào giỏ hàng thành công",
      totalQuantity: totalQuantity
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [PATCH] /cart/delete/:idProduct
module.exports.delPatch = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const size = req.body.size;
    const userId = req.user.id;

    await Cart.updateOne({
      user_id: userId
    }, {
      $pull: { products: { product_id: productId, size: size } }
    });

    const cart = await Cart.findOne({ user_id: userId });
    let totalQuantity = 0;
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id;
        totalQuantity += item.quantity;
        // Kiểm tra và lấy thông tin sản phẩm
        const productInfo = await Product.findOne({
          _id: productId,
          deleted: false,
          status: "active",
        }).select("title thumbnail price slug discountPercentage");

        if (productInfo) {
          // Tính toán giá và tổng giá
          productInfo.priceNew = (
            (productInfo.price * (100 - productInfo.discountPercentage)) /
            100
          ).toFixed(0);

          item.totalPrice = productInfo.priceNew * item.quantity;
          item.productInfo = productInfo;
        }
      }
    }

    res.json({
      code: 200,
      message: "Xóa sản phẩm thành công",
      totalQuantity: totalQuantity
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [PATCH] /cart/update/:idProduct
module.exports.updatePatch = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const quantity = parseInt(req.body.quantity);
    const size = req.body.size;
    const userId = req.user.id;

    const cartExists = await Cart.findOne({ user_id: userId });

    if (!cartExists) {
      return res.json({
        code: 400,
        message: "Giỏ hàng không tồn tại"
      });
    } else {
      // Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng hay không
      const productExists = cartExists.products.find(item => item.product_id === productId && item.size === size);
      if (!productExists) {
        // Nếu sản phẩm không tồn tại trong giỏ hàng
        return res.json({
          code: 400,
          message: "Sản phẩm không tồn tại trong giỏ hàng"
        });
      } else {
        // Nếu sản phẩm tồn tại trong giỏ hàng
        // Kiểm tra số lượng sản phẩm trong kho
        const stockProduct = await Product.findOne({
          _id: productId,
        });

        const quantityStock = getQuantityBySize(stockProduct.sizeStock, size);

        if (quantityStock && quantityStock < quantity) {
          // Nếu số lượng sản phẩm trong kho không đủ
          await Cart.updateOne({
            user_id: userId,
            'products.product_id': productId
          }, {
            $set: { 'products.$.quantity': quantityStock }
          });
        } else {
          // Nếu số lượng sản phẩm trong kho đủ
          await Cart.updateOne({
            user_id: userId,
            'products.product_id': productId
          }, {
            $set: { 'products.$.quantity': quantity }
          });
        }
      }
    }

    const cart = await Cart.findOne({ user_id: userId });
    let totalQuantity = 0;
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        totalQuantity += item.quantity;
      }
    }

    res.json({
      code: 200,
      message: "Cập nhật số lượng thành công",
      totalQuantity: totalQuantity
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [PATCH] /cart/merge-cart
module.exports.mergeCartPatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = req.body.cartItems; // [{ product_id, size, quantity }, ...]

    // Tìm giỏ hàng trong DB
    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({
        user_id: userId,
        products: []
      });
    }

    for (const item of cartItems) {
      const { _id, size, quantity } = item;

      // Lấy thông tin sản phẩm từ DB để check tồn kho
      const stockProduct = await Product.findById(_id);
      if (!stockProduct) continue;

      const quantityStock = getQuantityBySize(stockProduct.sizeStock, size);
      if (!quantityStock) continue;

      // Tìm sản phẩm trong giỏ hàng của user
      const productExists = cart.products.find(
        (p) => p.product_id === _id && p.size === size
      );

      if (productExists) {
        // Nếu tồn tại thì cộng dồn số lượng
        let newQuantity = productExists.quantity + quantity;

        // Nếu vượt quá tồn kho thì gán = tồn kho
        if (newQuantity > quantityStock) {
          newQuantity = quantityStock;
        }

        productExists.quantity = newQuantity;
      } else {
        // Nếu chưa tồn tại thì thêm mới
        let finalQuantity = quantity;

        if (finalQuantity > quantityStock) {
          finalQuantity = quantityStock;
        }

        cart.products.push({
          product_id: _id,
          size: size,
          quantity: finalQuantity
        });
      }
    }

    // Lưu lại giỏ hàng sau khi merge
    await cart.save();

    // Tính tổng số lượng
    let totalQuantity = 0;
    for (const item of cart.products) {
      totalQuantity += item.quantity;
    }

    res.json({
      code: 200,
      message: "Merge giỏ hàng thành công",
      totalQuantity: totalQuantity
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi merge giỏ hàng"
    });
  }
};
