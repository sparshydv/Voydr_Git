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

      // ⭐ SAVE INSIDE CHROME EXTENSION
      if (window.chrome?.runtime?.sendMessage) {
  chrome.runtime.sendMessage(
    "gkikdgoeembohkepljdlphmmkhnghfma",   // YOUR EXTENSION ID
    { type: "SAVE_USER", user: res.data.user },
    (res) => console.log("🔥 EXTENSION RESPONSE:", res)
  );
} else {
  console.log("⛔ Cannot send message to extension");
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

        <h2 className="text-center text-3xl font-bold">Sign in to your account</h2>

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
            Sign In
          </Button>

        </form>

      </div>
    </div>
  );
}
