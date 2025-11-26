"use client";
import Header from '@/components/Header/Header';
import Sidebar from '@/components/SideBar/SideBar';
import React, { useState } from 'react'

function layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    onCreateJob={() => setShowCreateModal(true)}
                />

                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default layout