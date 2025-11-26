import React, { useMemo } from "react";
import { Pagination } from "@heroui/react";

export const BottomPagination = ({
  // selectedKeys,
  page,
  pages,
  // filteredItems,
  setPage,
  onRowsPerPageChange,
  totalItems,
  // rowsPerPage,
}) => {
  return useMemo(() => {
    return (
      <div className="flex flex-wrap gap-4 justify-between items-center bg-background rounded-lg p-2 shadow-md w-full">
        <span className="text-small text-default-400 justify-start">
          Total Items : {totalItems}
        </span>
        {totalItems > 0 && (
          <Pagination
            isCompact
            showControls={pages > 1}
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
            initialPage={page}
            className="text-white"
          />
        )}

        <div className="flex justify-end">
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              defaultValue="10"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    // selectedKeys,
    page,
    pages,
    setPage,
    onRowsPerPageChange,
    totalItems,
  ]);
};
