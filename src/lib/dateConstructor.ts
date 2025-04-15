export const dateConstructor = (fromDate: string, toDate: string) => {
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  // Get day suffix (st, nd, rd, th)
  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return "th";

    const lastDigit = day % 10;

    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const weekday = startDate.toLocaleString("en-US", { weekday: "long" });
  const month = startDate.toLocaleString("en-US", { month: "long" });
  const day = startDate.getDate();
  const suffix = getDaySuffix(day);

  const startTime = startDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const endTime = endDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${weekday}, ${month} ${day}${suffix} from ${startTime}-${endTime}`;
};
