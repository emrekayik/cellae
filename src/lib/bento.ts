export function getSpanClasses(colSpan = 1, rowSpan = 1) {
  const colClass =
    colSpan === 3
      ? "col-span-1 md:col-span-2 lg:col-span-3"
      : colSpan === 2
        ? "col-span-1 md:col-span-2"
        : "col-span-1"

  const rowClass =
    rowSpan === 3
      ? "row-span-3 min-h-[500px]"
      : rowSpan === 2
        ? "row-span-2 min-h-[340px]"
        : "row-span-1 min-h-[180px]"

  return `${colClass} ${rowClass}`
}
