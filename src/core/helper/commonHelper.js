export function convertMinToHours(durationInMin) {
  const hours = Math.floor(durationInMin / 60);
  const minutes = Math.floor(durationInMin % 60);

  if (hours > 0) {
    return `${hours} hrs ${minutes} mins`;
  }
  return `${minutes} mins`;
}

export function convertTo12HourFormat(time24h) {
  let [hours, minutes, seconds] = time24h.split(":").map(Number);

  let period = hours < 12 ? "AM" : "PM";

  hours = hours % 12 || 12;

  let time12h = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  return time12h;
}

export function getInitials(name) {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  if (words.length < 2) {
    return words[0] ? words[0][0].toUpperCase() : "";
  }

  // Get the first letter of the first and last words
  const firstLetter = words[0][0].toUpperCase();
  const lastLetter = words[words.length - 1][0].toUpperCase();

  return firstLetter + lastLetter;
}
