import React from 'react';
import { Handshake, Building2, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PartnersPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-cyan-50/30 pt-40 md:pt-48 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">Partner with MentorHub</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Join forces with us to empower students and professionals worldwide through high-quality personalized education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-[2rem] border border-cyan-100 shadow-xl shadow-cyan-100/30 text-center">
                <div className="size-16 mx-auto bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mb-6">
                    <Building2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Universities</h3>
                <p className="text-slate-500 font-medium text-sm">Provide your students with premier 1-on-1 access to our global network of experts to supplement their coursework.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-cyan-100 shadow-xl shadow-cyan-100/30 text-center">
                <div className="size-16 mx-auto bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mb-6">
                    <Handshake className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Enterprise</h3>
                <p className="text-slate-500 font-medium text-sm">Upskill your current workforce with targeted mentorship from industry veterans tailored to your company's stack.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-cyan-100 shadow-xl shadow-cyan-100/30 text-center">
                <div className="size-16 mx-auto bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center mb-6">
                    <Globe className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Affiliates</h3>
                <p className="text-slate-500 font-medium text-sm">Spread the word about MentorHub and earn substantial commission for every student or tutor you successfully refer.</p>
            </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-sky-500 rounded-[2rem] p-10 md:p-16 text-center text-white shadow-xl shadow-cyan-500/20">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Ready to collaborate?</h2>
            <p className="text-cyan-50 font-medium max-w-xl mx-auto mb-8">Reach out to our partnerships team to discuss how we can work together to build the future of education.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold hover:bg-cyan-50 transition-colors shadow-lg">
                Contact Partnership Team
                <ArrowRight className="size-4" />
            </Link>
        </div>
      </div>
    </main>
  );
};

export default PartnersPage;
