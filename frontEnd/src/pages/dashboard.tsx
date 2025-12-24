import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchScreenTimeData } from "@/lib/api"; // Import API function
import { Button } from "@/components/ui/button";
import { formatSiteName } from "@/lib/utils";

export function Dashboard() {
    const [screenTimeData, setScreenTimeData] = useState([]);

    useEffect(() => {
        fetchScreenTime(); // Fetch data when page loads
    }, []);

    async function fetchScreenTime() {
        const data = await fetchScreenTimeData();
        
        // Aggregate data by site (combine duplicates)
        const aggregated: Record<string, number> = {};
        
        data.forEach((entry: any) => {
            const siteName = formatSiteName(entry.site);
            aggregated[siteName] = (aggregated[siteName] || 0) + entry.timeSpent;
        });
        
        // Convert to array format for chart
        const formattedData = Object.entries(aggregated).map(([name, totalTime]) => ({
            name,
            screenTime: Math.floor(totalTime / 60), // Convert seconds to minutes
        }));
        
        setScreenTimeData(formattedData);
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Welcome back, User!</h1>
                <Button onClick={fetchScreenTime}>Sync Data</Button>
            </div>

            {/* Screen Time Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Screen Time by Website</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={screenTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="screenTime" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
