import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITeam extends Document {
    name: string;
    role: string;
    bio?: string;
    joinedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const teamSchema: Schema<ITeam> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        joinedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Team: Model<ITeam> = mongoose.model<ITeam>("Team", teamSchema);

export default Team;
