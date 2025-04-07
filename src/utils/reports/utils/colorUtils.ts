
/**
 * Get RGB color based on compliance score
 */
export const getScoreColor = (score: number): [number, number, number] => {
  if (score >= 80) {
    return [0, 128, 0]; // Green for good scores
  } else if (score >= 60) {
    return [204, 102, 0]; // Orange for moderate scores
  } else {
    return [187, 10, 30]; // Red for poor scores
  }
};
