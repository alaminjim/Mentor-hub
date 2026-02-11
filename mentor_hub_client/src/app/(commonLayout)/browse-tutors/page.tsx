import { tutorService } from "@/components/service/tutor.service";
import { TutorDataType } from "@/type/tutorDataTyp";
import { TutorCard } from "../tutorCard/tutorsCard";

export const dynamic = "force-dynamic";

const BrowseTutor = async () => {
  const { data } = await tutorService.getTutors();

  return (
    <div className="my-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {data?.map((tutor: TutorDataType) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </div>
  );
};

export default BrowseTutor;
