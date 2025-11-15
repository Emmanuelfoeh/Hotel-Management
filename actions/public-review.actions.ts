'use server';

import { reviewService } from '@/lib/services';

/**
 * Get all approved reviews for public viewing
 */
export async function getPublicReviews() {
  try {
    const reviews = await reviewService.getApprovedReviews();

    // Serialize data for client-side usage
    const serializedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      customer: {
        name: `${review.customer.firstName} ${review.customer.lastName}`,
        location:
          [review.customer.city, review.customer.country]
            .filter(Boolean)
            .join(', ') || 'Guest',
      },
    }));

    return {
      success: true,
      data: serializedReviews,
    };
  } catch (error) {
    console.error('Failed to fetch public reviews:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reviews',
      data: [],
    };
  }
}
