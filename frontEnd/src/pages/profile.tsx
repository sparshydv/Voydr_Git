import React, { useEffect } from 'react';
import { User, Award, Target, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const navigate = useNavigate();

  // 1️⃣ GET LOGGED-IN USER FROM LOCAL STORAGE
  const user = JSON.parse(localStorage.getItem("user"));

  // 2️⃣ IF NOT LOGGED IN → REDIRECT TO LOGIN
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  // 3️⃣ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const achievements = [
    { title: "Screen Time Master", description: "Reduced screen time by 20% this week", date: "2024-03-15" },
    { title: "Focus Champion", description: "Completed 10 focus sessions", date: "2024-03-14" },
    { title: "Break Time Pro", description: "Maintained regular break schedule for 5 days", date: "2024-03-13" },
  ];

  // SAFETY: If user is still loading
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="ml-6">
              {/* 4️⃣ DYNAMIC USER NAME */}
              <h1 className="text-2xl font-semibold text-gray-900">
                {user.name}
              </h1>

              {/* 5️⃣ DYNAMIC USER EMAIL */}
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* 6️⃣ WORKING LOGOUT BUTTON */}
          <Button variant="outline" className="flex items-center" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            Daily Goals
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Screen Time Limit</span>
                <span>6 hours</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Focus Sessions</span>
                <span>3 of 4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Break Time</span>
                <span>45 minutes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-indigo-600" />
            Recent Achievements
          </h2>

          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="border-l-4 border-indigo-600 pl-4 py-2">
                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
                <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
