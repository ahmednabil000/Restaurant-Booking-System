import React from "react";
import Container from "../../ui/Container";
import ReservationForm from "./ReservationForm";
import Seperator from "../../ui/Seperator";
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
      <ReservationForm />
      <Seperator />
    </Container>
  );
};

export default TableBooking;
