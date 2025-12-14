import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function LimitSettings() {
  const [site, setSite] = useState("");
  const [limit, setLimit] = useState("");
  const [limits, setLimits] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch user limits
  const loadLimits = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/limits/${user._id}`);
      setLimits(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadLimits();
  }, []);

  // Save limit to backend
  const saveLimit = async () => {
    if (!site.trim() || !limit.trim()) {
      alert("Please enter both fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/setLimit", {
        userId: user._id,
        site,
        limit: Number(limit),
      });

      alert("Limit saved!");
      setSite("");
      setLimit("");
      loadLimits();
    } catch (err) {
      console.log(err);
      alert("Failed to save limit");
    }
  };

  // Delete limit
  const deleteLimit = async (siteToDelete) => {
    try {
      await axios.post("http://localhost:5000/deleteLimit", {
        userId: user._id,
        site: siteToDelete,
      });
      loadLimits();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Set Website Time Limits</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Website (e.g. youtube.com)"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="Limit (minutes)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <Button onClick={saveLimit} className="w-full bg-indigo-600 text-white">
            Add Limit
          </Button>
        </div>
      </div>

      {/* Display Limits */}
      <h2 className="text-xl font-semibold mb-3">Your Limits</h2>

      <div className="space-y-3">
        {limits.length === 0 && <p>No limits set yet.</p>}

        {limits.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
          >
            <div>
              <p className="font-medium">{item.site}</p>
              <p className="text-sm text-gray-500">
                {item.limit} minutes per day
              </p>
            </div>

            <Button
              className="bg-red-600 text-white"
              onClick={() => deleteLimit(item.site)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
