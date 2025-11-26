"use client";
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import CustomTable from '@/components/CustomTable/CustomTable';
import { TableTopContent } from '@/components/CustomTable/TableTopContent';
import FormModal from '@/components/FormModal/FormModal';
import UseTableControls from '@/hooks/useTableControls';
import { DELETEService, GETService, POSTService } from '@/service/CommanService';
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react';
import React, { useEffect, useState } from 'react'
import JobsForm from './JobsForm';

function page() {
  const [method, setMethod] = useState("Create");
  const [jobs, setJobs] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterCondition, setfilterCondition] = useState({});
  const {
    page,
    pages,
    setPage,
    rowsPerPage,
    onRowsPerPageChange,
    totalItems,
    onClear,
    isOpen,
    setIsOpen,
    onRowSelected,
    selectedRowItem,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    deleteController,
    recordToDelete,
    setRecordToDelete,
    filterValue,
    onSearchChange,
  } = UseTableControls(jobs, totalRecords);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const queryParams = new URLSearchParams(filterCondition).toString();
        const response = await GETService({ endpoint: `api/v1/jobs/get-jobs?page=${page}&limit=${rowsPerPage}&search=${filterValue}&${queryParams}` });
        setJobs(response.data);
        setTotalRecords(response.totalRecords);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, [method, isOpen, isConfirmModalOpen, page, rowsPerPage, filterValue, selectedRowItem, recordToDelete, setRecordToDelete, filterCondition]);
  const rows = jobs?.map((job) => ({
    id: job.id,
    taskName: job.taskName,
    priority: job.priority,
    status: job.status,
    payload: job.payload,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,


  }));
  const HeaderColumns = [
    { name: "Task Name", uid: "taskName" },
    { name: "Priority", uid: "priority" },
    { name: "Status", uid: "status" },
    { name: "Created At", uid: "createdAt" },
    { name: "Updated At", uid: "updatedAt" },
    { name: "Run Job", uid: "jobRun" },
    { name: "Actions", uid: "actions" },
  ]
  useEffect(() => {
    if (method === "Delete" && selectedRowItem !== null) {
      deleteController();
    }
    if (method === "Run" && selectedRowItem !== null) {
      const runJob = async () => {
        try {
          const response = await POSTService({ endpoint: `api/v1/jobs/run-job/${selectedRowItem.id}` });
          if (response.success) {
            onRowSelected(null);
            setMethod("Create");
          }
        } catch (error) {
          console.error('Error running job:', error);
        }
      };
      runJob();
    }
  }, [method, selectedRowItem,]);

  const onDeleteConfirm = async (confirmData) => {
    if (confirmData.value) {
      try {
        const response = await DELETEService({ endpoint: `api/v1/jobs/delete-job?id=${selectedRowItem.id}` });
        if (response.success) {
          onRowSelected(null);
          setRecordToDelete({ id: "" });
          setIsConfirmModalOpen((prev) => !prev);
          setMethod("Create");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };
  const Status = [
    { label: "Pending", value: "PENDING" },
    { label: "In-Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Failed", value: "FAILED" },
  ];
  const handleParametreChange = (e) => {
    const { name, value } = e.target;
    setfilterCondition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <p className="text-lg font-semibold">Job Scheduler</p>
      {/* <div className="flex flex-row justify-between items-center gap-5"> */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-5 items-stretch">
        <div className="flex min-w-[200px]">
          <TableTopContent
            filterValue={filterValue}
            onClear={onClear}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPage={rowsPerPage}
            totalItems={totalItems}
            onSearchChange={onSearchChange}
          />
        </div>
        <Autocomplete
          // label="Order Status"
          labelPlacement="outside"
          name="status"
          placeholder="Select Status"
          variant="bordered"
          size="md"
          className="max-w-[275px]"
          defaultItems={Status}
          onSelectionChange={(e) => handleParametreChange({ target: { name: "status", value: e } })}
          onClear={() => setfilterCondition((prev) => {
            delete prev.status
            return {
              ...prev
            }
          })}
        >
          {(item) => (
            <AutocompleteItem key={item.value}>
              {item.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Button
          onPress={() => {
            setIsOpen(true), setMethod("Create");
          }}
          className="w-full sm:w-auto text-white"
          color="primary"
        >
          Add Job
        </Button>
      </div>
      {/* </div> */}
      {jobs && (
        <CustomTable
          page={page}
          pages={pages}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          totalItems={totalItems}
          headerColumns={HeaderColumns}
          items={rows}
          setMethod={setMethod}
          setIsOpen={setIsOpen}
          onRowSelected={onRowSelected}
        />
      )}
      {isOpen && (
        <FormModal
          setMethod={setMethod}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onRowSelected={onRowSelected}
        >
          <JobsForm
            method={method}
            setIsOpen={setIsOpen}
            selectedRowItem={selectedRowItem}
          />

        </FormModal>
      )}
      <ConfirmationModal
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        setMethod={setMethod}
        onDeleteConfirm={onDeleteConfirm}
        onRowSelected={onRowSelected}
      />
    </div>
  )
}

export default page