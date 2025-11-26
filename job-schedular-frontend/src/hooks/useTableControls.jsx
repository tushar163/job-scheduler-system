"use client";
import { useCallback, useState } from "react";

const UseTableControls = (data, pageCount) => {
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRowItem, setSelectedRowItem] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCustomFormModalOpen, setIsCustomFormModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState({ id: "" });
  const hasSearchFilter = Boolean(filterValue);

  const pages = Math.ceil((pageCount !== 0 ? pageCount : 0) / rowsPerPage);
  const [page, setPage] = useState(1);


  const onRowsPerPageChange = useCallback(
    (e) => {
      setRowsPerPage(Number(e.target.value));
      setPage(page);
    },
    [page]
  );

  const onSearchChange = useCallback(
    (value) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    },
    [page]
  );

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(page);
  }, [page]);

  const onRowSelected = useCallback((rowItem) => {
    setSelectedRowItem(rowItem);
  }, []);

  const deleteController = useCallback(() => {
    setIsConfirmModalOpen((prev) => !prev);
    setRecordToDelete((prev) => ({ ...prev, id: selectedRowItem.id }));
  }, [selectedRowItem]);

  return {
    filterValue,
    statusFilter,
    rowsPerPage,
    page,
    pages,
    // items,
    hasSearchFilter,
    // filteredItems,
    setPage,
    setStatusFilter,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    totalItems: pageCount,
    // setSelectedKeys,
    isCustomFormModalOpen,
    setIsCustomFormModalOpen,
    onRowSelected,
    selectedRowItem,
    setIsOpen,
    isOpen,
    setIsConfirmModalOpen,
    isConfirmModalOpen,
    deleteController,
    setRecordToDelete,
    recordToDelete,
  };
};

export default UseTableControls;
