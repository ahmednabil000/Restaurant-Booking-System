import aboutUsImg from "../assets/about-us.jpg";
import Container from "../ui/Container";
import Seperator from "../ui/Seperator";
import BreakFastImg from "../assets/breakfast.jpg";
import AboutUsFeaturesSection from "../ui/AboutUsFeaturesSection";
import { FaRegClock } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
const AboutUs = () => {
  return (
    <>
      <div className="h-120 sm:h-140 md:h-160 lg:h-180 w-full relative">
        <img src={aboutUsImg} className="object-cover h-full w-full" />
        <div className="bg-black/30 absolute h-full w-full top-0"></div>
        <p className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl px-4">
          قصتنا: شغف يروى على مائدة الطعام
        </p>
      </div>
      <Container>
        <Seperator />
        <p className="text-black font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center">
          قصتنا
        </p>
        <Seperator />
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8 lg:gap-0">
          <div className="order-2 lg:order-1">
            <img
              src={BreakFastImg}
              className="object-cover h-64 sm:h-80 md:h-96 lg:h-[38.7rem] w-full rounded-lg lg:rounded-none"
            />
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-8 md:gap-12 lg:gap-16 justify-center px-4 lg:px-8">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 leading-relaxed">
              لا تُنسى. بدأنا كحلم بسيط في قلب القاهرة، مدفوعين بشغف عميق
              بالمطبخ العربي الأصيل ورغبة في الارتقاء بفن الضيافة. كل طبق نقدمه
              يحمل قصة، من منذ افتتاح أبوابه، وضع مطعم راقي نصب عينيه هدفًا
              واحدًا: تقديم تجربة طعام اختيار أجود المكونات الطازجة المحلية
              والعالمية، إلى طرق التحضير التقليدية التي تُورثت عبر الأجيال،
              ممزوجة بلمسة عصرية مبتكرة.
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500 leading-relaxed">
              وتخلق ذكريات لا تُنسى. لقد قطعنا شوطًا طويلاً، لكن شغفنا بالجودة
              والتميز لا يزال هو الدافع الرئيسي لكل ما نفعله. نحن فخورون بأن
              نكون جزءًا من نؤمن بأن الطعام ليس مجرد وجبة، بل هو تجربة حسية
              متكاملة تجمع الأحباء مجتمعنا، ونسعى دائمًا لتقديم الأفضل، في كل
              طبق وفي كل ابتسامة.
            </p>
          </div>
        </div>
        <Seperator />
        <div className="w-full h-auto">
          <AboutUsFeaturesSection />
        </div>
        <Seperator />
        <p className="text-black font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center">
          مواعيد العمل والفروع
        </p>
        <Seperator />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-100 px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="h-auto flex flex-col gap-6 md:gap-8 lg:gap-10">
            <div className="flex gap-4 md:gap-6 lg:gap-8 justify-center lg:justify-end items-center">
              <p className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                فروعنا
              </p>
              <IoLocationSharp className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-[#e26136]" />
            </div>
            <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 text-base sm:text-lg md:text-xl lg:text-2xl text-[#565d6d] text-center lg:text-end">
              <p className="font-semibold">الفرع الرئيسي</p>
              <p>التجمع الخامس, القاهرة, مصر</p>
            </div>
            <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 text-base sm:text-lg md:text-xl lg:text-2xl text-[#565d6d] text-center lg:text-end">
              <p className="font-semibold">فرع الشيخ زايد</p>
              <p>الشيخ زياد, الجيزة, مصر</p>
            </div>
          </div>
          <div className="h-auto flex flex-col gap-6 md:gap-8 lg:gap-10">
            <div className="flex gap-4 md:gap-6 lg:gap-8 justify-center lg:justify-end items-center">
              <p className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                ساعات العمل
              </p>
              <FaRegClock className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-[#e26136]" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-base sm:text-lg md:text-xl lg:text-2xl text-[#565d6d] sm:border-b-2 border-[#565d6d]/20 pb-4 md:pb-6 gap-2 sm:gap-0">
              <p className="text-center sm:text-right">
                12:00 ظهرًا - 12:00 منتصف الليل
              </p>
              <p className="text-center sm:text-left font-semibold">
                السبت - الخميس
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-base sm:text-lg md:text-xl lg:text-2xl text-[#565d6d] gap-2 sm:gap-0">
              <p className="text-center sm:text-right">
                1:00 ظهرًا - 1:00 صباحًا
              </p>
              <p className="text-center sm:text-left font-semibold">الجمعة</p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AboutUs;
