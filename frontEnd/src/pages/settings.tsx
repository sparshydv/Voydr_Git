import React, { useEffect, useState } from "react";
import { Bell, Moon, Eye, Shield, Clock, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Settings() {
    const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem("notifications") || "true"));
    const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode") || "false"));
    const [screenTimeLimit, setScreenTimeLimit] = useState(() => JSON.parse(localStorage.getItem("screenTimeLimit") || "6"));
    const [breakInterval, setBreakInterval] = useState(() => JSON.parse(localStorage.getItem("breakInterval") || "30"));

    useEffect(() => {
        // Apply dark mode on page load
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    function toggleDarkMode() {
        setDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem("darkMode", JSON.stringify(newMode));

            if (newMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }

            return newMode;
        });
    }

    function toggleNotifications() {
        setNotifications((prev) => {
            const newNotif = !prev;
            localStorage.setItem("notifications", JSON.stringify(newNotif));
            return newNotif;
        });
    }

    function handleLimitChange(value: number) {
        setScreenTimeLimit(value);
        localStorage.setItem("screenTimeLimit", JSON.stringify(value));
    }

    function handleBreakChange(value: number) {
        setBreakInterval(value);
        localStorage.setItem("breakInterval", JSON.stringify(value));
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your preferences and application settings</p>
            </div>

            {/* Screen Time Limits */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                    Screen Time Limits
                </h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="dailyLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Daily Screen Time Limit (hours)
                        </label>
                        <input
                            type="number"
                            id="dailyLimit"
                            min="1"
                            max="24"
                            value={screenTimeLimit}
                            onChange={(e) => handleLimitChange(Number(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="breakInterval" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Break Reminder Interval (minutes)
                        </label>
                        <input
                            type="number"
                            id="breakInterval"
                            min="5"
                            max="120"
                            step="5"
                            value={breakInterval}
                            onChange={(e) => handleBreakChange(Number(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-indigo-600" />
                    Notifications
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Enable Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for breaks and limits</p>
                    </div>
                    <button
                        onClick={toggleNotifications}
                        className={`${
                            notifications ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                        <span
                            className={`${
                                notifications ? "translate-x-5" : "translate-x-0"
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                    <Moon className="h-5 w-5 mr-2 text-indigo-600" />
                    Appearance
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Dark Mode</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enable dark theme for the application</p>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className={`${
                            darkMode ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                        <span
                            className={`${
                                darkMode ? "translate-x-5" : "translate-x-0"
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
