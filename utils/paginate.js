export const paginate = (arr = [], page = 1, count = 10) => {
  const results = arr.splice((page - 1) * count, count);
  return { count: arr.length, results };
};
