import React from 'react';

const PrivacyPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-cyan-50/30 pt-40 md:pt-48 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-cyan-100/50 border border-cyan-100">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight border-b border-slate-100 pb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Information We Collect</h2>
              <p className="mb-4">We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, and other information you choose to provide.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We may use the information we collect about you to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Provide, keep, and better our services</li>
                <li>Perform internal operations, including troubleshooting</li>
                <li>Send or facilitate communications between you and a tutor</li>
                <li>Communicate with you about products, services, promotions, and updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Data Security</h2>
              <p className="mb-4">We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. All payment details are securely processed by our payment partners and are not stored directly on our servers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@mentorhub.com.</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPage;
