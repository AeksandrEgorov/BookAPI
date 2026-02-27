export interface Review {
  id: number;
  bookId: number;
  username: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}
