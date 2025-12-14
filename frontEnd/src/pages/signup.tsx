import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(res.data.message);
      }

    } catch (err) {
      alert("Signup failed. Try again.");
      console.log(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              already have one?
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm space-y-4">

            {/* Full Name */}
            <div>
              <div className="relative">
                <User className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md"
                  placeholder="Email address"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <div>
            <Button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#4F46E5",
                color: "#FFFFFF",
              }}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
