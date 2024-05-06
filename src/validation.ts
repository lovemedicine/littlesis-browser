export function validateDate(date: string): boolean {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) return false;

  const [year, month, day] = match.slice(1, 4).map(str => parseInt(str));

  if (year > 2024) return false;
  if (month > 12) return false;
  if (day > 31) return false;

  return true;
}
