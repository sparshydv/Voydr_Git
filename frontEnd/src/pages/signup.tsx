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

  const handleSignup = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        const user = res.data.user;

        // ✅ SAVE USER FOR WEBSITE
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ SEND USER TO EXTENSION (non-blocking)
        try {
          if (window.chrome?.runtime?.sendMessage) {
            chrome.runtime.sendMessage(
              "ppkjcndbknpjelfhemlengekmbaacoah",
              { type: "SAVE_USER", user },
              () => console.log("🟢 User sent to extension after signup")
            );
          }
        } catch (extensionErr) {
          console.warn("⚠️ Could not send to extension:", extensionErr);
        }

        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert("Signup failed. Try again.");
      console.log(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-400" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="pl-10 w-full border p-2 rounded"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="pl-10 w-full border p-2 rounded"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-10 w-full border p-2 rounded"
            />
          </div>

          <Button type="submit" style={{ width: "100%", background: "#4F46E5", color: "white" }}>
            Sign Up
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
