// Repo: mock reviews
import { reviews } from "../data/mock/reviews.mock.faker";
import { ReviewRepository, CreateReviewInput } from "../interfaces/review.repository.interface";
import { Review } from "../models/review.model";

export class MockReviewRepository implements ReviewRepository {
    // list
    async findByBookId(bookId: number): Promise<Review[]> {
        const bookReviews: Review[] = reviews.filter((reviewItem: Review) => reviewItem.bookId === bookId);
        return bookReviews;
    }
    
    // add
    async create(bookId: number, data: CreateReviewInput): Promise<Review> {
        const newId: number = reviews.length > 0 ? Math.max(...reviews.map((review: Review) => review.id)) + 1 : 1;

        const newReview: Review = {
            id: newId,
            bookId,
            userName: data.userName,
            rating: data.rating,
            comment: data.comment,
            createdAt: new Date().toISOString(),
        };
        reviews.push(newReview);
        return newReview;
    }
    
}