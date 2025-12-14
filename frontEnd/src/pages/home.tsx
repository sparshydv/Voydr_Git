import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, PieChart, Focus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Home() {
  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Real-Time Tracking',
      description: 'Monitor your screen time as it happens with accurate, real-time tracking.',
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: 'Detailed Reports',
      description: 'Get insights into your digital habits with comprehensive usage reports.',
    },
    {
      icon: <Focus className="h-6 w-6" />,
      title: 'Focus Mode',
      description: 'Boost productivity by blocking distracting apps and websites.',
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Smart Notifications',
      description: 'Receive timely alerts when you exceed your screen time limits.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Track Your Screen Time,</span>
                  <span className="block text-indigo-600">Improve Productivity</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Take control of your digital life with our comprehensive screen time tracking solution. Monitor your habits, set healthy limits, and boost your productivity.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button asChild size="lg">
                      <Link to="/login">Start Tracking</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
            alt="Person working on computer"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to stay focused
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-indigo-600">{feature.icon}</div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}