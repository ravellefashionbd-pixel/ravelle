"use client";
import { useState } from "react";

const faqs = [
  {
    question: "How long does the delivery take?",
    answer: "Inside Dhaka: 2–3 days. Outside Dhaka: 3–5 business days.",
  },
  {
    question: "Is your jewelry water-resistant?",
    answer:
      "Our pieces are crafted with premium gold-plated and stainless steel materials. Gentle care is recommended to preserve finish and shine.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return window for damaged or incorrect items in original condition and packaging.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-[11px] tracking-[0.45em] uppercase text-neutral-400">
            Information
          </p>

          <h2 className="text-4xl md:text-5xl font-extralight text-black">
            Frequently <span>Asked Questions</span>
          </h2>

          <div className="w-16 h-[1px] bg-black/20 mx-auto"></div>
        </div>

        {/* FAQ List */}
        <div className="space-y-8">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="group">
                {/* Question */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-start text-left"
                >
                  <span className="text-sm md:text-base font-light tracking-wide text-black">
                    {faq.question}
                  </span>

                  {/* Minimal indicator (no + / -) */}
                  <span className="text-neutral-300 text-sm">
                    {isOpen ? "—" : "+"}
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-neutral-500 text-sm leading-relaxed max-w-xl">
                    {faq.answer}
                  </p>
                </div>

                {/* subtle divider */}
                <div className="mt-6 h-[1px] bg-neutral-100"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
