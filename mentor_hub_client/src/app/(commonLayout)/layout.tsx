import { ReactNode } from "react";
import Navbar from "./navbar/page";
import Footer from "./footer/page";
import Background3D from "@/components/animations/Background3D";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div suppressHydrationWarning className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Background3D />
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
