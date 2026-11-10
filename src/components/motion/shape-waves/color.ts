export const parseColor = (
  value: string | undefined,
  fallback: string,
): [number, number, number] => {
  const source = typeof value === "string" ? value.trim() : "";
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(source) || /^#?([\da-f]{6})$/i.exec(fallback);
  let hex = (match as RegExpExecArray)[1];
  if (hex.length === 3) hex = hex.replace(/./g, (char) => char + char);
  return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
};
