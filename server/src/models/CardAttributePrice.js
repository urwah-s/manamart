import mongoose from 'mongoose';

const productAttributePriceSchema = new mongoose.Schema({
    aId: Number,
    price: Number,
    imageUrl: String
});

const CardAttributePrice = mongoose.model('ProductAttribute', productAttributePriceSchema);

export default CardAttributePrice;
