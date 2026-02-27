import mongoose from 'mongoose';

const cardAttributeSchema = new mongoose.Schema({
    pId: Number,
    aId: Number,
    name: String,
});

const CardAttribute = mongoose.model('CardAttribute', cardAttributeSchema);

export default CardAttribute;
