const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");
const User = require("../../models/users.model");
const mongoose = require("mongoose");


// [GET] /cart/get-cart/:cartId
module.exports.getCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    // Kiểm tra giá trị cartId
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      res.json({
        code: 400,
        message: "Giỏ hàng không hợp lệ",
      });
    }

    // Tìm giỏ hàng
    const recordsCart = await Cart.findOne({ _id: cartId }).lean();

    if (recordsCart) {
      let totalQuantityProduts = 0;
      if (recordsCart.products.length > 0) {
        for (const item of recordsCart.products) {
          const productId = item.product_id;
          totalQuantityProduts += item.quantity;
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

      // Tính tổng giá của giỏ hàng
      recordsCart.totalPriceProducts = recordsCart.products.reduce(
        (sum, item) => item.totalPrice + sum,
        0
      );
      recordsCart.totalQuantityProduts = totalQuantityProduts;

      return res.json({
        code: 200,
        message: "Giỏ hàng",
        recordsCart: recordsCart,
      });
    } else {
      return res.json({
        code: 201,
        message: "Chưa có giỏ hàng",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi trong khi lấy giỏ hàng",
      error: error.message,
    });
  }
};


// [GET] /cart/find/:tokenUser
module.exports.findCartByUserId = async (req, res) => {
  const tokenUser = req.params.tokenUser;

  const user = await User.findOne({ tokenUser: tokenUser });

  const cart = await Cart.findOne({ user_id: user._id });

  if (cart) {
    res.json({
      code: 200,
      message: "Giỏ hàng",
      cart: cart
    });
  } else {
    // Không tìm thấy giỏ hàng có user_id
    res.json({
      code: 400
    });
  }
}

// [GET] /cart/create
module.exports.create = async (req, res) => {
  try {
    const newCart = new Cart();
    await newCart.save();

    res.json({
      code: 200,
      cartId: newCart._id
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create cart" });
  }

}

// [PATCH] /cart/update-user/:tokenUser
module.exports.updateUser = async (req, res) => {
  try {
    const tokenUser = req.params.tokenUser;
    const cartId = req.body.cartId;

    const cart = await Cart.findOne({ _id: cartId });
    if (cart) {
      const user = await User.findOne({ tokenUser: tokenUser });
      await Cart.updateOne({
        _id: cartId
      }, {
        user_id: user._id
      });
    } else {
      res.json({
        code: 400,
        message: "Lỗi id giỏ hàng không chính xác!"
      });
    }

    res.json({
      code: 200,
      cartId: cart._id
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create cart" });
  }

}

// [PATCH] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.body.cartId;

    const cart = await Cart.findOne({ _id: cartId });

    let totalQuantityProduts = 0;

    const exisstProductCart = cart.products.find(item => item.product_id === productId);

    if (exisstProductCart) {
      const quantityNew = quantity + exisstProductCart.quantity;
      totalQuantityProduts += quantityNew;
      await Cart.updateOne({
        _id: cartId,
        'products.product_id': productId
      }, {
        $set: { 'products.$.quantity': quantityNew }
      });
    } else {
      const objCart = {
        product_id: productId,
        quantity: quantity
      }
      totalQuantityProduts += quantity;
      await Cart.updateOne({
        _id: cartId
      }, {
        $push: { products: objCart }
      });
    }

    res.json({
      code: 200,
      message: "Thêm vào giỏ hàng thành công",
      totalQuantityProduts: totalQuantityProduts
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [PATCH] /cart/delete/:idProduct
module.exports.del = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const cartId = req.body.cartId;

    await Cart.updateOne({
      _id: cartId
    }, {
      $pull: { products: { product_id: productId } }
    });

    const cart = await Cart.findOne({ _id: cartId });
    let totalQuantityProduts = 0;
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id;
        totalQuantityProduts += item.quantity;
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
      totalQuantityProduts: totalQuantityProduts
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [PATCH] /cart/update/:idProduct/:quantity
module.exports.update = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.body.cartId;

    await Cart.updateOne({
      _id: cartId,
      'products.product_id': productId
    }, {
      $set: { 'products.$.quantity': quantity }
    });

    const cart = await Cart.findOne({ _id: cartId });
    let totalQuantityProduts = 0;
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id;
        totalQuantityProduts += item.quantity;
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
      message: "Cập nhật số lượng thành công",
      totalQuantityProduts: totalQuantityProduts
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}