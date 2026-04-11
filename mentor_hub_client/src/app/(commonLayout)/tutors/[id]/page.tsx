import BookingForm from "@/components/bookings/page";
import { tutorService } from "@/components/service/tutor.service";
import { TutorDataType } from "@/type/tutorDataTyp";
import { cookies } from "next/headers";
import { env } from "../../../../../env";
import { BadgeCheck, Star, MapPin, Clock, BookOpen, Quote, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
const api_url = env.NEXT_PUBLIC_BACKEND_URL;

interface Category {
  id: string;
  name: string;
}

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
      <main className="container mx-auto px-6 py-20 text-center">
         <h1 className="text-3xl font-black text-slate-400 uppercase tracking-widest">Mentor Not Found</h1>
      </main>
    );
  }

  let userRole = "GUEST";
  let userId = "";
  let categories: Category[] = [];
  let discountPercentage = 0;

  try {
    const cookieStore = await cookies();
    const res = await fetch(`${api_url}/api/auth/authMe`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (res.ok) {
      const userData = await res.json();
      if (userData.data && userData.data.id) {
        userRole = userData.data.role || "GUEST";
        userId = userData.data.id;
        discountPercentage = userData.data.discountPercentage || 0;
      }
    }

    const catRes = await fetch(`${api_url}/api/category`, { cache: "no-store" });
    if (catRes.ok) {
      const catData = await catRes.json();
      categories = catData.data || catData || [];
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  const initials = data.name.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header Banner */}
      <div className="h-64 bg-slate-900 dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.1)_1px,_transparent_0)] bg-[size:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 -mt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Main Profile Header */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-start">
              <div className="relative shrink-0">
                <div className="size-40 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 overflow-hidden shadow-2xl">
                   {data.user?.image ? (
                     <img src={data.user.image} alt={data.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300 dark:text-slate-700">
                        {initials}
                     </div>
                   )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-2xl p-2 border-4 border-white dark:border-slate-900 shadow-lg">
                   <ShieldCheck className="size-6 text-white" />
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {data.name}
                      </h1>
                      <BadgeCheck className="size-6 text-primary" />
                    </div>
                    <p className="text-primary font-black uppercase text-xs tracking-[0.3em]">
                       {data.categories?.[0]?.name || "educational mentor"}
                    </p>
                  </div>
                  <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 px-6 py-3 rounded-3xl text-center">
                    <span className="text-3xl font-black text-primary tracking-tighter">৳{data.hourlyRate || data.price}</span>
                    <span className="text-[10px] font-black uppercase text-primary/60 block tracking-widest">per session</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 items-center py-6 border-y border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-2">
                      <Star className="size-5 text-amber-500 fill-amber-500" />
                      <span className="font-black text-slate-900 dark:text-white">{data.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400 uppercase font-black">({data.totalReviews || 0} reviews)</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock className="size-5 text-sky-500" />
                      <span className="font-black text-slate-900 dark:text-white">{data.experience}</span>
                      <span className="text-xs text-slate-400 uppercase font-black">years exp.</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <MapPin className="size-5 text-rose-500" />
                      <span className="font-black text-slate-900 dark:text-white uppercase text-xs">{data.location || "remote / global"}</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                   <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="size-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600">
                         <MapPin className="size-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</p>
                         <p className="text-sm font-black text-slate-700 dark:text-slate-300">{(data as any).phone || "+880 1XXX XXXXXX"}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="size-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                         <Star className="size-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</p>
                         <p className="text-sm font-black text-slate-700 dark:text-slate-300">{data.email || "mentor@hub.com"}</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-200 dark:border-slate-800 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
              <Quote className="absolute top-8 right-8 size-16 text-slate-100 dark:text-slate-800 -z-0" />
              <div className="relative z-10">
                <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                   About Mentor
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-black font-serif italic">
                  "{data.bio || "inspiring a new generation of leaders and thinkers through dedicated mentorship."}"
                </p>
              </div>
            </div>

            {/* Expertise & Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/30">
                      <BookOpen className="size-6" />
                   </div>
                   <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-3 relative z-10">
                  {data.subjects.map((subj, idx) => (
                    <span key={idx} className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                      {subj}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                      <Clock className="size-6" />
                   </div>
                   <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">Availability</h2>
                </div>
                {data.availability && Object.keys(data.availability).length > 0 ? (
                   <div className="space-y-4 relative z-10">
                      {Object.entries(data.availability).map(([day, times]) => (
                        <div key={day} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                           <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{day}</span>
                           <div className="flex flex-wrap gap-2">
                              {(times as string[]).map((time, tIdx) => (
                                <span key={tIdx} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">{time}</span>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                ) : (
                   <p className="text-xs font-black text-slate-400 uppercase italic">currently managed on request</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl border border-slate-200 dark:border-slate-800">
                <BookingForm
                  tutorId={data.id}
                  tutorName={data.name}
                  hourlyRate={(data.hourlyRate || data.price || 0) as number}
                  subjects={data.subjects}
                  userRole={userRole}
                  userId={userId}
                  categories={categories}
                  availability={data.availability || {}}
                  discountPercentage={discountPercentage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TutorDetailsPage;
