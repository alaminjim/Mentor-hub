import { ReviewDataType } from "@/type/reviewType";

export default function ReviewCard({ review }: { review: ReviewDataType }) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-cyan-50/30 rounded-2xl p-6 shadow-sm border border-cyan-100/50 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-full rounded-tr-2xl"></div>
      <div className="absolute top-4 left-4 text-cyan-500/20 text-4xl font-serif leading-none">
        "
      </div>

      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-sky-50/70 px-3 py-1.5 rounded-full border border-sky-100 shadow-sm">
          <div className="flex text-sky-400 text-base">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="drop-shadow-sm">
                {i < review.rating ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-sm font-bold text-sky-600 bg-white/60 px-2 py-0.5 rounded-full">
            {review.rating}.0
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-cyan-600 bg-cyan-100/50 px-2 py-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Verified</span>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic font-light mb-4 pl-2">
          {review.comment}
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent mb-3"></div>

      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="font-medium">
          {new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 via-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/5 group-hover:via-transparent group-hover:to-cyan-400/5 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}
