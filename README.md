# Screen Tracker Hack AI

A comprehensive screen time tracking application with AI-powered insights, built with a React frontend, Node.js backend, and a Chrome extension for real-time monitoring.

## Features

- **Real-time Screen Time Tracking**: Monitor time spent on websites and applications.
- **AI-Powered Reports**: Generate insights and recommendations using Groq AI.
- **User Dashboard**: View detailed reports, set limits, and manage profiles.
- **Chrome Extension**: Seamless integration for browser-based tracking.
- **Authentication**: Secure user login and signup with JWT.
- **Data Visualization**: Interactive charts and graphs for usage statistics.
- **Customizable Settings**: Set daily limits and preferences.

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Groq SDK for AI
- bcryptjs for password hashing
- JWT for authentication

### Frontend
- React (with TypeScript)
- Vite for build tool
- Tailwind CSS for styling
- React Router for navigation
- Supabase for additional data management
- Recharts for data visualization

### Extension
- Chrome Extension Manifest V3
- JavaScript for background and popup scripts

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 16 or higher): [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB**: Local installation or a cloud service like MongoDB Atlas
- **Google Chrome** (for the extension)
- **Git** (for cloning the repository)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ayushgarg6498/Voydr_Test1.git
   cd Voydr_Test1
   ```

2. **Backend Setup**:
   ```bash
   cd backEnd
   npm install
   ```
   - Create a `.env` file in the `backEnd` directory with the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     GROQ_API_KEY=your_groq_api_key
     ```
     - **Groq API Key**: Sign up at [Groq Console](https://console.groq.com/) to get a free API key. This is required for AI-powered features like report generation and insights.

3. **Frontend Setup**:
   ```bash
   cd ../frontEnd
   npm install
   ```
   - If needed, configure Supabase credentials in `src/lib/supabase.ts`.

4. **Extension Setup**:
   - No additional installation required for the extension files.

## Running the Project

1. **Start the Backend**:
   ```bash
   cd backEnd
   node server.js
   ```
   The backend will run on `http://localhost:5000`.

2. **Start the Frontend**:
   ```bash
   cd frontEnd
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

3. **Load the Chrome Extension**:
   - Open Google Chrome.
   - Go to `chrome://extensions/`.
   - Enable "Developer mode" (toggle in the top right).
   - Click "Load unpacked" and select the `tabExtesion/screen-time-tracker` folder.
   - The extension will be loaded and appear in your extensions list.

## Usage

- **Access the Application**: Open `http://localhost:5173` in your browser.
- **Sign Up/Login**: Create an account or log in to start tracking.
- **View Dashboard**: Monitor your screen time, view reports, and set limits.
- **Use the Extension**: The extension will automatically track time spent on websites and send data to the backend.
- **AI Insights**: Generate reports with AI recommendations based on your usage patterns.

## API Endpoints

The backend provides the following key endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tracking/data` - Retrieve tracking data
- `POST /api/reports/generate` - Generate AI-powered reports

## Contributing

1. Fork the repository.
2. Create a new branch for your feature.
3. Make your changes and commit them.
4. Push to your fork and submit a pull request.

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues, please open an issue on the GitHub repository.