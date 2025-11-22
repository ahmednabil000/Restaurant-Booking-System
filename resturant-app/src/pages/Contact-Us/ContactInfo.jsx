import SocialIcons from "./SocialIcons";

const ContactInfo = () => {
  return (
    <div className="flex flex-col justify-end">
      {/* Social Media */}
      <p className="text-lg text-gray-700 mb-3">
        تابعنا على وسائل التواصل الاجتماعي
      </p>
      <SocialIcons size={24} />
    </div>
  );
};

export default ContactInfo;
