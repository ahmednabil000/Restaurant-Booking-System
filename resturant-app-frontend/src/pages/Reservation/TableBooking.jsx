import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Container from "../../ui/Container";
import ReservationForm from "./ReservationForm";
import Seperator from "../../ui/Seperator";

// Initialize Stripe - Replace with your publishable key
const stripePromise = loadStripe(
  "pk_test_51QRfVzEtpdDmDQb0o1LjYlnJuZB1P41vNnMuqU0iRhJqnFd6jEeYDsF82PEPuL4zzTe6TUKp64O5djk3gjeCuqSN004iWVQ9qh"
);

const TableBooking = () => {
  return (
    <Container>
      <Seperator />
      <p className="text-black font-bold text-5xl text-center mb-10">
        احجز طاولتك الان
      </p>
      <p className="text-xl text-center">
        خطوات بسيطة لتجربة طعام لا تُنسى في مطعمنا الراقي.
      </p>
      <Seperator />
      <Elements stripe={stripePromise}>
        <ReservationForm />
      </Elements>
      <Seperator />
    </Container>
  );
};

export default TableBooking;
