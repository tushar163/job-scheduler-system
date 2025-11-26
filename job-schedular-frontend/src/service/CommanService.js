const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



export const GETService = async ({ endpoint }) => {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};


export const POSTService = async ({ endpoint, data }) => {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // If server returns non-2xx status
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "API Request Failed");
        }

        return await response.json();

    } catch (error) {
        console.error("POSTService Error:", error.message);
        throw error;
    }
};



export const PUTService = async ({ endpoint, data }) => {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};



export const DELETEService = async ({ endpoint }) => {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};
