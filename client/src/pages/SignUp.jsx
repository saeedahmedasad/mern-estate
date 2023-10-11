import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.username == "" ||
      formData.email == "" ||
      formData.password == ""
    ) {
      setError("Please fill the form");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/auth/signup", formData, {
        contentType: "application/json",
      });
      if (data.success == false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      console.log(data);
      navigate("/sign-in");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <>
      <div className="max-w-lg mx-auto p-2">
        <h1 className="text-3xl text-center font-semibold my-7">Sign up</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            className="border p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            Sign up
          </button>
        </form>
        {error && <p className="text-red-500 mt-3 font-bold">{error}</p>}
        <div className="flex gap-2 mt-5">
          <p>Already have an account?</p>
          <Link to="/sign-in" className="text-blue-700 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
