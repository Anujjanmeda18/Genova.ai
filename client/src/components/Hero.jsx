import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col justify-center items-center text-center w-full min-h-[80vh] pt-32 pb-16 bg-gradient-to-br from-indigo-50 via-[#f8e7fa] to-white overflow-hidden">
      {/* Modern animated shape/micro-deco */}
      <div
        className="absolute left-0 top-0 w-1/3 h-full mix-blend-multiply opacity-30 blur-2xl z-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 10%, #8d55f5 10%, transparent 80%)",
        }}
      />
      <div
        className="absolute right-[-100px] bottom-0 w-2/6 h-2/3 opacity-30 blur-2xl z-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 80%, #00c6d6 20%, transparent 80%)",
        }}
      />

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Create stunning content <br />
          with{" "}
          <span
            spellCheck={false}
            className="text-primary"
          >
            AI-powered tools
          </span>
        </h1>
        <p className="max-w-xl mx-auto mt-6 text-lg text-gray-600 md:text-xl font-medium">
          Unlock the future of content creation. Generate articles, design
          visuals, and streamline your workflow — with the magic of AI.
        </p>
        <div className="mt-10 flex w-full flex-wrap justify-center gap-4 text-base font-medium">
          <button
            onClick={() => navigate("/ai")}
            className="bg-gradient-to-r from-[#5044E5] to-[#8C7CFF] shadow-lg shadow-purple-100 hover:scale-105 active:scale-95 transition-transform duration-200 text-white px-10 py-3 rounded-full flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Start Creating
          </button>
          <button 
          onClick={() => navigate("/demo")}
          className="bg-white px-10 py-3 rounded-full border border-gray-200 hover:scale-105 active:scale-95 transition-transform duration-200 shadow-sm text-[#5044E5]">
            Watch Demo
          </button>
        </div>
        <div className="mt-10 flex items-center justify-center gap-4 text-gray-500 font-medium text-base mx-auto">
          <img src={assets.user_group} alt="Users" className="h-8" />
          <span>
            Trusted by <span className="font-semibold text-primary">100k+</span>{" "}
            content creators
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
