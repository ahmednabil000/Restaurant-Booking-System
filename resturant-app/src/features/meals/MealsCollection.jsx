import React from "react";
import ShortMealCard from "./ShortMealCard";

const MealsCollection = ({ meals }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center justify-items-center gap-4 sm:gap-6 md:gap-7 px-4 sm:px-6 md:px-8">
      <ShortMealCard
        description={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt sint nisi debitis quaerat et praesentium temporibus vitae asperiores laudantium earum, ut molestias rem, veniam fugiat atque, quo officia. Autem, et?"
        }
      />
      <ShortMealCard
        description={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt sint nisi debitis quaerat et praesentium temporibus."
        }
      />
      <ShortMealCard
        description={"Lorem ipsum dolor sit amet consectetur adipisicing elit."}
      />
      <ShortMealCard
        description={"Lorem ipsum dolor sit amet consectetur adipisicing elit."}
      />
    </div>
  );
};

export default MealsCollection;
