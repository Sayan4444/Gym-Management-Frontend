import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationFooterProps {
  page: number;
  totalPages: number;
  setPage: (page: number | ((p: number) => number)) => void;
  itemsPerPage: number;
  totalItems: number;
  itemName: string;
  className?: string;
}

export function PaginationFooter({
  page,
  totalPages,
  setPage,
  itemsPerPage,
  totalItems,
  itemName,
  className = "pt-4",
}: PaginationFooterProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, totalItems)} of {totalItems} {itemName}
      </div>
      <div className="order-1 flex w-full items-center justify-center gap-1 sm:order-2 sm:w-auto sm:gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4 sm:mr-1" /> <span className="hidden min-[360px]:inline">Previous</span>
        </Button>
        <div className="whitespace-nowrap text-xs font-medium sm:text-sm">Page {page} of {totalPages}</div>
        <Button variant="outline" size="sm" onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <span className="hidden min-[360px]:inline">Next</span> <ChevronRight className="h-4 w-4 sm:ml-1" />
        </Button>
      </div>
    </div>
  );
}
