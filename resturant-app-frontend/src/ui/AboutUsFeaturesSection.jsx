import React from "react";
import { FaStar, FaCrown, FaHandshake } from "react-icons/fa";

const AboutUsFeaturesSection = () => {
  return (
    <div className="py-12 px-4 md:px-8 lg:px-16 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* Feature 1: التميز في الطهي */}
        <div className="bg-white rounded-lg p-8 lg:p-10 shadow-sm border min-h-80 lg:min-h-96 border-gray-100 text-center flex flex-col justify-start">
          <div className="text-orange-500 mb-4">
            <FaStar size={32} />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            التميز في الطهي
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            نلتزم بتقديم أشهى الأطباق المحضرة بأجود المكونات الطازجة، لضمان
            تجربة طعام فريدة تتجاوز التوقعات.
          </p>
        </div>

        {/* Feature 2: الضيافة الأصيلة */}
        <div className="bg-white rounded-lg p-8 lg:p-10 min-h-80 lg:min-h-96 shadow-sm border border-gray-100 text-center flex flex-col justify-start">
          <div className="text-orange-500 mb-4">
            <FaCrown size={32} />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            الضيافة الأصيلة
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            نرحب بضيوفنا بحفاوة وكرم، ونحرص على توفير خدمة استثنائية تجعل كل
            زيارة ذكرى لا تُنسى.
          </p>
        </div>

        {/* Feature 3: الابتكار المستمر */}
        <div className="bg-white rounded-lg p-8 lg:p-10 min-h-80 lg:min-h-96 shadow-sm border border-gray-100 text-center flex flex-col justify-start">
          <div className="text-orange-500 mb-4">
            <FaHandshake size={32} />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            الابتكار المستمر
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            نسعى دائمًا لابتكار أطباق جديدة وتجارب طعام مبتكرة، مع الحفاظ على
            التقاليد والنكهات الأصيلة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsFeaturesSection;
