interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
}

export default function FAQ({ faqs }: Props) {
  return (
    <div className="space-y-6">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg shadow-pink-200/5"
          >
            <summary className="text-lg font-black text-slate-900 cursor-pointer list-none flex items-center justify-between">
              <span className="pr-4">{faq.question}</span>
              <svg
                className="w-6 h-6 text-pink-600 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-4 text-slate-600 font-medium leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
  );
}
