import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFail,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log(user);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.email == "" || formData.password == "") {
      return;
    }
    // sign in process started
    dispatch(signInStart());
    try {
      const { data } = await axios.post("/api/auth/signin", formData);
      if (data.success == false) {
        dispatch(signInFail(data.message));
        return;
      }
      console.log(data);
      navigate("/");
      dispatch(signInSuccess(data));
    } catch (error) {
      dispatch(signInFail(error.response.data.message));
    }
  };
  return (
    <>
      <div className="max-w-lg mx-auto p-2">
        <h1 className="text-3xl text-center font-semibold my-7">Sign in</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
            disabled={user.loading}
            className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            Sign in
          </button>
          <OAuth />
        </form>
        {user.error && (
          <p className="text-red-500 mt-3 font-bold">{user.error}</p>
        )}
        <div className="flex gap-2 mt-5">
          <p>Do not have an account?</p>
          <Link to="/sign-up" className="text-blue-700 font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignIn;
