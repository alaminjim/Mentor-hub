import { tutorService } from "@/components/service/tutor.service";
import { TutorCard } from "./tutorsCard";
import { TutorDataType } from "@/type/tutorDataTyp";

const TutorPage = async () => {
  const { data } = await tutorService.getTutors();

  const recentTutors = data
    ?.sort(
      (a: TutorDataType, b: TutorDataType) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div>
      <div className="text-center px-4 py-10 md:py-14">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0d3d54] tracking-tight">
          Meet Our Expert Tutors
        </h3>
        <p className="mt-3 text-sm md:text-base text-[#4a7a90] max-w-xl mx-auto leading-relaxed">
          Learn from experienced mentors who are passionate about helping you
          achieve your goals — at your own pace, on your schedule.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {recentTutors?.map((tutor: TutorDataType) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </div>
  );
};

export default TutorPage;
