export class GetReviewDto {
  bookId: number;
  reviews: ReviewDto[];
}

export class ReviewDto {
  id: number;
  rating: number;
  content: string;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
  };
}
