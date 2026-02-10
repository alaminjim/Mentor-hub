import { Search, Calendar, Video, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Browse Tutors",
      description:
        "Search through our verified tutors and find the perfect match for your learning needs.",
      color: "from-sky-400 to-cyan-500",
      bgColor: "bg-sky-50",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Book a Session",
      description:
        "Choose a convenient time slot and book your session with just a few clicks.",
      color: "from-cyan-400 to-teal-500",
      bgColor: "bg-cyan-50",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Start Learning",
      description:
        "Join your online session and start learning from expert tutors at your own pace.",
      color: "from-teal-400 to-emerald-500",
      bgColor: "bg-teal-50",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Track Progress",
      description:
        "Monitor your learning journey and see your improvement over time.",
      color: "from-emerald-400 to-green-500",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-sky-50/30">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Get started with your learning journey in just four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-sky-100/50 hover:shadow-xl hover:border-sky-200 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white font-bold flex items-center justify-center shadow-lg">
                {index + 1}
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-sky-400/10 to-transparent rounded-bl-full rounded-tr-2xl"></div>

              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/0 via-sky-400/0 to-sky-400/0 group-hover:from-sky-400/5 group-hover:via-transparent group-hover:to-sky-400/5 transition-all duration-500 pointer-events-none"></div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg
                    className="w-8 h-8 text-sky-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={"/browse-tutors"}>
            <button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              Get Started Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
