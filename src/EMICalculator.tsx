import { useState } from "react";

export default function EMICalculator() {
  const [amount, setAmount] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [processingFee, setProcessingFee] = useState<number>(0);
  const [isProcessingFeePercent, setIsProcessingFeePercent] = useState<boolean>(false);
  const [useCommonTaxRate, setUseCommonTaxRate] = useState<boolean>(true);
  const [commonTaxRate, setCommonTaxRate] = useState<number>(18);
  const [interestTaxRate, setInterestTaxRate] = useState<number>(18);
  const [processingTaxRate, setProcessingTaxRate] = useState<number>(18);

  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const principal = amount;
    const months = tenure;
    const annualInterest = interestRate;
    const monthlyRate = annualInterest / 12 / 100;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    const appliedInterestTaxRate = useCommonTaxRate ? commonTaxRate : interestTaxRate;
    const appliedProcessingTaxRate = useCommonTaxRate ? commonTaxRate : processingTaxRate;

    const interestTax = (totalInterest * appliedInterestTaxRate) / 100;

    let fee = isProcessingFeePercent ? (principal * processingFee) / 100 : processingFee;
    let feeTax = (fee * appliedProcessingTaxRate) / 100;
    let totalProcessing = fee + feeTax;

    setResult({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      interestTax: interestTax.toFixed(2),
      processingFee: fee.toFixed(2),
      processingFeeTax: feeTax.toFixed(2),
      totalProcessing: totalProcessing.toFixed(2),
      totalPaid: (totalPayment + totalProcessing + interestTax).toFixed(2)
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">EMI Calculator</h2>

        <div className="space-y-2">
          <label className="block font-semibold">Purchase Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full border p-2 rounded" />

          <label className="block font-semibold">Tenure (Months)</label>
          <input type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} className="w-full border p-2 rounded" />

          <label className="block font-semibold">Interest Rate (%) per annum</label>
          <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full border p-2 rounded" />

          <label className="block font-semibold">Processing Fee ({isProcessingFeePercent ? "%" : "₹"})</label>
          <input type="number" value={processingFee} onChange={e => setProcessingFee(Number(e.target.value))} className="w-full border p-2 rounded" />
          <div className="text-sm text-blue-600 cursor-pointer" onClick={() => setIsProcessingFeePercent(!isProcessingFeePercent)}>
            Toggle to {isProcessingFeePercent ? "Absolute" : "Percentage"}
          </div>

          <label className="block font-semibold mt-4">Use Common Tax Rate for Both</label>
          <input type="checkbox" checked={useCommonTaxRate} onChange={e => setUseCommonTaxRate(e.target.checked)} className="ml-2" />

          {useCommonTaxRate ? (
            <div>
              <label className="block font-semibold mt-2">Common Tax Rate (%)</label>
              <input type="number" value={commonTaxRate} onChange={e => setCommonTaxRate(Number(e.target.value))} className="w-full border p-2 rounded" />
            </div>
          ) : (
            <>
              <label className="block font-semibold mt-2">Tax Rate on Interest (%)</label>
              <input type="number" value={interestTaxRate} onChange={e => setInterestTaxRate(Number(e.target.value))} className="w-full border p-2 rounded" />

              <label className="block font-semibold mt-2">Tax Rate on Processing Fee (%)</label>
              <input type="number" value={processingTaxRate} onChange={e => setProcessingTaxRate(Number(e.target.value))} className="w-full border p-2 rounded" />
            </>
          )}

          <button onClick={calculate} className="bg-blue-600 text-white w-full py-2 rounded mt-4 hover:bg-blue-700 transition-all">Calculate</button>
        </div>

        {result && (
          <div className="space-y-2 mt-6 text-sm">
            <div><strong>Monthly EMI:</strong> ₹{result.emi}</div>
            <div><strong>Total Interest:</strong> ₹{result.totalInterest}</div>
            <div><strong>Tax on Interest:</strong> ₹{result.interestTax}</div>
            <div><strong>Processing Fee:</strong> ₹{result.processingFee}</div>
            <div><strong>Processing Fee Tax:</strong> ₹{result.processingFeeTax}</div>
            <div><strong>Total Processing Fee (incl. tax):</strong> ₹{result.totalProcessing}</div>
            <div><strong>Total Amount Paid:</strong> ₹{result.totalPaid}</div>
          </div>
        )}
      </div>
    </div>
  );
}
