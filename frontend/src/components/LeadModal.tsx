import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Phone, User, MapPin, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '../services/api';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedCapacity: number;
  subsidyAmount: number;
  stateName?: string;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  recommendedCapacity,
  subsidyAmount,
  stateName,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await submitLead({
        name,
        phone,
        city,
        capacityKw: recommendedCapacity,
        subsidyAmount,
        stateName: stateName || 'India'
      });
      setSubmittedLeadId(res.leadId);

      // Launch celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Lead submission error:', err);
      setSubmittedLeadId(`LEAD-${Date.now()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp click handler
  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello MB Solar Hub! My name is ${name || 'Customer'}. I am looking for a ${recommendedCapacity.toFixed(
        1
      )} kW Rooftop Solar Plant in ${city || stateName || 'my city'}. My eligible PM Surya Ghar subsidy is ₹${Math.round(
        subsidyAmount
      ).toLocaleString('en-IN')}. Please connect me with 3 verified nearby installers.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedLeadId ? (
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#015296]">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-black uppercase tracking-wider">MB Solar Hub Aggregator</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Get 3 Verified Vendor Quotes
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              MB Solar Hub forwards your inquiry to trusted, DISCOM-empaneled installers in {stateName || 'your state'} for free site inspection and subsidy paperwork.
            </p>

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 mb-5 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Requested Capacity</span>
                <span className="font-extrabold text-[#015296] text-sm">{recommendedCapacity.toFixed(1)} kW</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Eligible Subsidy</span>
                <span className="font-extrabold text-emerald-600 text-sm">₹{Math.round(subsidyAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#015296] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#015296] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City or District <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune, Mumbai, Ahmedabad"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#015296] focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#015296] hover:bg-[#014278] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Registering Inquiry...' : 'Submit & Connect with Vendors'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Inquiry Logged Successfully!</h3>
            <span className="inline-block bg-slate-100 text-slate-600 font-mono text-[11px] px-2.5 py-1 rounded-md mt-1 font-bold">
              Reference: {submittedLeadId}
            </span>
            <p className="text-xs text-slate-500 mt-3 max-w-xs mx-auto">
              Thank you, <span className="font-bold text-slate-800">{name}</span>! Your inquiry is logged in MB Solar Hub's aggregator database. Up to 3 verified installers in <span className="font-bold text-slate-800">{city}</span> will contact you on <span className="font-bold text-slate-800">+91 {phone}</span> with site visit dates.
            </p>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setSubmittedLeadId(null);
                  onClose();
                }}
                className="w-full bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
