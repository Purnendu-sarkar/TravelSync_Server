import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { Request, Response } from "express";
import { IJWTPayload } from "../../types/common";

const createReview = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const user = req.user as IJWTPayload;
  const result = await ReviewService.createReview(user, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted successfully.!",
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
  const user = req.user as IJWTPayload;
  const result = await ReviewService.getMyReceivedReviews(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your reviews retrieved successfully.!",
    data: result,
  });
});

const getPublicReviews = catchAsync(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 3;
    const result = await ReviewService.getPublicReviews({ limit });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Public reviews retrieved successfully!",
      data: result,
    });
  }
);

const getMyGivenReviews = catchAsync
  (async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const result = await ReviewService.getMyGivenReviews(user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Your given reviews retrieved successfully!",
      data: result,
    });
  });

const updateReview = catchAsync
  (async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const reviewId = req.params.id;
    const result = await ReviewService.updateReview(user, reviewId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review updated successfully!",
      data: result,
    });
  });

const deleteReview = catchAsync
  (async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user as IJWTPayload;
    const reviewId = req.params.id;
    const result = await ReviewService.deleteReview(user, reviewId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review deleted successfully!",
      data: result,
    });
  });


export const ReviewController = {
  createReview,
  getMyReviews,
  getPublicReviews,
  getMyGivenReviews,
  updateReview,
  deleteReview
}; 