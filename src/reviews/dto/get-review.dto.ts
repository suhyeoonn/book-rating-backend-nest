export class GetReviewDto {
  bookId: number;
  reviews: ReviewItemDto[];
}

export class ReviewItemDto {
  id: number;
  rating: number;
  content: string;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
  };
}
