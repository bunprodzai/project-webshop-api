const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");


// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const recordsCart = await Cart.findOne({ _id: cartId }).lean();

  if (recordsCart) {
    if (recordsCart.products.length > 0) {
      for (const item of recordsCart.products) {
        const productId = item.product_id;

        const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" }).select("title thumbnail price slug discountPercentage");

        productInfo.priceNew = ((productInfo.price * (100 - productInfo.discountPercentage)) / 100).toFixed(0);
        item.totalPrice = productInfo.priceNew * item.quantity;
        item.productInfo = productInfo;

      }
    }

    recordsCart.totalPriceProducts = recordsCart.products.reduce((sum, item) => item.totalPrice + sum, 0);

    res.json({
      code: 200,
      message: "Giỏ hàng",
      recordsCart: recordsCart
    });
  } else {
    res.json({
      code: 201,
      message: "Chưa có giỏ hàng"
    });
  }

}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId });

    const exisstProductCart = cart.products.find(item => item.product_id === productId);

    if (exisstProductCart) {
      const quantityNew = quantity + exisstProductCart.quantity;

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

      await Cart.updateOne({
        _id: cartId
      }, {
        $push: { products: objCart }
      });
    }

    res.json({
      code: 200,
      message: "Thêm vào giỏ hàng thành công"
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [GET] /cart/delete/:idProduct
module.exports.del = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const cartId = req.cookies.cartId;

    await Cart.updateOne({
      _id: cartId
    }, {
      $pull: { products: { product_id: productId } }
    });

    res.json({
      code: 200,
      message: "Xóa sản phẩm thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [GET] /cart/update/:idProduct/:quantity
module.exports.update = async (req, res) => {
  try {
    const productId = req.params.idProduct;
    const quantity = req.params.quantity;
    const cartId = req.cookies.cartId;

    await Cart.updateOne({
      _id: cartId,
      'products.product_id': productId
    }, {
      $set: { 'products.$.quantity': quantity }
    });

    res.json({
      code: 200,
      message: "Cập nhật số lượng thành công"
    });

  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}