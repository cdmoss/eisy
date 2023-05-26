export const Prioritys = [
  "Urgent & Important",
  "Not Urgent & Important",
  "Urgent & Unimportant",
  "Not Urgent & Unimportant",
];
export type Priority = (typeof Prioritys)[number];
export const matrixColors: Record<Priority, string> = {
  "Urgent & Important": "red.500",
  "Not Urgent & Important": "yellow.500",
  "Urgent & Unimportant": "blue.500",
  "Not Urgent & Unimportant": "green.500",
};
