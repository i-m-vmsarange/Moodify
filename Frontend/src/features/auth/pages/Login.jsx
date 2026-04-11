import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await handleLogin({
        username,
        password,
      });
      console.log("Login successful:", data);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="mx-auto my-4 px-4 py-4">
      <div
        className="form-container mx-auto my-4 flex flex-col items-center justify-center max-w-100  p-8 rounded-md"
        style={{ backgroundColor: "#232b2b" }}
      >
        <h1 className="text-center mb-5 font-bold text-3xl tracking-wide">
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-4"
        >
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            id="username"
            placeholder="Enter username"
            className="border border-amber-50 rounded-md px-2 py-1"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
            className="border border-amber-50 rounded-md    px-2 py-1"
          />
          <button className="my-1 mb-2 cursor-pointer px-4 py-2 rounded-sm bg-blue-700 font-semibold text-md tracking-wide">
            Submit
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link className="text-blue-700" to={"/register"}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
