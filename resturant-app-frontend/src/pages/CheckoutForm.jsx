// CheckoutForm.js
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();

  const handleCheckout = async () => {
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Premium Plan" },
          unit_amount: 2000, // $20.00 (in cents)
        },
        quantity: 1,
      },
    ];

    const response = await fetch(
      "http://localhost:8080/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      }
    );

    const session = await response.json();

    if (response.ok) {
      window.location.href = session.url;
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>Pay with Stripe</button>
    </div>
  );
};

export default CheckoutForm;
