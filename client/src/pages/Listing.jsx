import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { FaBacon, FaBath, FaBed, FaParking } from "react-icons/fa";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { id } = useParams();
  const [listing, setListing] = useState({});
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const getListing = async () => {
      try {
        setError(null);
        const { data } = await axios.post(`/api/listing/get/${id}`);
        if (data.success === false) setError("Something Went Wrong");
        setListing(data.listing);
      } catch (error) {
        console.log(error);
        setError("Something Went Wrong");
      }
    };
    getListing();
  }, []);
  console.log(listing);
  return (
    <>
      <div>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {listing?.imageUrls?.map((url) => {
            return (
              <SwiperSlide key={url}>
                <div className="h-[550px] overflow-hidden">
                  <img src={url} className=" object-cover" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {error && (
          <p className="mt-3 text-4xl text-center font-semibold ">{error}</p>
        )}
        {error === null && (
          <div className="w-full max-w-5xl mx-auto p-2">
            <h1 className="py-5 text-2xl font-semibold ">
              {listing?.name} for{" "}
              <span className="font-bold">{listing?.regularPrice}$</span>
            </h1>
            <p className="flex items-center gap-2 font-semibold text-slate-800">
              <MdLocationPin color="green" /> {listing?.address}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <button className="cursor-default py-1 w-full max-w-[200px] bg-red-950 text-white rounded-lg">
                {listing?.type === "rent" ? "For Rent" : "For Sale"}
              </button>
              <button className="cursor-default py-1 w-full max-w-[200px] bg-green-950 text-white rounded-lg">
                {listing?.offer === "offer"
                  ? listing?.regularPrice -
                    listing?.discountPrice +
                    "$ Discount"
                  : "No Discount"}
              </button>
            </div>
            <p className="mt-3">
              <span className="font-semibold">Description - </span>{" "}
              {listing?.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-2 text-green-950">
                <FaBed />
                {listing?.bedrooms > 1
                  ? `${listing?.bedrooms} Beds`
                  : `${listing?.bedrooms} Bed`}
              </div>
              <div className="flex items-center gap-2 text-green-950">
                <FaBath />
                {listing?.bedrooms > 1
                  ? `${listing?.bathrooms} Baths`
                  : `${listing?.bathrooms} Bath`}
              </div>
              <div className="flex items-center gap-2 text-green-950">
                <FaParking />
                {listing?.parking ? `Parking` : `No parking`}
              </div>
              <div className="flex items-center gap-2 text-green-950">
                <FaBacon />
                {listing?.furnished ? `Furnished` : `Not furnished`}
              </div>
            </div>
            <button className="w-full bg-red-800 text-white p-2 rounded-full mt-3 cursor-default">
              {listing?.userId === currentUser?._id
                ? "You are Author of this Post"
                : null}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Listing;
