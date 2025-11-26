import React, { useMemo } from "react";
import {
  Input,
} from "@heroui/react";
import { IoSearch } from "react-icons/io5";


export const TableTopContent = ({
  filterValue,
  statusFilter,
  visibleColumns,
  onRowsPerPageChange,
  onSearchChange,
  onClear,
  setStatusFilter,
  setVisibleColumns,
  headerFields,
  setTriggerData,
}) => {
  return useMemo(() => {
    return (
      <div className="flex flex-col gap-4 w-full sm:w-auto">
        <div className="flex justify-end gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:w-auto"
            placeholder="Search"
            startContent={<IoSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            variant="bordered"
            radius="md"
            classNames={{
              inputWrapper: [
                // "data-[hover=true]:border-primary",
                "group-data-[focus=true]:border-default-400",
                "bg-background",
              ],
            }}
          />
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    onSearchChange,
    onClear,
    setStatusFilter,
    setVisibleColumns,
    onRowsPerPageChange,
    headerFields,
    setTriggerData,
  ]);
};
