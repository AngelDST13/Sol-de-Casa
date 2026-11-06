/**
 * Interpolación lineal sobre una tabla ordenada de puntos [x, y] (supuesto 5).
 * Por debajo del primer punto devuelve 0; por encima del último, el tope.
 * @param {Array<[number, number]>} points
 * @param {number} x
 * @returns {number}
 */
export const interpolate = (points, x) => {
  if (x <= 0) return 0;
  const [lastX, lastY] = points[points.length - 1];
  if (x >= lastX) return lastY;

  const upperIndex = points.findIndex(([px]) => px >= x);
  const [x0, y0] = points[upperIndex - 1];
  const [x1, y1] = points[upperIndex];
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};
