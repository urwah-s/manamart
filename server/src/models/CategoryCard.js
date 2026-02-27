import mongoose from 'mongoose';

const categoryCardSchema = new mongoose.Schema({
    pId: Number,
    aId: Number,
    cat: String
});

const CategoryCard = mongoose.model('CategoryCard', categoryCardSchema);

export default CategoryCard;
