import React, { useState, useEffect } from "react";
import Seperator from "../../ui/Seperator";
import ResturantMap from "../../ui/ResturantMap";
import Container from "../../ui/Container";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import { useBranches } from "../../hooks/useBranches";

const ContactUs = () => {
  const { branches, loading: branchesLoading } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  // Get active branches that have coordinates
  const availableBranches = branches.filter(
    (branch) => branch.isActive && branch.latitude && branch.longitude
  );

  // Set first branch as default when branches are loaded
  useEffect(() => {
    if (!branchesLoading && availableBranches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(availableBranches[0].id);
    }
  }, [branchesLoading, availableBranches, selectedBranchId]);

  // Find selected branch
  const selectedBranch = selectedBranchId
    ? availableBranches.find((branch) => branch.id === selectedBranchId)
    : null;

  return (
    <div>
      <Seperator />
      <Container>
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black font-bold text-center mb-16">
          تواصل معنا
        </p>

        <p className="text-center text-base sm:text-lg md:text-xl mb-8 md:mb-16 px-4">
          نحن هنا للإجابة على جميع استفساراتكم وتلبية طلباتكم. تواصلوا معنا عبر
          النموذج أو المعلومات المباشرة.
        </p>
        <div className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 lg:grid-cols-2">
          <div>
            {/* Loading State */}
            {branchesLoading && (
              <div className="mb-4 p-4 bg-gray-100 rounded-md text-center">
                <p className="text-gray-600">جاري تحميل الفروع...</p>
              </div>
            )}

            {/* Branch Selector */}
            {!branchesLoading && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  اختر الفرع لعرض موقعه على الخريطة
                </label>
                {availableBranches.length > 0 ? (
                  <select
                    value={selectedBranchId || ""}
                    onChange={(e) =>
                      setSelectedBranchId(e.target.value || null)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-right"
                  >
                    {availableBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} - {branch.city}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-md">
                    <p className="text-yellow-800 text-center text-sm">
                      لا توجد فروع متاحة مع معلومات الموقع حالياً
                    </p>
                  </div>
                )}
              </div>
            )}

            <ResturantMap selectedBranch={selectedBranch} />
          </div>
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
