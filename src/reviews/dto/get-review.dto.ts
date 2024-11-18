export class GetReviewDto {
  bookId: number;
  reviews: Review[];
}

class Review {
  id: number;
  rating: number;
  content: string;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
  };
}
