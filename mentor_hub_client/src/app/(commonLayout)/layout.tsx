import { ReactNode } from "react";
import Navbar from "./navbar/page";
import { Footer } from "./footer/page";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
