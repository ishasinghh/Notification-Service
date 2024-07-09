import { Request } from "express";

interface PaginationResult {
  skip: number;
  limit: number;
  page: number;
  totalPages: number;
}

const getPagination = async (
  page: number,
  limit: number,
  totalItems: number
): Promise<PaginationResult> => {
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    skip,
    limit,
    page,
    totalPages,
  };
};

export { getPagination };
