const prisma = require('../config/prismaClient');
const axios = require('axios');

module.exports = {
    // Create a new job
    createJob: async (req, res) => {
        const { taskName, payload, priority } = req.body;
        try {
            if (!taskName || !payload || !priority) {
                return res.status(400).json({ error: "Missing required fields", status: res.statusCode, success: false });
            }
            let insertData = {
                taskName,
                payload,
                priority,
            };
            const newJob = await prisma.job.upsert({
                where: { id: req.body.id || "" },
                update: insertData,
                create: insertData,
            });
            res.status(200).json({ success: true, data: newJob, message: "Job created successfully", status: res.statusCode });
        } catch (error) {
            res.status(500).json({ error: "Failed to create job" });
        }
    },
    getJobs: async (req, res) => {
        try {
            let { limit = 10, page = 1, search, ...filter } = req.query;

            limit = parseInt(limit);
            page = parseInt(page);

            const skip = (page - 1) * limit;

            // Search condition (optional)
            let whereClause = {};
            if (search) {
                whereClause = {
                    OR: [
                        { taskName: { contains: search} },
                    ]
                };
            }
            if (filter.status) {
                whereClause.status = filter.status;
            }

            // Count total records
            const totalRecords = await prisma.job.count({ where: whereClause });

            // Fetch paginated data
            const jobs = await prisma.job.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" }, // optional
            });

            res.status(200).json({
                success: true,
                data: jobs,
                totalRecords,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch jobs" });
        }
    },
    deleteJob: async (req, res) => {
        const { id } = req.query;
        try {
            await prisma.webhookLog.deleteMany({
                where: { jobId: id },
            })
            const deletedJob = await prisma.job.delete({
                where: { id: id },
            });

            res.status(200).json({ success: true, data: deletedJob, message: "Job deleted successfully", status: res.statusCode });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete job" });
        }
    },
    runJob: async (req, res) => {
        const { jobId } = req.params;

        try {
            const job = await prisma.job.findUnique({
                where: { id: jobId }
            });

            if (!job) {
                return res.status(404).json({ success: false, message: "Job not found" });
            }

            if (job.status === "IN_PROGRESS") {
                return res.status(400).json({ success: false, message: "Job is already running" });
            }

            if (job.status === "COMPLETED") {
                return res.status(400).json({ success: false, message: "Job is already completed" });
            }
            await prisma.job.update({
                where: { id: jobId },
                data: { status: "IN_PROGRESS" }
            });

            // Respond immediately
            res.status(200).json({
                success: true,
                message: "Job started",
                status: "IN_PROGRESS"
            });
            setTimeout(async () => {
                try {

                    const completedJob = await prisma.job.update({
                        where: { id: jobId },
                        data: {
                            status: "COMPLETED",
                        }
                    });

                    const webhookBody = {
                        jobId: completedJob.id,
                        taskName: completedJob.taskName,
                        priority: completedJob.priority,
                        payload: completedJob.payload,
                        completedAt: completedJob.completedAt
                    };

                    const webhookURL = process.env.WEBHOOK_URL;

                    let responseStatus = null;
                    let responseBody = null;
                    try {
                        const webhookResponse = await axios.post(webhookURL, webhookBody, {
                            timeout: 5000
                        });

                        responseStatus = webhookResponse.status;
                        responseBody = webhookResponse.data;

                        console.log("Webhook sent:", webhookResponse.status);
                    } catch (err) {
                        responseStatus = err.response?.status || 500;
                        responseBody = { error: err.message };

                        console.error("Webhook failed:", err.message);
                    }

                    await prisma.webhookLog.create({
                        data: {
                            jobId: completedJob.id,
                            requestBody: webhookBody,
                            responseStatus,
                            responseBody,
                            sentAt: new Date()
                        }
                    });

                } catch (err) {
                    console.error("Background job error:", err);
                }
            }, 3000);

        } catch (error) {
            console.error("Run Job Error:", error);
            res.status(500).json({
                success: false,
                error: "Failed to run job"
            });
        }
    },
    getLogs: async (req, res) => {
        try {
            const logs = await prisma.webhookLog.findMany({
                orderBy: { sentAt: "desc" },
            });
            res.status(200).json({ success: true, data: logs, status: res.statusCode, message: "Logs fetched successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch logs" });
        }
    }
};