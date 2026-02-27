import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    cId: String,
    pId: Number,
    aId: Number,
    name: String,
    variantName: String,
    imageUrl: String,
    price: String,
    quantity: Number
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
export default CartItem;
