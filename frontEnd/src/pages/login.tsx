import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }

      const user = res.data.user;

      // Save inside React app
      localStorage.setItem("user", JSON.stringify(user));
      console.log("React saved user:", user);

      // Trigger update for header
      window.dispatchEvent(new Event("userLoggedIn"));

      // ⭐ SAVE INSIDE CHROME EXTENSION (using bridge)
      try {
        window.postMessage({
          type: "SAVE_USER_TO_EXTENSION",
          user: res.data.user
        }, "*");
        console.log("📤 Sent user to extension via postMessage");
      } catch (extensionErr) {
        console.warn("⚠️ Could not send to extension:", extensionErr);
      }


      alert("Login successful!");
      navigate("/dashboard");

    } catch (err) {
      alert("Login failed.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center">
          <h2 className="text-3xl font-bold">Log In to your account</h2>
          <p className="text-gray-600 text-sm mt-2">you already exist in our database</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border p-2 rounded w-full"
              placeholder="Email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 border p-2 rounded w-full"
              placeholder="Password"
            />
          </div>

          <Button
            type="submit"
            style={{ width: "100%", background: "#4F46E5", color: "white" }}
          >
            Login
          </Button>

        </form>

      </div>
    </div>
  );
}
