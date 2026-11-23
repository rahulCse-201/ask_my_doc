// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    
    try {
      const res = await api.post(endpoint, { email, password });
      setUser(res.data);
      navigate("/dashboard"); // Go to dashboard on success
    } catch (err) {
      setError(err.response?.data?.error || "Could not connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        <input 
          type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded" required
        />
        <input 
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 mb-6 rounded" required minLength={isLogin ? undefined : 8} maxLength={72} autoComplete={isLogin ? "current-password" : "new-password"}
        />

        {error && <p role="alert" className="text-red-600 text-sm mb-4">{error}</p>}
        
        <button disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white p-2 rounded font-semibold mb-4">
          {submitting ? "Please wait…" : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
