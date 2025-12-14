import axios from "axios";

const API_URL = "http://localhost:5000"; // Backend URL

export async function fetchScreenTimeData() {
    try {
        const response = await axios.get(`${API_URL}/data`);
        return response.data; // Returns MongoDB screen time data
    } catch (error) {
        console.error("❌ Error fetching screen time data:", error);
        return [];
    }
}
