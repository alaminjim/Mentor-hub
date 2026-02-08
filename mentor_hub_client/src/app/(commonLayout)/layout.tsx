import { ReactNode } from "react";
import Navbar from "./navbar/page";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
