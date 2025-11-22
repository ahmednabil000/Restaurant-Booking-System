import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
const SocialIcons = ({ size = 24, className = "" }) => {
  return (
    <div
      className={`flex justify-center sm:justify-end gap-4 sm:gap-6 md:gap-8 ${className}`}
    >
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-500 hover:text-orange-600 transition-colors"
      >
        <FaFacebook size={size} />
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-500 hover:text-orange-600 transition-colors"
      >
        <FaInstagram size={size} />
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-500 hover:text-orange-600 transition-colors"
      >
        <FaXTwitter size={size} />
      </a>
    </div>
  );
};

export default SocialIcons;
