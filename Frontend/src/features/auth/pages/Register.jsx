import React, { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  async function submitHandler(e) {
    e.preventDefault();

    try {
      const response = await handleRegister({ username, email, password });
      console.log("User registered successfully:", response);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  return (
    <main className="mx-auto my-4 px-4 py-4">
      <div
        className="form-container mx-auto my-4 flex flex-col items-center justify-center max-w-100  p-8 rounded-md"
        style={{ backgroundColor: "#232b2b" }}
      >
        <h1 className="text-center mb-5 font-bold text-3xl tracking-wide">
          Register
        </h1>
        <form
          onSubmit={submitHandler}
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
              setEmail(e.target.value);
            }}
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
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
          <button className="my-1 mb-2 cursor-pointer px-4 py-2 rounded-sm bg-pink-700 font-semibold text-md tracking-wide">
            Submit
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link className="text-pink-700" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
