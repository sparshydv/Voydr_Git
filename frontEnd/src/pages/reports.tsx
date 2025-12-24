import React, { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchScreenTimeData } from "@/lib/api"; // Import API function
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatSiteName } from "@/lib/utils";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export function Reports() {
    const [screenTimeData, setScreenTimeData] = useState([]);
    const [dailyUsage, setDailyUsage] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [topApps, setTopApps] = useState([]);
    const [timeRange, setTimeRange] = useState("week");

    useEffect(() => {
        fetchScreenTime();
    }, []);

    async function fetchScreenTime() {
        const data = await fetchScreenTimeData();
        
        // Aggregate data by site first (combine duplicates)
        const aggregatedBySite: Record<string, number> = {};
        data.forEach((entry: any) => {
            aggregatedBySite[entry.site] = (aggregatedBySite[entry.site] || 0) + entry.timeSpent;
        });
        
        // Format data for daily usage chart
        const dailyBreakdown = data.reduce((acc: any, entry: any) => {
            const date = format(new Date(entry.timestamp), "EEE"); // Format: Mon, Tue, etc.
            acc[date] = (acc[date] || 0) + entry.timeSpent;
            return acc;
        }, {});

        setDailyUsage(Object.entries(dailyBreakdown).map(([day, hours]) => ({ name: day, hours: Math.round(hours / 3600) }))); // Convert seconds to hours

        // Format data for category distribution
        const categoryBreakdown = {
            Work: 0,
            Entertainment: 0,
            "Social Media": 0,
            Other: 0,
        };

        Object.entries(aggregatedBySite).forEach(([site, timeSpent]) => {
            if (site.includes("github") || site.includes("figma")) categoryBreakdown.Work += timeSpent;
            else if (site.includes("youtube") || site.includes("netflix")) categoryBreakdown.Entertainment += timeSpent;
            else if (site.includes("facebook") || site.includes("instagram")) categoryBreakdown["Social Media"] += timeSpent;
            else categoryBreakdown.Other += timeSpent;
        });

        setCategoryData(
            Object.entries(categoryBreakdown).map(([name, value]) => {
                const total = Object.values(aggregatedBySite).reduce((acc, v) => acc + v, 0);
                return { name, value: Math.round((value / total) * 100) };
            })
        );

        // Format data for most used applications (using aggregated data)
        const sortedApps = Object.entries(aggregatedBySite)
            .map(([site, timeSpent]) => ({ site, timeSpent }))
            .sort((a, b) => b.timeSpent - a.timeSpent)
            .slice(0, 5);
            
        setTopApps(sortedApps.map((entry) => ({
            name: formatSiteName(entry.site),
            time: `${Math.floor(entry.timeSpent / 3600)}h ${Math.floor((entry.timeSpent % 3600) / 60)}m`,
            category: categoryBreakdown.Work > entry.timeSpent ? "Work" : categoryBreakdown.Entertainment > entry.timeSpent ? "Entertainment" : "Other"
        })));

        setScreenTimeData(data);
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Usage Reports</h1>
                    <p className="text-gray-500">Track your screen time patterns and app usage</p>
                </div>
                <div className="flex gap-4">
                    <Button variant={timeRange === "week" ? "default" : "outline"} onClick={() => setTimeRange("week")}>
                        Week
                    </Button>
                    <Button variant={timeRange === "month" ? "default" : "outline"} onClick={() => setTimeRange("month")}>
                        Month
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={fetchScreenTime}>
                        Sync Data
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Daily Usage Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Usage</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyUsage}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={120} fill="#8884d8" dataKey="value">
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Most Used Apps */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Used Applications</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topApps.map((app, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
