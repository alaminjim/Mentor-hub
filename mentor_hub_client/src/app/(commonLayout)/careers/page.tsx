import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const CareersPage = () => {
  const jobs = [
    { title: "Senior Backend Engineer", location: "Remote", type: "Full-time", dept: "Engineering" },
    { title: "Product Designer", location: "New York, NY", type: "Full-time", dept: "Design" },
    { title: "Tutor Success Manager", location: "Remote", type: "Full-time", dept: "Operations" },
    { title: "Marketing Analyst", location: "London, UK", type: "Contract", dept: "Marketing" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-cyan-50/30 pt-40 md:pt-48 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">Join Our Mission</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            We're building the future of personalized education. If you're passionate about learning and technology, come build it with us.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-cyan-100/50 border border-cyan-100 mb-12">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-bold text-slate-800">Open Positions</h2>
            <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full">{jobs.length} jobs</span>
          </div>

          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-cyan-200 hover:shadow-md hover:shadow-cyan-100/50 transition-all bg-slate-50/50 hover:bg-white cursor-pointer">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="size-4" /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="size-4" /> {job.dept}</span>
                  </div>
                </div>
                <button className="mt-4 md:mt-0 size-10 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors shrink-0">
                  <ArrowRight className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
            <p className="text-slate-500 font-medium">Don't see a role that fits? <a href="/contact" className="text-cyan-600 font-bold hover:underline">Get in touch</a></p>
        </div>
      </div>
    </main>
  );
};

export default CareersPage;
