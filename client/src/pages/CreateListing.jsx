import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import axios from "axios";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const inputFilesRef = useRef(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("0");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [furnished, setFurnished] = useState(false);
  const [parking, setParking] = useState(false);
  const [type, setType] = useState("");
  const [offer, setOffer] = useState("");
  const [rent, setRent] = useState(true);
  const [sale, setSale] = useState(false);

  const [formData, setFormData] = useState({
    discountPrice,
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/listing/create", formData);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type: rent ? "rent" : "sale",
      offer: offer ? "offer" : "none",
      userId: currentUser._id,
    });
  }, [
    name,
    description,
    address,
    regularPrice,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer,
    rent,
    sale,
  ]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length < 7) {
      const promises = [];
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        promises.push(uploadImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: urls,
          });
          setImageUploadError(null);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setImageUploadError("Image upload failed (2 mb max per image)");
          setLoading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg resize-none"
            id="description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            required
          />
          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            id="address"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="sale"
                id="sale"
                className="w-5"
                checked={sale}
                onChange={() => {
                  setSale(!sale);
                  setRent(!rent);
                }}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="rent"
                id="rent"
                className="w-5"
                onChange={() => {
                  setSale(!sale);
                  setRent(!rent);
                }}
                checked={rent}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5"
                checked={parking}
                onChange={() => {
                  setParking(!parking);
                }}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="Furnished"
                id="furnished"
                className="w-5"
                checked={furnished}
                onChange={() => {
                  setFurnished(!furnished);
                }}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className="w-5"
                checked={offer}
                onChange={() => {
                  setOffer(!offer);
                }}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={"1"}
                max={"10"}
                onChange={(e) => {
                  setBedrooms(e.target.value);
                }}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={"1"}
                max={"10"}
                onChange={(e) => {
                  setBathrooms(e.target.value);
                }}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={"1"}
                max={"10"}
                onChange={(e) => {
                  setRegularPrice(e.target.value);
                }}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span className="flex items-center gap-3">
                Regular Price <span className="text-xs">$/Month</span>
              </span>
            </div>
            {offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  onChange={(e) => {
                    setDiscountPrice(e.target.value);
                  }}
                  min={"1"}
                  max={"10"}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <span className="flex items-center gap-3">
                  Discount Price <span className="text-xs">$/Month</span>
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1  flex-col gap-3">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-700 ml-2">
              first image will be the cover (max 6)
            </span>{" "}
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              ref={inputFilesRef}
              className="p-3 border border-gray-300 rounded-lg w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="mt-3 text-red-700">{imageUploadError}</p>
          )}
          {formData?.imageUrls?.map((url) => {
            return (
              <div key={url}>
                <img
                  src={url}
                  alt="listing image"
                  className="w-40 h-40 object-cover rounded-lg"
                />
              </div>
            );
          })}
          {formData.imageUrls?.length > 0 && (
            <button
              type="button"
              onClick={() => {
                inputFilesRef.current.value = null;
                setFormData({ ...formData, imageUrls: [] });
              }}
              className="w-full p-3 bg-red-700 text-center rounded-lg text-white"
            >
              Delete All
            </button>
          )}
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 uppercase rounded-lg w-full hover:opacity-95 disabled:opacity-80"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
