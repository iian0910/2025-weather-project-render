export const formatTheTimeString = (dateStr) => {
  const hour = parseInt(dateStr.slice(11, 13)) // 06 → 6
  const minute = dateStr.slice(14, 16) // "00"

  const unit = hour >= 12 ? "PM" : "AM"
  const h12 = hour % 12 === 0 ? 12 : hour % 12

  return `${h12}:${minute}${unit}`;
}