import {
  Button,
  Chip,
  Spinner,
  Switch,
} from "@heroui/react";
import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { FileEdit } from "lucide-react";
import { RiDeleteBin5Line } from "react-icons/ri";

const statusColorMap = {
  true: "success",
  1: "success",
  false: "danger",
  2: "danger",
};

export const TableRenderCell = ({
  data,
  columnKey,
  setMethod,
  setIsOpen,
  onRowSelected,
}) => {

  const pathname = usePathname();

  const [loading, setloading] = useState(false);
  const renderCell = useCallback((data, columnKey) => {
    const cellValue = data[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2 group">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => {
                setMethod("Edit"), setIsOpen(true), onRowSelected(data);
              }}
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            <div
             
            >
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => {
                  setMethod("Delete"), setIsOpen(false), onRowSelected(data);
                }}
              >
                <RiDeleteBin5Line className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case "jobRun":
        return (
          <div className="relative flex justify-start items-center gap-2 group">
            <Button
              // isIconOnly
              size="sm"
              variant="ghost"
              color="primary"
              onPress={() => {
                setMethod("Run"),  onRowSelected(data);
              }}
            >
              Run Job
            </Button>
          </div>
        );

      default:
        return cellValue?.length > 200
          ? `${cellValue.slice(0, 200)}...`
          : cellValue;
    }
  }, []);

  return renderCell(data, columnKey);
};
