import React from "react";
import { useBranches } from "../hooks/useBranches";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const BranchesInfo = () => {
  const { branches, loading, getActiveBranches } = useBranches();

  if (loading) {
    return (
      <div className="text-center text-sm text-gray-500">
        جاري تحميل معلومات الفروع...
      </div>
    );
  }

  const activeBranches = getActiveBranches();

  if (activeBranches.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">
        لم يتم العثور على فروع نشطة
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeBranches.map((branch, index) => {
        return (
          <div key={branch.id} className="space-y-4">
            {activeBranches.length > 1 && (
              <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                {branch.name}
              </h3>
            )}

            {/* Location Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="h-5 w-5 text-[#e26136] mt-1 flex-shrink-0" />
                <div className="text-sm sm:text-base text-[#565d6d]">
                  <div className="font-semibold">{branch.address}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {branch.city}, {branch.state}, {branch.country}
                    {branch.zipCode && ` - ${branch.zipCode}`}
                  </div>
                  {branch.landmark && (
                    <div className="text-sm text-gray-500 mt-1">
                      {branch.landmark}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaPhone className="h-5 w-5 text-[#e26136] flex-shrink-0" />
                <span className="text-sm sm:text-base text-[#e26136] font-medium">
                  {branch.phone}
                </span>
              </div>
            </div>

            {/* Separator between branches */}
            {index < activeBranches.length - 1 && (
              <div className="border-t border-gray-200 pt-4 mt-6"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BranchesInfo;
