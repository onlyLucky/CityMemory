export interface IFeedback {
  id: string;
  userId: string;
  type: string;
  content: string;
  images?: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmitFeedbackParams {
  type: string;
  content: string;
  images?: string[];
}
