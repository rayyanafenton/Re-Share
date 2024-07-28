export default function getFormattedDate(listTime: any) {
  const date = new Date(listTime);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export function getFormattedTime(listTime: any) {
  const date = new Date(listTime);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Add leading zero if needed
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Use toLocaleTimeString with options to get time in 12-hour format with AM/PM
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formattedTime;
}
