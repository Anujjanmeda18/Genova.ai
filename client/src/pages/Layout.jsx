import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useUser, SignIn } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  // Prevent body scroll when sidebar open on small screens
  useEffect(() => {
    if (sidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebar]);

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="50"
          viewBox="0 0 200 50"
          fill="none"
        >
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="bold"
            fontSize="28"
            fill="#5044E5"
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            Genova.ai
          </text>
        </svg>

        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>

      <div className="flex-1 w-full flex h-[calc(100vh-64px)] relative">
        {/* Sidebar panel for small screens: fixed and slides in/out */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        {/* Main content shifts right when sidebar is open on small screens */}
        <div
          className={`flex-1 bg-[#F4F7FB] transition-all duration-300 ease-in-out relative z-0
            ${sidebar ? "translate-x-60" : "translate-x-0"} 
            sm:translate-x-0 sm:ml-0`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
