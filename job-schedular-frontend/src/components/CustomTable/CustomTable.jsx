"use client";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { BottomPagination } from "./TablePagination";
import { TableRenderCell } from "./TableRenderCell";

const CustomTable = ({
  page,
  pages,
  setPage,
  rowsPerPage,
  onRowsPerPageChange,
  totalItems,
  headerColumns,
  items,
  setMethod,
  setIsOpen,
  onRowSelected,
  setIsProductFormView,
  handleVisibilityToggle,
}) => {
  // eslint-disable-next-line no-undef
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showNoData, setShowNoData] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "id",
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "ascending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  useEffect(() => {
    if (items.length === 0) {
      setIsLoading(true);
    } else {
      // Ensure at least 1 second of loading before showing data
      const timeout = setTimeout(() => {
        setIsLoading(false);
        // setShowNoData(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [items]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowNoData(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowNoData(false);
    }
  }, [isLoading]);

  const bottomContent = BottomPagination({
    selectedKeys,
    // itemLength: items.length,
    // itemLength: totalItems,
    page,
    pages,
    rowsPerPage,
    // hasSearchFilter,
    // filteredItems,
    setPage,
    onRowsPerPageChange,
    totalItems,
  });

  const classNames = useMemo(
    () => ({
      wrapper: [
        "bg-background",
        "rounded-lg",
        "h-[calc(100vh-275px)]",
        "pt-0 px-0",
      ],
      th: ["bg-primary", "text-white", "text-sm"],
      tr: [
        "h-12",
        "data-[odd=true]:bg-primary/2",
        "data-[hover=true]:hover:bg-foreground/10",
      ],
      // td: ["min-w-80"],
    }),
    []
  );
  return (
    <div>
      {isLoading ? (
        showNoData ? (
          <div className="h-[calc(100vh-250px)] flex items-center justify-center">
            <p className="text-2xl font-semibold text-primary">No data found</p>
          </div>
        ) : (
          <div className="h-[calc(100vh-250px)] flex items-center justify-center">
            <Spinner color="primary" />
          </div>
        )
      ) : (
        <Table
          aria-label="Data table and filter options"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          isStriped
          classNames={classNames}
          selectedKeys={selectedKeys}
          // selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          // topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No records found"}
            items={sortedItems}
            loadingContent={<Spinner color="primary" />}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className="max-w-64 text-ellipsis whitespace-nowrap overflow-hidden">
                    <TableRenderCell
                      data={item}
                      columnKey={columnKey}
                      setMethod={setMethod}
                      setIsOpen={setIsOpen}
                      onRowSelected={onRowSelected}
                      setIsProductFormView={setIsProductFormView}
                    />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CustomTable;
