import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SocialIcons = ({ size = 24, className = "", restaurantData = null }) => {
  // Get social media URLs from restaurant data
  const facebookUrl = restaurantData?.facebookUrl;
  const instagramUrl = restaurantData?.instgramUrl; // Note: API has typo in field name
  const xUrl = restaurantData?.xUrl;

  // Only render if at least one social media URL exists
  if (!facebookUrl && !instagramUrl && !xUrl) {
    return null;
  }

  return (
    <div
      className={`flex justify-center sm:justify-end gap-4 sm:gap-6 md:gap-8 ${className}`}
    >
      {facebookUrl && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 transition-colors"
        >
          <FaFacebook size={size} />
        </a>
      )}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 transition-colors"
        >
          <FaInstagram size={size} />
        </a>
      )}
      {xUrl && (
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 transition-colors"
        >
          <FaXTwitter size={size} />
        </a>
      )}
    </div>
  );
};

export default SocialIcons;
