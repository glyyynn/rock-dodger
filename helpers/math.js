export function getBoundedRandom(minVal, maxVal, exclusionMinVal, exclusionMaxVal) {
  const [min, max, exclusionMin, exclusionMax] = [minVal, maxVal, exclusionMinVal, exclusionMaxVal].map((val) => val * 1000 );
  let value = (Math.random() - 0.5) * (max - min);

  // Ensure the value is never between exclusionMin and exclusionMax
  if (value > exclusionMin && value < exclusionMax) {
    // If the value falls within the exclusion range, shift it out of range
    value = value < 0 ? exclusionMin - (Math.random() * (exclusionMin - min)) : exclusionMax + (Math.random() * (max - exclusionMax));
  }

  return value;
}
