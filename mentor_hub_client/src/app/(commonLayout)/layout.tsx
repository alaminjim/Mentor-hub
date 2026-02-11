import { ReactNode } from "react";
import Navbar from "./navbar/page";
import { Footer } from "./footer/page";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
