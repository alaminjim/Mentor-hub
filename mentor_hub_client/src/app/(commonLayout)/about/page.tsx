import WhyChooseUs from "./whyChooseUs";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 sm:py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Our{" "}
            <span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              Mentor_Hub
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Discover educational insights, learning tips, and success stories
          </p>
        </div>
      </section>

      <WhyChooseUs />

      <section className="py-16 bg-gradient-to-b from-white to-sky-50/30">
        <div className="container mx-auto px-6 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Tutor Posts Coming Soon
          </h2>
          <p className="text-gray-500">
            We're working on amazing content for you!
          </p>
        </div>
      </section>
    </main>
  );
}
