import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getAllListings = async () => {
      try {
        setError(null);
        const { data } = await axios.get("/api/listing/get");
        if (data.success === false) setError("Something Went Wrong");
        console.log(data.listings);
        setListings(data.listings);
      } catch (error) {
        console.log(error);
        setError("Something Went Wrong");
      }
    };
    getAllListings();
  }, []);
  return (
    <div>
      <div className="w-full h-screen  p-3 flex flex-col items-center justify-center gap-5">
        <h1 className="text-5xl font-semibold text-center">
          <span className="text-red-400">Welcome!</span> to the{" "}
          <span className="text-slate-500">Home of E-State</span>
        </h1>
        <p className="text-lg">Where you Sell your state😁</p>
      </div>
      <div className="flex gap-3 p-4 flex-wrap justify-center items-center">
        {error && (
          <p className="mt-3 text-4xl text-center font-semibold ">{error}</p>
        )}
        {error === null &&
          listings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="max-w-xs w-full h-[300px] rounded-lg bg-slate-300 p-3"
              >
                <div className="w-full  h-[150px] p-2 bg-slate-200 rounded-md flex items-center justify-center overflow-hidden">
                  <img src={listing.imageUrls[0]} alt="" />
                </div>
                <p
                  className="text-2xl w-full truncate py-2 font-semibold "
                  title={listing.name}
                >
                  {listing.name}
                </p>
                <p className="w-full truncate">{listing.description}</p>
                <Link to={`/listing/${listing._id}`}>
                  <button className="w-full p-2 bg-slate-200 rounded-lg mt-3">
                    Get Details
                  </button>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
