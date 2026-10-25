import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Download,
  ShieldCheck,
  Receipt,
  ArrowRight,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { FeeRecord } from '../../types/campusly';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const FeesPage: React.FC = () => {
  const { fees, totalFeeAssessed, totalFeePaid, feeBalance, payFeeSimulation, profile } = useCampus();

  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payingRecord, setPayingRecord] = useState<FeeRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');
  const [paySuccess, setPaySuccess] = useState(false);

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const openPayModal = (f: FeeRecord) => {
    setPayingRecord(f);
    setPaySuccess(false);
    setPayModalOpen(true);
  };

  const handleSimulatePayment = () => {
    if (!payingRecord) return;
    const unpaid = payingRecord.assessedAmount - payingRecord.paidAmount;
    payFeeSimulation(payingRecord.id, unpaid, paymentMethod);
    setPaySuccess(true);
    setTimeout(() => {
      setPayModalOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            Fees, Institutional Ledger & Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Academic year 2025-2026 fee assessments and verified simulated payments
          </p>
        </div>

        <Badge variant={feeBalance === 0 ? 'success' : 'warning'} size="md">
          {feeBalance === 0 ? 'All Accounts Settled' : `Outstanding Dues: ${formatINR(feeBalance)}`}
        </Badge>
      </div>

      {/* Safety & Simulation Notice */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p>
          <strong>Simulation Environment:</strong> No real bank transactions or sensitive card
          numbers are processed. The "Pay Now" feature updates the student prototype ledger in real-time for demonstration purposes.
        </p>
      </div>

      {/* Balance Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Assessed Fees</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatINR(totalFeeAssessed)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Tuition, Labs & Exam Assessments</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Amount Paid</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalFeePaid)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {((totalFeePaid / totalFeeAssessed) * 100).toFixed(0)}% of total assessment cleared
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Outstanding Balance</p>
          <p
            className={`text-2xl sm:text-3xl font-extrabold mt-1 ${
              feeBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
            }`}
          >
            {formatINR(feeBalance)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {feeBalance > 0 ? 'Due by November 15, 2026' : 'Zero dues pending'}
          </p>
        </div>
      </div>

      {/* Fee Invoices & Payment Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Fee Breakdown & Receipts
          </span>
          <span className="text-xs text-slate-400">Semester 5 (2025-2026)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Fee Head / Description</th>
                <th className="py-3 px-4">Receipt Ref</th>
                <th className="py-3 px-3 text-right">Assessed</th>
                <th className="py-3 px-3 text-right">Paid</th>
                <th className="py-3 px-3 text-right">Due Balance</th>
                <th className="py-3 px-3 text-center">Due Date</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {fees.map((f) => {
                const remaining = f.assessedAmount - f.paidAmount;
                return (
                  <tr key={f.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {f.feeType}
                      </div>
                      <div className="text-[11px] text-slate-400">Semester {f.semester} • {f.academicYear}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {f.receiptNumber}
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                      {formatINR(f.assessedAmount)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(f.paidAmount)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {remaining > 0 ? (
                        <span className="text-amber-600">{formatINR(remaining)}</span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-500">
                      {f.dueDate}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <Badge
                        variant={
                          f.status === 'paid'
                            ? 'success'
                            : f.status === 'partially_paid'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {f.status === 'paid'
                          ? 'Paid in Full'
                          : f.status === 'partially_paid'
                          ? 'Partially Paid'
                          : 'Due Pending'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {remaining > 0 ? (
                        <button
                          type="button"
                          onClick={() => openPayModal(f)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
                        >
                          Pay Now (Simulate)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(f)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Payment Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Simulated Payment Gateway"
        description="This is a sandbox prototype transaction. No real banking details are requested."
      >
        {payingRecord && (
          <div className="space-y-4">
            {paySuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Simulation Successful!
                </h3>
                <p className="text-xs text-slate-500">
                  {formatINR(payingRecord.assessedAmount - payingRecord.paidAmount)} credited to{' '}
                  {payingRecord.feeType}.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fee Category:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {payingRecord.feeType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice Number:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {payingRecord.receiptNumber}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">Amount Due:</span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                      {formatINR(payingRecord.assessedAmount - payingRecord.paidAmount)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Simulated Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="UPI / QR Code">UPI (Instant Simulation)</option>
                    <option value="Net Banking (Apex Bank)">Net Banking (Apex Bank)</option>
                    <option value="Debit Card">Debit Card</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPayModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    Authorize Simulated Settlement
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Demo Receipt Modal */}
      <Modal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        title="Student Fee Receipt"
        maxWidth="lg"
      >
        {selectedReceipt && (
          <div className="space-y-4 text-xs">
            {/* Watermark Banner */}
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-center font-bold tracking-wide uppercase">
              DEMO RECEIPT — NOT VALID FOR PAYMENT OR OFFICIAL USE
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {profile.institutionName}
                  </h3>
                  <p className="text-[11px] text-slate-500">Division of Finance & Accounts</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedReceipt.receiptNumber}
                  </p>
                  <p className="text-[11px] text-slate-400">Date: {selectedReceipt.paidDate || selectedReceipt.dueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Student Name:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.fullName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Enrollment ID:</span>
                  <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{profile.studentId}</p>
                </div>
                <div>
                  <span className="text-slate-400">Program:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.degree}</p>
                </div>
                <div>
                  <span className="text-slate-400">Semester:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Sem {selectedReceipt.semester} ({selectedReceipt.academicYear})</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between py-1 font-semibold text-slate-700 dark:text-slate-300">
                  <span>{selectedReceipt.feeType}</span>
                  <span>{formatINR(selectedReceipt.paidAmount)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500 text-[11px]">
                  <span>Payment Mode</span>
                  <span>{selectedReceipt.paymentMethod || 'Online'}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500 text-[11px]">
                  <span>Transaction Ref</span>
                  <span className="font-mono">{selectedReceipt.transactionRef || 'SIM/893412'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white text-sm">
                  <span>Total Settled:</span>
                  <span>{formatINR(selectedReceipt.paidAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Demo Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
