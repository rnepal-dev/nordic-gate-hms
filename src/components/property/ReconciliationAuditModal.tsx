import React from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { RECONCILIATION_TABLE } from '../../data/propertyData.ts';
import { X, Check, AlertCircle, FileSearch, ShieldCheck } from 'lucide-react';

interface ReconciliationAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReconciliationAuditModal: React.FC<ReconciliationAuditModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useHotel();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F8F5EF] text-[#25303A] w-full max-w-5xl rounded-xl border border-[#EDE7DC] shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0D1A26] text-white border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#BF8641] text-white flex items-center justify-center">
              <FileSearch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl tracking-wide text-[#F8F5EF]">
                Milestone 1 — Property Content Reconciliation Audit
              </h3>
              <p className="text-xs text-[#D3C8B9]">
                Comparing Hotel Nordic Gate frontend vs. Quality Hotel Winn (Gothenburg) listing reference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded hover:bg-white/10 cursor-pointer"
            aria-label="Stäng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Guidance Note */}
        <div className="px-6 py-3 bg-[#EDE7DC]/70 border-b border-[#D3C8B9] text-xs text-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#BF8641] shrink-0" />
            <span>
              <strong>Brand Rule:</strong> Quality Hotel Winn listing serves as research reference; details are marked with explicit verification status.
            </span>
          </div>
          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#D3C8B9]">
            7 Domains Audited
          </span>
        </div>

        {/* Table Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Previous Content</th>
                  <th className="py-2.5 px-3">Quality Hotel Winn Listing</th>
                  <th className="py-2.5 px-3 text-center">Confirmed by Source</th>
                  <th className="py-2.5 px-3 text-center">Verified for Nordic Gate</th>
                  <th className="py-2.5 px-3">Design / Data Model Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-slate-700">
                {RECONCILIATION_TABLE.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap align-top">
                      {row.domain}
                    </td>
                    <td className="py-3 px-3 text-slate-600 align-top max-w-[180px]">
                      {row.previousContent}
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-medium align-top max-w-[200px]">
                      {row.qualityWinnListing}
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      {row.confirmedBySource ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          <Check className="w-3.5 h-3.5" /> Ja
                        </span>
                      ) : (
                        <span className="text-slate-400">Nej</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center align-top">
                      {row.verifiedForNordicGate ? (
                        <span className="text-emerald-700 font-semibold">Ja</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700 text-[11px] align-top max-w-[240px] leading-relaxed">
                      {row.designDataModelChange}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#EDE7DC] flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Source: Booking.com listing (Quality Hotel Winn, Gothenburg) · Internal Architecture Review
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0D1A26] hover:bg-slate-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Stäng revisionsgranskning
          </button>
        </div>

      </div>
    </div>
  );
};
