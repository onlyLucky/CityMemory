export interface Feedback {
  id: number;
  userId: number;
  feedbackType: number;
  title: string;
  content: string;
  images: string[];
  status: number;
  reply?: string;
  replyTime?: Date;
  replyAdminId?: number;
  createTime: Date;
  updateTime: Date;
}

export interface FeedbackInput {
  feedbackType: number;
  title: string;
  content: string;
  images?: string[];
}

export interface FeedbackList {
  list: Feedback[];
  total: number;
  page: number;
  pageSize: number;
}
