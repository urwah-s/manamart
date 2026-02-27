import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    color: [String],
});

const Card = mongoose.model('Card', cardSchema);

export default Card;
