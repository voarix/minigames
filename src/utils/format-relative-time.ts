export const formatRelativeTime = (
  timestamp: string,
  now: number = Date.now(),
): string => {
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  const elapsed = Math.max(0, now - Date.parse(timestamp));

  if (elapsed < minute) return "just now";
  if (elapsed < hour) return `${Math.floor(elapsed / minute)} min ago`;

  const units = [
    { limit: day, duration: hour, label: "hour" },
    { limit: week, duration: day, label: "day" },
    { limit: 4 * week, duration: week, label: "week" },
    { limit: year, duration: month, label: "month" },
    { limit: Infinity, duration: year, label: "year" },
  ];

  for (const unit of units) {
    if (elapsed < unit.limit) {
      const count = Math.max(1, Math.floor(elapsed / unit.duration));
      const displayCount = unit.label === "month" ? Math.min(count, 11) : count;
      return `${displayCount} ${unit.label}${displayCount === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
};
