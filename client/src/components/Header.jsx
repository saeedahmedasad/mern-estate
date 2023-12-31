import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link
          to={"/"}
          className="font-bold text-sm sm:text-xl flex flex-wrap items-center"
        >
          <span className="text-slate-500">Saeed</span>
          <span className="text-slate-700">Estate</span>
        </Link>
        {/* <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form> */}
        <ul className="flex gap-4">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-500 hover:text-slate-900 transition-all duration-200">
              Home
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <li className="text-slate-500 hover:text-slate-900 transition-all duration-200">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
