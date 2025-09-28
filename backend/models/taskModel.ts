import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    description?: string;
    date?: string;
    time?: string;
    dueDate?: Date;
    status: "upcoming" | "pending" | "completed";
}

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        date: { type: String },
        time: { type: String },
        dueDate: { type: Date },
        status: {
            type: String,
            enum: ["upcoming", "pending", "completed"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
