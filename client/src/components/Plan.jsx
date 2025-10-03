import { PricingTable } from "@clerk/clerk-react";

const Plan = () => {
  return (
    <section className="max-w-3xl mx-auto z-20 mt-32 mb-20">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800 mb-3">Choose Your Plan</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Start free, scale anytime. Transparent pricing tailored to content creators and businesses.
        </p>
      </div>
      <div className="w-full p-2 bg-gradient-to-tr from-[#f1e9f9] via-[#d6fce8] to-[#fff] rounded-2xl border border-gray-200 shadow-lg">
        <PricingTable />
      </div>
      <div className="mt-8 text-center text-xs text-gray-400">
        All plans enable full-featured AI tools. No hidden fees. Cancel anytime.
      </div>
    </section>
  );
};

export default Plan;
