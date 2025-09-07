import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="80"
        viewBox="0 0 300 80"
        fill="none"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="bold"
          fontSize="42"
          fill="#5044E5"
          className="cursor-pointer"
          onClick={() => navigate("/")}
        >
          Genova.ai
        </text>
      </svg>

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
        >
          Get started <ArrowRight className="w-4 h-4" />{" "}
        </button>
      )}
    </div>
  );
};

export default Navbar;
