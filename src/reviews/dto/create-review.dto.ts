export class CreateReviewDto {
  rating: number;
  content: string;
}

class ReviewResponseDto {
  id: number;
  content: string;
  rating: number;
  updatedAt: Date;
}

export class ReviewCreateResponseDto {
  review: ReviewResponseDto;
  averageRating: number;
}
