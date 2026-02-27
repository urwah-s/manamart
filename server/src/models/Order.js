import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    cId: String,
    oId: String,
    name: String,
    items: [
        {
            pId: Number,
            aId: Number,
            quantity: Number,
            name: String,
            variantName: String,
            imageUrl: String,
            price: String,
        }
    ]
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
