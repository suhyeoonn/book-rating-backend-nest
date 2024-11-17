import { Review } from '../interfaces/review.interface';

export class GetReviewDto {
  bookId: number;
  reviews: Review[];
}
