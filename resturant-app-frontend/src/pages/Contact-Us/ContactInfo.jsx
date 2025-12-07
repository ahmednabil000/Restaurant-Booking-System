import SocialIcons from "./SocialIcons";
import { useRestaurantQuery } from "../../hooks/useRestaurant";

const ContactInfo = () => {
  const { data: restaurantData } = useRestaurantQuery();
  const restaurant = restaurantData?.success ? restaurantData.data : null;

  return (
    <div className="flex flex-col justify-end">
      {/* Social Media */}
      <p className="text-lg text-gray-700 mb-3">
        تابعنا على وسائل التواصل الاجتماعي
      </p>
      <SocialIcons size={24} restaurantData={restaurant} />
    </div>
  );
};

export default ContactInfo;
