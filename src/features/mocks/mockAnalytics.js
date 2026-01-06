export const calculateAverageScore = (mocks) => {
  if (!mocks.length) return 0;
  return mocks.reduce((sum, m) => sum + m.score, 0) / mocks.length;
};