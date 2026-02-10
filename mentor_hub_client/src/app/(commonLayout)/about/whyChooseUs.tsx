import {
  Shield,
  Clock,
  Award,
  Users,
  Headphones,
  TrendingUp,
} from "lucide-react";
import { statsService } from "@/components/service/stats.service";
import { StatsDataType } from "@/type/statsType";

export default async function WhyChooseUs() {
  const { data: stats } = await statsService.getStats();

  const defaultStats: StatsDataType = {
    totalTutors: 0,
    totalStudents: 0,
    totalSessions: 0,
    averageRating: 0,
  };

  const statsData = stats || defaultStats;

  const features = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Verified Tutors",
      description:
        "All our tutors are thoroughly vetted and verified to ensure quality education.",
      color: "from-sky-400 to-cyan-500",
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: "Flexible Scheduling",
      description:
        "Book sessions at your convenience with 24/7 availability and easy rescheduling.",
      color: "from-cyan-400 to-teal-500",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Expert Instructors",
      description:
        "Learn from experienced professionals with proven track records in their fields.",
      color: "from-teal-400 to-emerald-500",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Personalized Learning",
      description:
        "One-on-one sessions tailored to your learning style and pace for maximum results.",
      color: "from-emerald-400 to-green-500",
    },
    {
      icon: <Headphones className="w-7 h-7" />,
      title: "24/7 Support",
      description:
        "Get help whenever you need it with our dedicated customer support team.",
      color: "from-violet-400 to-purple-500",
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed reports and performance analytics.",
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="bg-sky-100 text-sky-600 text-sm font-semibold px-4 py-2 rounded-full">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The{" "}
            <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              Best Choice
            </span>{" "}
            for Your Learning
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Discover why thousands of students trust us for their educational
            journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white to-sky-50/30 rounded-2xl p-6 sm:p-8 shadow-sm border border-sky-100/50 hover:shadow-xl hover:border-sky-200 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-sky-400/10 to-transparent rounded-bl-full rounded-tr-2xl"></div>

              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
                {feature.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed relative z-10">
                {feature.description}
              </p>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/0 via-sky-400/0 to-sky-400/0 group-hover:from-sky-400/5 group-hover:via-transparent group-hover:to-sky-400/5 transition-all duration-500 pointer-events-none"></div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center p-6 bg-gradient-to-br from-sky-50 to-cyan-50/50 rounded-2xl border border-sky-100">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {statsData.totalTutors > 0
                ? `${statsData.totalTutors.toLocaleString()}+`
                : "0"}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Expert Tutors
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-teal-50/50 rounded-2xl border border-cyan-100">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
              {statsData.totalStudents > 0
                ? `${statsData.totalStudents.toLocaleString()}+`
                : "0"}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Happy Students
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-2xl border border-teal-100">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {statsData.totalSessions > 0
                ? `${statsData.totalSessions.toLocaleString()}+`
                : "0"}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Sessions Booked
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50/50 rounded-2xl border border-emerald-100">
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              {statsData.averageRating > 0
                ? `${statsData.averageRating.toFixed(1)}/5`
                : "0/5"}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">
              Average Rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
