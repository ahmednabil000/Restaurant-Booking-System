import React, { useEffect } from "react";
import aboutUsImg from "../assets/about-us.jpg";
import Container from "../ui/Container";
import Seperator from "../ui/Seperator";
import BreakFastImg from "../assets/breakfast.jpg";
import AboutUsFeaturesSection from "../ui/AboutUsFeaturesSection";
import { FaRegClock } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import useRestaurantStore from "../store/restaurantStore";
import { useWorkingDays } from "../hooks/useWorkingDays";
import BranchesInfo from "../components/BranchesInfo";

// Helper function to convert 24h to 12h format
const formatTime = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "مساءً" : "صباحًا";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper function to translate day names to Arabic
const translateDay = (dayName) => {
  const dayMap = {
    Sunday: "الأحد",
    Monday: "الاثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    Saturday: "السبت",
    // Arabic versions (in case the API returns Arabic names)
    الأحد: "الأحد",
    الإثنين: "الاثنين",
    الاثنين: "الاثنين",
    الثلاثاء: "الثلاثاء",
    الأربعاء: "الأربعاء",
    الخميس: "الخميس",
    الجمعة: "الجمعة",
    السبت: "السبت",
  };
  return dayMap[dayName] || dayName;
};

// Helper function to group working days
const formatWorkingDays = (workingDays) => {
  if (!workingDays || workingDays.length === 0) return [];

  // Only include active working days
  const activeDays = workingDays.filter((day) => day.isActive === true);

  // Sort days by day order (Sunday = 0, Monday = 1, etc.)
  const dayOrder = {
    الأحد: 0,
    Sunday: 0,
    الاثنين: 1,
    الإثنين: 1,
    Monday: 1,
    الثلاثاء: 2,
    Tuesday: 2,
    الأربعاء: 3,
    Wednesday: 3,
    الخميس: 4,
    Thursday: 4,
    الجمعة: 5,
    Friday: 5,
    السبت: 6,
    Saturday: 6,
  };

  activeDays.sort((a, b) => {
    const orderA = dayOrder[a.name] ?? 999;
    const orderB = dayOrder[b.name] ?? 999;
    return orderA - orderB;
  });

  // Group consecutive days with same hours
  const grouped = [];
  let current = null;

  activeDays.forEach((day) => {
    const timeStr = `${formatTime(day.startHour)} - ${formatTime(day.endHour)}`;
    const arabicDayName = translateDay(day.name);

    if (current && current.hours === timeStr) {
      current.days.push(arabicDayName);
      current.dayIndexes.push(dayOrder[day.name] ?? 999);
    } else {
      if (current) grouped.push(current);
      current = {
        hours: timeStr,
        days: [arabicDayName],
        dayIndexes: [dayOrder[day.name] ?? 999],
      };
    }
  });

  if (current) grouped.push(current);

  // Format the days string
  return grouped.map((group) => ({
    ...group,
    daysStr:
      group.days.length > 2 &&
      group.dayIndexes.every(
        (index, i) => i === 0 || index === group.dayIndexes[i - 1] + 1
      )
        ? `${group.days[0]} - ${group.days[group.days.length - 1]}`
        : group.days.join(" - "),
  }));
};

const AboutUs = () => {
  const { restaurant, fetchRestaurantDetails, loading } = useRestaurantStore();
  const { workingDays, loading: workingDaysLoading } = useWorkingDays();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [fetchRestaurantDetails]);

  // Extract restaurant data from API response
  const restaurantData = restaurant?.success ? restaurant.data : restaurant;

  // Use working days from the working days service
  const workingHours =
    workingDays.length > 0 ? formatWorkingDays(workingDays) : [];
  return (
    <>
      <div className="h-120 sm:h-140 md:h-160 lg:h-180 w-full relative">
        <img src={aboutUsImg} className="object-cover h-full w-full" />
        <div className="bg-black/30 absolute h-full w-full top-0"></div>
        <p className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-4">
          قصتنا: شغف يروى على مائدة الطعام
        </p>
      </div>
      <Container>
        <Seperator />
        <p className="text-black font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center">
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
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 leading-relaxed">
              لا تُنسى. بدأنا كحلم بسيط في قلب القاهرة، مدفوعين بشغف عميق
              بالمطبخ العربي الأصيل ورغبة في الارتقاء بفن الضيافة. كل طبق نقدمه
              يحمل قصة، من منذ افتتاح أبوابه، وضع مطعم راقي نصب عينيه هدفًا
              واحدًا: تقديم تجربة طعام اختيار أجود المكونات الطازجة المحلية
              والعالمية، إلى طرق التحضير التقليدية التي تُورثت عبر الأجيال،
              ممزوجة بلمسة عصرية مبتكرة.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 leading-relaxed">
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
        <p className="text-black font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center">
          مواعيد العمل والفروع
        </p>
        <Seperator />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-100 px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="h-auto flex flex-col gap-4 md:gap-6 lg:gap-8">
            <div className="flex gap-3 md:gap-4 lg:gap-6 justify-center lg:justify-end items-center">
              <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                موقعنا
              </p>
              <IoLocationSharp className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-[#e26136]" />
            </div>
            {loading || workingDaysLoading ? (
              <div className="text-center text-sm text-gray-500">
                جاري التحميل...
              </div>
            ) : (
              <>
                {/* Display branches information */}
                <BranchesInfo />
              </>
            )}
          </div>
          <div className="h-auto flex flex-col gap-4 md:gap-6 lg:gap-8">
            <div className="flex gap-3 md:gap-4 lg:gap-6 justify-center lg:justify-end items-center">
              <p className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                ساعات العمل
              </p>
              <FaRegClock className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-[#e26136]" />
            </div>
            {loading || workingDaysLoading ? (
              <div className="text-center text-sm text-gray-500">
                جاري التحميل...
              </div>
            ) : (
              <>
                {workingHours.length > 0 ? (
                  workingHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-sm sm:text-base md:text-lg lg:text-xl text-[#565d6d] sm:border-b-2 border-[#565d6d]/20 pb-3 md:pb-4 gap-2 sm:gap-0"
                    >
                      <p className="text-center sm:text-right">
                        {schedule.hours}
                      </p>
                      <p className="text-center sm:text-left font-semibold">
                        {schedule.daysStr}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-sm sm:text-base md:text-lg lg:text-xl text-[#565d6d] sm:border-b-2 border-[#565d6d]/20 pb-3 md:pb-4 gap-2 sm:gap-0">
                      <p className="text-center sm:text-right">
                        9:00 صباحًا - 11:00 مساءًا
                      </p>
                      <p className="text-center sm:text-left font-semibold">
                        الأحد - الخميس
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-sm sm:text-base md:text-lg lg:text-xl text-[#565d6d] gap-2 sm:gap-0">
                      <p className="text-center sm:text-right">
                        2:00 مساءًا - 11:30 مساءًا
                      </p>
                      <p className="text-center sm:text-left font-semibold">
                        الجمعة
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default AboutUs;
