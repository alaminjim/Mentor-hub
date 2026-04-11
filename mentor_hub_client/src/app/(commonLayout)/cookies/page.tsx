import React from 'react';

const CookiesPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-cyan-50/30 pt-40 md:pt-48 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-cyan-100/50 border border-cyan-100">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight border-b border-slate-100 pb-8">Cookie Policy</h1>
          
          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">1. What are cookies?</h2>
              <p className="mb-4">Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information and personalized experiences.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">2. How we use cookies</h2>
              <p className="mb-4">We use cookies and similar tracking technologies to track activity on our service and hold certain information. Specifically, we use them for:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Strictly Necessary Cookies:</strong> Required to enable core site functionality like secure login.</li>
                <li><strong>Performance Cookies:</strong> Allow us to analyze site usage so we can measure and improve performance.</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings, such as your timezone or logged-in status.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Third-party cookies</h2>
              <p className="mb-4">In some special cases, we also use cookies provided by trusted third parties. This includes analytics services like Google Analytics that help us understand how you use the site and ways that we can improve your experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Managing cookies</h2>
              <p className="mb-4">You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of the MentorHub platform may become inaccessible or not function properly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Contact us</h2>
              <p>For more information about our use of cookies, please contact us at privacy@mentorhub.com.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CookiesPage;
