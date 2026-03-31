export const calculatePriority = (
  stock: number,
  threshold: number,
): "Low" | "Medium" | "High" => {
  if (stock === 0) return "High";
  if (stock <= threshold / 2) return "High";
  if (stock <= threshold) return "Medium";
  return "Low";
};
