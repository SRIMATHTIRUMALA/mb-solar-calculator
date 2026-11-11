import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MBSolarHubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MBSolarHubCategoryModal: React.FC<MBSolarHubCategoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<string>('Customer');

  if (!isOpen) return null;

  const handleExistingUser = () => {
    if (!selectedType) {
      alert('Please select an account category');
      return;
    }
    window.location.href = `https://mbsolarhub.com/login.php?type=${encodeURIComponent(selectedType)}`;
  };

  const handleNewUser = () => {
    if (!selectedType) {
      alert('Please select an account category');
      return;
    }
    window.location.href = `https://mbsolarhub.com/signup.php?type=${encodeURIComponent(selectedType)}`;
  };

  const categories = [
    {
      id: 'Customer',
      label: 'I am a Solar Customer',
      image: '/images/categories/customer.jpg',
      fallbackImage: 'https://mbsolarhub.com/assets/img/solar.jpg',
    },
    {
      id: 'Vendor',
      label: 'Solar Vendors / EPC Players',
      image: '/images/categories/vendor.jpg',
      fallbackImage: 'https://mbsolarhub.com/assets/img/model2.JPG',
    },
    {
      id: 'Manufacturer',
      label: 'Manufacturer',
      image: '/images/categories/manufacturer.png',
      fallbackImage: 'https://mbsolarhub.com/assets/img/solar01.png',
    },
    {
      id: 'AMC/Installers',
      label: 'AMC / Installers',
      image: '/images/categories/amc.png',
      fallbackImage: 'https://mbsolarhub.com/assets/img/solar02.png',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[18px] max-w-lg w-full p-5 sm:p-6 shadow-2xl relative border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-0">
          <p className="text-slate-500 font-medium text-sm">Select your account category</p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Category Cards in 2x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {categories.map((cat) => {
            const isChecked = selectedType === cat.id;
            return (
              <label
                key={cat.id}
                onClick={() => setSelectedType(cat.id)}
                className="block cursor-pointer select-none"
              >
                <div
                  className={`flex items-center text-left gap-3.5 p-3.5 rounded-[14px] border-2 transition-all ${
                    isChecked
                      ? 'border-[#63c153] bg-[#f3fff1] shadow-[0_6px_16px_rgba(99,193,83,0.20)]'
                      : 'border-[#ececec] bg-white hover:border-[#63c153] hover:bg-[#f3fff1]'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    onError={(e) => {
                      e.currentTarget.src = cat.fallbackImage;
                    }}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <h5 className="font-semibold text-slate-800 text-[13px] leading-snug">
                    {cat.label}
                  </h5>
                </div>
              </label>
            );
          })}
        </div>

        {/* 2 Green Action Buttons Side-by-Side Matching mbsolarhub.com */}
        <div className="flex gap-2.5 mt-5">
          <button
            type="button"
            onClick={handleExistingUser}
            className="flex-1 h-12 rounded-xl bg-[#63c153] hover:bg-[#52ad43] active:bg-[#4eab40] text-white font-bold text-[15px] shadow-sm transition-all cursor-pointer flex items-center justify-center"
          >
            Existing User
          </button>
          <button
            type="button"
            onClick={handleNewUser}
            className="flex-1 h-12 rounded-xl bg-[#63c153] hover:bg-[#52ad43] active:bg-[#4eab40] text-white font-bold text-[15px] shadow-sm transition-all cursor-pointer flex items-center justify-center"
          >
            New User
          </button>
        </div>

        {/* Direct link to MB Solar Hub */}
        <div className="text-center mt-3 pt-2 border-t border-slate-100">
          <a
            href="https://mbsolarhub.com/about-us.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#015296] hover:underline font-semibold"
          >
            Direct link to MB Solar Hub Portal (mbsolarhub.com) ↗
          </a>
        </div>
      </div>
    </div>
  );
};

