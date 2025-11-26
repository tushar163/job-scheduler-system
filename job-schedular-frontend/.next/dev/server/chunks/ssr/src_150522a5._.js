module.exports = [
"[project]/src/service/CommanService.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETEService",
    ()=>DELETEService,
    "GETService",
    ()=>GETService,
    "POSTService",
    ()=>POSTService,
    "PUTService",
    ()=>PUTService
]);
const baseUrl = ("TURBOPACK compile-time value", "http://localhost:4000");
console.log("API Base URL:", baseUrl);
const GETService = async ({ endpoint })=>{
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
};
const POSTService = async (endpoint, data)=>{
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
};
const PUTService = async (endpoint, data)=>{
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
};
const DELETEService = async (endpoint)=>{
    const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
};
}),
"[project]/src/app/(modules)/dashboard/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$CommanService$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/CommanService.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4",
        children: "page"
    }, void 0, false, {
        fileName: "[project]/src/app/(modules)/dashboard/page.jsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = page;
}),
];

//# sourceMappingURL=src_150522a5._.js.map