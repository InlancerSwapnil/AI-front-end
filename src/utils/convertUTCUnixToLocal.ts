export function convertUnixToLocal(unixTimestamp: number): string {
  const utcDate = new Date(unixTimestamp * 1000);
  const localDate = new Date(utcDate.toLocaleString());

  return localDate.toLocaleString();
}
