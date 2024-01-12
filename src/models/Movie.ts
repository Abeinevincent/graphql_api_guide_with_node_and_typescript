// Import necessary modules
import mongoose, { Schema, Document } from "mongoose";

// Define the interface for User document
export interface IMovie extends Document {
  title: string;
  genre: string;
  rating: number;
  duration: string; // e.g 2 hours
}

// Create a schema for the User model
const movieSchema: Schema<IMovie> = new Schema(
  {
    title: { type: String, required: true, unique: true },
    genre: { type: String, required: true },
    rating: { type: Number, required: true },
    duration: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the User model
export default mongoose.model<IMovie>("Movie", movieSchema);
