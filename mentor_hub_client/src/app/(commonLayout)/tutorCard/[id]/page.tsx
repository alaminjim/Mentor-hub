import { tutorService } from "@/components/service/tutor.service";
import { TutorDataType } from "@/type/tutorDataTyp";

const TutorDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const { data }: { data: TutorDataType | null } =
    await tutorService.getTutorById(id);

  if (!data) {
    return (
      <main className="container mx-auto px-6 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground/70">
            Tutor not found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-cyan-50/30">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {data.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
              <p className="text-gray-600 mt-1">
                {data.experience} years experience
              </p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(data.rating) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {data.rating.toFixed(1)} ({data.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500 text-white rounded-2xl px-6 py-4 text-center shadow-lg">
            <div className="text-4xl font-bold">৳{data.price}</div>
            <div className="text-sm mt-1">/session</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
          <p className="text-gray-600 leading-relaxed">
            {data.bio || "No bio available"}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
              Subjects
            </span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.subjects.map((subj, idx) => (
              <span
                key={idx}
                className="rounded-full bg-cyan-100 border border-cyan-200 px-4 py-2 text-sm font-medium text-cyan-700"
              >
                {subj}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
            Availability
          </h2>
          {data.availability && Object.keys(data.availability).length > 0 ? (
            <div className="bg-cyan-50/50 rounded-2xl p-6 space-y-3 border border-cyan-100">
              {Object.entries(data.availability).map(([day, times]) => (
                <div key={day} className="flex items-start gap-4">
                  <span className="text-sm font-bold text-cyan-700 min-w-[60px] uppercase">
                    {day}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {times.map((time, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-cyan-600 text-white px-3 py-1.5 text-sm font-medium shadow-sm"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-200">
              No availability set
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Hourly Rate</p>
            <p className="text-2xl font-bold text-cyan-600">
              ৳{data.hourlyRate}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Experience</p>
            <p className="text-2xl font-bold text-cyan-600">
              {data.experience} years
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-cyan-600">
              {data.totalReviews}
            </p>
          </div>
        </div>

        <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg">
          BOOK A SESSION
        </button>
      </div>
    </main>
  );
};

export default TutorDetailsPage;
