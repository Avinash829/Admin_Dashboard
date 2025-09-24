import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICase extends Document {
    title: string;
    description: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const caseSchema: Schema<ICase> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Case title is required"],
            trim: true,
            minlength: 3,
            maxlength: 200,
        },
        description: {
            type: String,
            required: [true, "Case description is required"],
            trim: true,
        },
        images: [
            {
                type: String, // URL
                trim: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Case: Model<ICase> = mongoose.model<ICase>("Case", caseSchema);

export default Case;
