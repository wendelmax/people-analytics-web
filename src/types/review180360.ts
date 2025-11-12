export type ReviewStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED';

export type ReviewerType = 'SELF' | 'MANAGER' | 'PEER_SELF_SELECTED' | 'PEER_MANAGER_SELECTED';

export interface Reviewer {
  id: string;
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  type: ReviewerType;
  status: ReviewStatus;
  submittedAt?: string;
}

export interface ReviewQuestion {
  id: string;
  question: string;
  category: 'performance' | 'skills' | 'behavior' | 'collaboration' | 'leadership';
  required: boolean;
}

export interface ReviewAnswer {
  questionId: string;
  answer: string;
  rating?: number;
}

export interface ReviewSubmission {
  id: string;
  cycleId: string;
  revieweeId: string;
  revieweeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewerType: ReviewerType;
  answers: ReviewAnswer[];
  overallRating?: number;
  strengths?: string;
  areasForImprovement?: string;
  submittedAt: string;
  status: ReviewStatus;
}

export interface Review180360Data {
  id: string;
  cycleId: string;
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  isSenior: boolean;
  reviewType: '180' | '360';
  status: ReviewStatus;
  selfReview?: ReviewSubmission;
  managerReview?: ReviewSubmission;
  peerReviews: ReviewSubmission[];
  aiSummary?: string;
  finalReport?: ReviewFinalReport;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFinalReport {
  id: string;
  reviewId: string;
  overallRating: number;
  aiSummary: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  managerFeedback?: string;
  generatedAt: string;
}

