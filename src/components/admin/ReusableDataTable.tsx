import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ReusableDataTableColumn<T> {
  key: string;
  header: ReactNode;
  width: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
}

interface ReusableDataTableProps<T> {
  id?: string;
  data: T[];
  columns: ReusableDataTableColumn<T>[];
  getRowKey: (row: T) => string | number;
  emptyMessage: string;
  className?: string;
  rowClassName?: string | ((row: T) => string);
}

export function ReusableDataTable<T>({
  id,
  data,
  columns,
  getRowKey,
  emptyMessage,
  className,
  rowClassName,
}: ReusableDataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[1040px] table-fixed border-collapse text-left font-sans" id={id}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {columns.map((column) => (
              <th key={column.key} className={cn("px-6 py-4", column.headerClassName)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className={cn(
                  "transition-all hover:bg-white/[0.01]",
                  typeof rowClassName === "function" ? rowClassName(row) : rowClassName,
                )}
              >
                {columns.map((column) => (
                  <td key={column.key} className={cn("px-6 py-4 align-middle", column.cellClassName)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-xs text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
