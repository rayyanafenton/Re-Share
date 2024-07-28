export function getTimeRemaining(biddingDeadline: string) {
  if (!biddingDeadline) {
    return "No deadline provided";
  }

  // Parsing the date components
  const [year, month, day] = biddingDeadline.split("/").map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return "Invalid date format";
  }

  // Note: Month is 0-indexed in JavaScript Date, so we subtract 1 from the month
  const deadlineDate = new Date(year, month - 1, day);
  const currentTime = new Date().getTime();
  const remaining = deadlineDate.getTime() - currentTime;

  if (remaining <= 0) {
    return "Bidding Ended";
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  let timeRemainingStr = "";
  if (days > 0) {
    timeRemainingStr += `${days}d `;
  }
  if (hours > 0) {
    timeRemainingStr += `${hours}:`;
  }
  if (minutes > 0) {
    timeRemainingStr += `${minutes}:`;
  }
  timeRemainingStr += `${seconds}`;

  return timeRemainingStr;
}
