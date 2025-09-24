import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPartner extends Document {
    name: string;
    website?: string;
    createdAt: Date;
    updatedAt: Date;
}

const partnerSchema: Schema<IPartner> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Partner name is required"],
            trim: true,
            minlength: 2,
            maxlength: 200,
        },
        website: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Partner: Model<IPartner> = mongoose.model<IPartner>("Partner", partnerSchema);

export default Partner;
