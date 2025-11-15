import { prisma } from '@/lib/db';

export const reviewService = {
  /**
   * Get all approved reviews
   */
  async getApprovedReviews() {
    return await prisma.review.findMany({
      where: {
        isApproved: true,
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Get reviews by customer ID
   */
  async getReviewsByCustomerId(customerId: string) {
    return await prisma.review.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Create a new review
   */
  async createReview(data: {
    customerId: string;
    bookingId?: string;
    rating: number;
    comment: string;
  }) {
    return await prisma.review.create({
      data: {
        ...data,
        isApproved: false, // Reviews need approval by default
      },
    });
  },

  /**
   * Approve a review
   */
  async approveReview(reviewId: string) {
    return await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string) {
    return await prisma.review.delete({
      where: { id: reviewId },
    });
  },
};
