import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import Header from "../Header/Header";

const PostReview = () => {
  const [dealer, setDealer] = useState(null);
  const [review, setReview] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();

  const dealerUrl = `/djangoapp/dealer/${id}`;
  const reviewUrl = "/djangoapp/add_review";
  const carModelsUrl = "/djangoapp/get_cars";

  const getDealer = async () => {
    try {
      const response = await fetch(dealerUrl, {
        method: "GET",
      });

      const result = await response.json();

      if (result.status === 200 && result.dealer) {
        setDealer(result.dealer);
      }
    } catch (error) {
      console.error("Error loading dealer:", error);
    }
  };

  const getCars = async () => {
    try {
      const response = await fetch(carModelsUrl, {
        method: "GET",
      });

      const result = await response.json();

      if (Array.isArray(result.CarModels)) {
        setCarModels(result.CarModels);
      }
    } catch (error) {
      console.error("Error loading car models:", error);
    }
  };

  const postReview = async () => {
    let name =
      sessionStorage.getItem("firstname") +
      " " +
      sessionStorage.getItem("lastname");

    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (
      !selectedCar ||
      review.trim() === "" ||
      date === "" ||
      year === ""
    ) {
      alert("All details are mandatory.");
      return;
    }

    const selectedCarData = JSON.parse(selectedCar);

    const reviewData = {
      name: name,
      dealership: Number(id),
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: selectedCarData.make,
      car_model: selectedCarData.model,
      car_year: Number(year),
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(reviewUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (result.status === 200) {
        alert("Your review has been posted successfully.");
        window.location.href = `/dealer/${id}`;
      } else {
        alert(result.message || "The review could not be posted.");
      }
    } catch (error) {
      console.error("Error posting review:", error);
      alert("An error occurred while posting the review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getDealer();
    getCars();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f9" }}>
      <Header />

      <div
        style={{
          width: "90%",
          maxWidth: "750px",
          margin: "50px auto",
          padding: "35px",
          backgroundColor: "white",
          borderRadius: "14px",
          boxShadow: "0 5px 20px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: "0 0 10px 0",
              color: "#007b83",
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Post a Review
          </h1>

          {dealer ? (
            <>
              <h2
                style={{
                  margin: "0 0 8px 0",
                  color: "#333",
                  fontSize: "24px",
                }}
              >
                {dealer.full_name}
              </h2>

              <p
                style={{
                  margin: "0",
                  color: "#666",
                  lineHeight: "1.5",
                }}
              >
                {dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}
              </p>
            </>
          ) : (
            <p style={{ color: "#777" }}>Loading dealer details...</p>
          )}
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label
            htmlFor="review"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "600",
            }}
          >
            Your review
          </label>

          <textarea
            id="review"
            rows="7"
            value={review}
            placeholder="Describe your experience with this dealership..."
            onChange={(event) => setReview(event.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              border: "1px solid #c7c7c7",
              borderRadius: "8px",
              resize: "vertical",
              fontSize: "16px",
              fontFamily: "inherit",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "22px",
          }}
        >
          <div style={{ flex: "1 1 250px" }}>
            <label
              htmlFor="purchase-date"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              Purchase date
            </label>

            <input
              id="purchase-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #c7c7c7",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ flex: "1 1 250px" }}>
            <label
              htmlFor="car-year"
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#333",
                fontWeight: "600",
              }}
            >
              Car year
            </label>

            <input
              id="car-year"
              type="number"
              min="2015"
              max="2023"
              value={year}
              placeholder="For example: 2023"
              onChange={(event) => setYear(event.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #c7c7c7",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            htmlFor="cars"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "600",
            }}
          >
            Car make and model
          </label>

          <select
            id="cars"
            name="cars"
            value={selectedCar}
            onChange={(event) => setSelectedCar(event.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #c7c7c7",
              borderRadius: "8px",
              backgroundColor: "white",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          >
            <option value="" disabled>
              Choose car make and model
            </option>

            {carModels.map((carModel, index) => (
              <option
                key={`${carModel.CarMake}-${carModel.CarModel}-${index}`}
                value={JSON.stringify({
                  make: carModel.CarMake,
                  model: carModel.CarModel,
                })}
              >
                {carModel.CarMake} {carModel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={postReview}
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "14px 20px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: isSubmitting ? "#8babad" : "darkturquoise",
            color: "#ffffff",
            fontSize: "17px",
            fontWeight: "700",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Posting review..." : "Post Review"}
        </button>
      </div>
    </div>
  );
};

export default PostReview;