import React from 'react';

const TermsPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-cyan-50/30 pt-40 md:pt-48 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-cyan-100/50 border border-cyan-100">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight border-b border-slate-100 pb-8">Terms of Use</h1>
          
          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">By accessing or using the MentorHub platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">2. User Accounts</h2>
              <p className="mb-4">You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Tutor Responsibilities</h2>
              <p className="mb-4">Tutors on MentorHub operate as independent contractors. Tutors are responsible for the quality of their sessions, maintaining accurate availability, and ensuring all interactions comply with our community guidelines. MentorHub reserves the right to suspend or terminate tutor profiles that violate our standards.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Booking and Payments</h2>
              <p className="mb-4">All bookings made through the platform are final. Cancellations or rescheduling must be done in accordance with the specific policies set by the respective tutor or our default cancellation grace period (24 hours prior to session).</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Modifications</h2>
              <p className="mb-4">MentorHub may revise these Terms of Use at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Use.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsPage;
