import mongoose, { Document, Schema, Model } from "mongoose";

export interface IService extends Document {
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema: Schema<IService> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Service title is required"],
            trim: true,
            minlength: 3,
            maxlength: 200,
        },
        description: {
            type: String,
            required: [true, "Service description is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Service: Model<IService> = mongoose.model<IService>("Service", serviceSchema);

export default Service;
