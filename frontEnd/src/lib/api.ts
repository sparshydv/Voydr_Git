import axios from "axios";

const API_URL = "http://localhost:5000"; // Backend URL

export async function fetchScreenTimeData() {
    try {
        // Get userId from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?._id;
        
        if (!userId) {
            console.error("❌ No user found in localStorage");
            return [];
        }
        
        const response = await axios.get(`${API_URL}/data?userId=${userId}`);
        return response.data; // Returns MongoDB screen time data for this user
    } catch (error) {
        console.error("❌ Error fetching screen time data:", error);
        return [];
    }
}
