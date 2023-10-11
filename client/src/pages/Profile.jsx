import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { signInSuccess, signout } from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showListing, setShowListing] = useState(false);
  const [listings, setlistings] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFilePerc(0);
    setFileUploadError(null);
    setFile(undefined);
    setError(null);
    setSuccess(null);
    try {
      const { data } = await axios.post(
        `/api/user/update/${currentUser._id}`,
        formData
      );
      dispatch(signInSuccess(data));
      setSuccess("Profile updated successfully");
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/user/delete/${currentUser._id}`);
      dispatch(signout());
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };
  const handleSignout = async () => {
    try {
      await axios.get(`/api/auth/signout`);
      dispatch(signout());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (file) {
      setFileUploadError(null);
      if (file.size < 2 * 1024 * 1024) {
        handleUploadFile(file);
      } else {
        console.log("SIZE ERROR");
        console.log(file.size);
        setFileUploadError("Error Uploading File (Must be less than 2mb)");
      }
    }
  }, [file]);
  const handleUploadFile = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError("Error Uploading File (Must be less than 2mb)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleShowListing = async () => {
    setShowListing(!showListing);
    try {
      const { data } = await axios.get(`/api/user/listings/${currentUser._id}`);
      if (data.success == false) {
        setlistings([]);
        return;
      } else {
        setlistings(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteListing = async (id) => {
    try {
      const { data } = await axios.post(`/api/listing/delete/${id}`);
      if (data.success == false) return;
      setlistings(listings.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <img
          onClick={() => {
            fileRef.current?.click();
          }}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
        />
        <p className="px-2 text-xs text-slate-400">
          last update at {new Date(currentUser.updatedAt).toLocaleString()}
        </p>
        <p className="text-red-700 text-center">
          <span>{fileUploadError && fileUploadError}</span>
          <span className="text-green-700 ">
            {filePerc > 0 && filePerc < 100 && `uploading file ${filePerc}%...`}
          </span>
          <span className="text-green-700">
            {filePerc === 100 && fileUploadError === null && "file uploaded"}
          </span>
        </p>
        <input
          type="username"
          defaultValue={currentUser.username}
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
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
          disabled={filePerc > 0 && filePerc < 100 ? true : false}
          className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          update
        </button>
        <Link
          className="bg-green-700 rounded-lg text-white p-3 text-center uppercase hover:opacity-95 disabled:opacity-80"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <p className="text-green-700 mt-2">{success && success}</p>
      <p className="text-red-700 mt-2">{error && error}</p>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={() => {
            handleDelete();
          }}
        >
          Delete account
        </span>
        <span
          className="text-red-700 cursor-pointer"
          onClick={() => {
            handleSignout();
          }}
        >
          Sign out
        </span>
      </div>
      <button
        onClick={handleShowListing}
        className="text-green-700 text-center w-full mt-4"
      >
        Show Listings
      </button>
      {showListing && (
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-center text-3xl mt-5 font-bold">Your Listings</h1>
          {listings?.map((listing) => {
            return (
              <div
                key={listing._id}
                className="flex w-full justify-between items-center gap-2 border p-3 rounded-lg"
              >
                <img
                  src={listing.imageUrls[0]}
                  className="w-24 h-24 rounded object-cover"
                />
                <Link
                  to={`/listing/${listing._id}`}
                  className="text-slate-700 font-semibold hover:font-bold cursor-pointer truncate flex-1"
                >
                  {listing.name}
                </Link>
                <button
                  onClick={() => {
                    handleDeleteListing(listing._id);
                  }}
                  className="text-red-700 p-3 border border-red-700 rounded-lg  text-center"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
