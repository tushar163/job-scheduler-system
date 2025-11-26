import { POSTService } from '@/service/CommanService';
import { addToast, Button, Form, Input, Select, SelectItem, Textarea } from '@heroui/react'
import React, { useEffect, useState } from 'react'

function JobsForm({ method, setIsOpen, selectedRowItem }) {
    const [FormData, setFormData] = useState({
        taskName: "",
        priority: "MEDIUM",
        payload: "{\n  \n}",
        status: "PENDING"
    });
    const [loader, setLoader] = useState(false);
    const [jsonError, setJsonError] = useState("");

    const priorityOptions = [
        { value: "HIGH", label: "High" },
        { value: "MEDIUM", label: "Medium" },
        { value: "LOW", label: "Low" }
    ];

    const statusOptions = [
        { value: "PENDING", label: "Pending" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
        { value: "FAILED", label: "Failed" }
    ];

    useEffect(() => {
        if (method === "Edit" && selectedRowItem) {
            setFormData({
                taskName: selectedRowItem.taskName || "",
                priority: selectedRowItem.priority || "MEDIUM",
                payload: typeof selectedRowItem.payload === 'string'
                    ? selectedRowItem.payload
                    : JSON.stringify(selectedRowItem.payload, null, 2),
                status: selectedRowItem.status || "PENDING"
            });
        }
    }, [method, selectedRowItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...FormData, [name]: value });

        // Validate JSON for payload field
        if (name === "payload") {
            try {
                JSON.parse(value);
                setJsonError("");
            } catch (error) {
                setJsonError("Invalid JSON format");
            }
        }
    }

    const handleSelectChange = (name, value) => {
        setFormData({ ...FormData, [name]: value });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        // Validate JSON before submitting
        try {
            JSON.parse(FormData.payload);
        } catch (error) {
            setJsonError("Invalid JSON format. Please fix before submitting.");
            setLoader(false);
            return;
        }

        // Prepare data for API
        const submitData = {
            taskName: FormData.taskName,
            priority: FormData.priority,
            payload: JSON.parse(FormData.payload),
            status: FormData.status
        };

        try {
            const response = await POSTService({
                endpoint: "api/v1/jobs/create-job",
                data: submitData,
            });
            if (response.success) {
                addToast({
                    title: `Job ${method === "Create" ? "created" : "updated"} successfully!`,
                    color: "success",
                    description: response.message,
                })
            }
            setIsOpen(false);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoader(false);
        }
    }

    return (
        <>
            <p className="text-2xl font-semibold mb-4">{method} Job</p>
            <Form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-5">
                <div className="flex flex-col gap-4 w-full">
                    {/* Task Name Field */}
                    <Input
                        isRequired
                        name="taskName"
                        label="Task Name"
                        labelPlacement="outside"
                        placeholder="Enter task name (e.g., Send Welcome Email)"
                        type="text"
                        variant="bordered"
                        color="primary"
                        value={FormData.taskName}
                        onChange={handleChange}
                        onClear={() => setFormData({ ...FormData, taskName: "" })}
                    />

                    {/* Priority Field */}
                    <Select
                        isRequired
                        name="priority"
                        label="Priority"
                        labelPlacement="outside"
                        placeholder="Select priority level"
                        variant="bordered"
                        color="primary"
                        selectedKeys={[FormData.priority]}
                        onChange={(e) => handleSelectChange("priority", e.target.value)}
                    >
                        {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* Status Field (Only show in Edit mode) */}
                    {method === "Edit" && (
                        <Select
                            isRequired
                            name="status"
                            label="Status"
                            labelPlacement="outside"
                            placeholder="Select job status"
                            variant="bordered"
                            isDisabled
                            color="primary"
                            selectedKeys={[FormData.status]}
                            onChange={(e) => handleSelectChange("status", e.target.value)}
                        >
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                    {/* Payload Field (JSON) */}
                    <div className="flex flex-col gap-2">
                        <Textarea
                            isRequired
                            name="payload"
                            label="Payload (JSON)"
                            labelPlacement="outside"
                            placeholder='{"email": "user@example.com", "template": "welcome"}'
                            variant="bordered"
                            color="primary"
                            minRows={6}
                            value={FormData.payload}
                            onChange={handleChange}
                            isInvalid={!!jsonError}
                            errorMessage={jsonError}
                            classNames={{
                                input: "font-mono text-sm"
                            }}
                        />
                        <p className="text-xs text-gray-500">
                            Enter valid JSON format. Example: {`{"key": "value", "number": 123}`}
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end items-center gap-3">
                    <Button
                        color="default"
                        variant="flat"
                        onPress={() => setIsOpen(false)}
                        disabled={loader}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        isLoading={loader}
                        disabled={loader || !!jsonError}
                        className="text-white"
                    >
                        {method === "Create" ? "Create" : "Update"} Job
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default JobsForm