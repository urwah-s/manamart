// models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    cId: String,
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
