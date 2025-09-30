export function splitIntoColumns<T>(
  items: T[],
  itemsPerColumn: number,
  maxColumns: number
): T[][] {
  const columns: T[][] = [];
  for (let col = 0; col < maxColumns; col++) {
    const start = col * itemsPerColumn;
    const end = start + itemsPerColumn;
    const columnItems = items.slice(start, end);
    if (columnItems.length > 0) columns.push(columnItems);
  }
  return columns;
}