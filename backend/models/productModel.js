import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String },
    type: { type: String },
    serial: { type: String },
    loadCell: { type: String },
    iDay: { type: String },
    nameCus: { type: String },
    phone: { type: String },
    address: { type: String },
    time: { type: Number, required: true },
    sDay: { type: String },
    eDay: { type: String },
    enable: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
