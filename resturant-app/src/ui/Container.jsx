import React from "react";

const Container = ({ children }) => {
  return (
    <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20">{children}</div>
  );
};

export default Container;
