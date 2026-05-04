export type Review = {
  id: number;
  bookId: number;
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
};

export type ReviewsResponse = {
  data: Review[];
};

export type CreateReviewInput = {
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
};

export type SingleReviewResponse = {
  data: Review;
};