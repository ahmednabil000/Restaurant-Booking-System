import React from "react";
import Header from "../ui/Header";
import Hero from "../ui/Hero";
import Seperator from "../ui/Seperator";
import Container from "../ui/Container";
import TopDemandedMeals from "../features/meals/TopDemandedMeals";
import Testimonial from "../features/customers/Testimonial";
import InformationCard from "../ui/InformationCard";
import { IoMdInformationCircleOutline, IoMdMenu } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";
import Footer from "../ui/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <Container>
        <Seperator />
        <Seperator />
        <TopDemandedMeals />
        <Seperator />
        <div className="bg-linear-to-br from-slate-50 to-slate-100 w-full py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="text-black font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-6 sm:mb-8 md:mb-10">
              ماذا يقول عملاؤنا
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-6 xl:gap-8 max-w-7xl mx-auto">
              <Testimonial
                rating={5}
                comment="طعام رائع وخدمة ممتازة! أنصح بشدة بزيارة هذا المطعم المميز"
                name="أحمد محمد"
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              />
              <Testimonial
                rating={4}
                comment="تجربة طعام لا تُنسى مع أجواء رائعة ومذاق أصيل"
                name="فاطمة علي"
                avatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
              />
              <div className="hidden lg:block">
                <Testimonial
                  rating={5}
                  comment="جودة عالية وأسعار معقولة، سأعود بالتأكيد مرة أخرى"
                  name="محمد الأحمد"
                  avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                />
              </div>
            </div>
          </div>
        </div>
        <Seperator />
        <Seperator />
        <p className="text-black font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center px-4">
          اكتشف المزيد
        </p>
        <Seperator />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-10">
          <InformationCard
            title="من نحن"
            content="اكتشف قصتنا الملهمة وشغفنا بالطعام."
          >
            <IoMdInformationCircleOutline className="text-[#e26136] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </InformationCard>
          <InformationCard
            title="احجز طاولة"
            content="خطط لزيارتك القادمة واحجز طاولتك بسهولة."
          >
            <CiCalendar className="text-[#e26136] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </InformationCard>
          <InformationCard
            title="القائمة"
            content="تصفح مجموعتنا الواسعة من الأطباق الشهية."
          >
            <IoMdMenu className="text-[#e26136] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </InformationCard>
          <InformationCard
            title="تواصل معنا"
            content="نحن هنا للإجابة على جميع استفساراتك."
          >
            <MdOutlinePhone className="text-[#e26136] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </InformationCard>
        </div>
        <Seperator />
        <Seperator />
      </Container>
    </div>
  );
};

export default Home;
