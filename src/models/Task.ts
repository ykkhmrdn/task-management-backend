import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  isCompleted: boolean;
  order: number;
  relatedTasks: mongoose.Types.ObjectId[];
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true},
  description
})