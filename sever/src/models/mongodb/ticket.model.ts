import mongoose, { Schema, Document } from 'mongoose';

interface ITicket extends Document {
  userId: string;
  adventureTickets: {
    current: number;
    max: number;
    lastRecoverTime: Date;
  };
  randomTickets: {
    current: number;
    max: number;
    dailyResetTime: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    adventureTickets: {
      current: {
        type: Number,
        default: 30,
      },
      max: {
        type: Number,
        default: 30,
      },
      lastRecoverTime: {
        type: Date,
        default: Date.now,
      },
    },
    randomTickets: {
      current: {
        type: Number,
        default: 3,
      },
      max: {
        type: Number,
        default: 3,
      },
      dailyResetTime: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

TicketSchema.index({ userId: 1 });

export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
