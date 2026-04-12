import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "./footer/page";
import Background3D from "@/components/animations/Background3D";
import { AIChatbot } from "@/components/shared/AIChatbot";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div suppressHydrationWarning className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Background3D />
      <Navbar />
      <main className="flex-grow relative z-10 pt-24 md:pt-32">
        {children}
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Layout;
