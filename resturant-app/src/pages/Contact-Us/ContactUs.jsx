import React from "react";
import Seperator from "../../ui/Seperator";
import ResturantMap from "../../ui/ResturantMap";
import Container from "../../ui/Container";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

const ContactUs = () => {
  return (
    <div>
      <Container>
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black font-bold text-center mb-4">
          تواصل معنا
        </p>

        <p className="text-center text-base sm:text-lg md:text-xl mb-8 md:mb-16 px-4">
          نحن هنا للإجابة على جميع استفساراتكم وتلبية طلباتكم. تواصلوا معنا عبر
          النموذج أو المعلومات المباشرة.
        </p>
        <div className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 lg:grid-cols-2">
          <ResturantMap />
          <div className="flex flex-col gap-5">
            <p className="text-xl sm:text-2xl md:text-3xl text-black font-bold text-end mb-4">
              أرسل لنا رسالة
            </p>
            <p className="text-end text-base sm:text-lg md:text-xl">
              هل لديك أي أسئلة أو ملاحظات؟ لا تتردد في التواصل معنا.
            </p>
            <div className="w-full flex">
              <ContactForm />
            </div>
            <div className="flex justify-end">
              <ContactInfo />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactUs;
