import React, { useState } from 'react';
import { X, CheckCircle2, Phone, ArrowRight, Star, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedCapacity: number;
  subsidyAmount: number;
  stateName?: string;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  recommendedCapacity,
  subsidyAmount,
  stateName,
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'vendor'>('customer');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignedIn(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Mock list of top empaneled vendors in the user's state
  const mockVendors = [
    {
      name: 'SunPower Solutions (DISCOM Empaneled)',
      rating: 4.9,
      reviews: 142,
      distance: '3.4 km away',
      specialty: 'Tier-1 DCR Mono-PERC Panels & Inverters',
      subsidyAssistance: '100% Paperwork Handled'
    },
    {
      name: 'EcoGreen Solar EPC Partners',
      rating: 4.8,
      reviews: 98,
      distance: '6.1 km away',
      specialty: 'Net Metering & Structure Installation',
      subsidyAssistance: 'Direct DBT Bank Credit Support'
    },
    {
      name: 'Apex Energy Systems',
      rating: 4.9,
      reviews: 210,
      distance: '8.0 km away',
      specialty: '25-Year Panel Warranty + 5-Year AMC',
      subsidyAssistance: 'Approved MNRE Channel Partner'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MB Solar Hub Header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/images/mb-solar-hub-logo.jpg"
            alt="MB Solar Hub"
            className="h-10 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">MB Solar Hub Portal</h3>
            <p className="text-[11px] text-slate-500">India's #1 Solar Aggregator Platform</p>
          </div>
        </div>

        {!isSignedIn ? (
          <div>
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('customer')}
                className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'customer'
                    ? 'border-[#015296] text-[#015296]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Customer Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vendor')}
                className={`flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'vendor'
                    ? 'border-[#015296] text-[#015296]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Solar Installer Portal
              </button>
            </div>

            {/* Quick Sizing summary badge */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 mb-5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Recommended System</span>
                <span className="font-extrabold text-[#015296] text-sm">{recommendedCapacity.toFixed(1)} kW Plant</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">PM Surya Ghar Subsidy</span>
                <span className="font-extrabold text-emerald-600 text-sm">₹{Math.round(subsidyAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#015296] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#015296] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City / District in {stateName || 'your state'}</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune, Mumbai, Ahmedabad"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#015296] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#015296] hover:bg-[#014278] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Sign In & Find Nearby Vendors</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Sign In Button for instant testing */}
              <button
                type="button"
                onClick={() => {
                  setName('Demo Customer');
                  setPhone('9876543210');
                  setCity(stateName || 'Mumbai');
                  setIsSignedIn(true);
                  confetti({ particleCount: 50, spread: 60 });
                }}
                className="w-full text-center text-xs text-[#015296] hover:underline font-semibold pt-1 block cursor-pointer"
              >
                ⚡ Instant Demo Access (One-Click Sign In)
              </button>
            </form>
          </div>
        ) : (
          /* Logged In: Displays Verified Empaneled Installers in user's area */
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Signed In as {name || 'Customer'} (+91 {phone})
              </span>
              <span className="text-[11px] bg-emerald-200/60 px-2 py-0.5 rounded-full font-bold">Verified</span>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-800">
                Top Empaneled Installers in {city || stateName || 'Your City'}
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">3 Vendors Available</span>
            </div>

            <div className="space-y-3">
              {mockVendors.map((vendor, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 hover:border-[#015296] transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">{vendor.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px]">
                        <span className="flex items-center text-amber-500 font-bold gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {vendor.rating}
                        </span>
                        <span className="text-slate-400">({vendor.reviews} installs)</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" /> {vendor.distance}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        alert(`Request sent to ${vendor.name}! A representative will call you on ${phone} within 2 hours.`);
                      }}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-900 text-[11px] font-black px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer shadow-2xs"
                    >
                      Book Visit
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{vendor.specialty}</span>
                    <span className="text-emerald-700 font-bold">{vendor.subsidyAssistance}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setIsSignedIn(false);
                onClose();
              }}
              className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer mt-3"
            >
              Done / Close Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
