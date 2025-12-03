import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            // Unique constraint failed
            message = "Duplicate value detected. This record already exists.";
            error = err.meta;
        }

        if (err.code === "P1000") {
            // Database authentication failed
            message =
                "Database authentication failed. Please check your database credentials or connection settings.";
            error = err.meta;
        }

        if (err.code === "P2003") {
            // Foreign key constraint failed
            message =
                "Operation failed due to an invalid or missing related record. Please check your foreign key references.";
            error = err.meta;
        }

        if (err.code === "P2025") {
            // Record not found
            message =
                `Requested ${err.meta?.modelName || "record"} not found. Please verify the provided ID or query parameters.`;
            error = err.meta;
        }
    }



    res.status(statusCode).json({
        success,
        message,
        error
    })
};

export default globalErrorHandler;