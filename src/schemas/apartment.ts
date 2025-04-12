import { Schema, Document } from 'mongoose';

export interface IApartmentSchema extends Document {
  title: string;
  description?: string;
  location: string;
  price: number;
  number: string;
  project?: string;
  thumbnail: string;
  images?: string[];
}

const apartmentSchema = new Schema<IApartmentSchema>({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  number: { type: String, required: true },
  project: { type: String },
  thumbnail: { type: String, required: true },
  images: { type: [String] },
}, {
  timestamps: true,
});

apartmentSchema.index({ title: 'text' });
apartmentSchema.index({ number: 1 });
apartmentSchema.index({ project: 1 });

export default apartmentSchema;
