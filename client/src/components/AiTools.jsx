import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowRightCircle } from "lucide-react";
import { useState } from "react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [toastVisible, setToastVisible] = useState(false);

  const handleClick = (path) => {
    if (!user) {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
      return;
    }
    navigate(path);
  };

  const handleKeyDown = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(path);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-16 xl:px-32 relative">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-1 drop-shadow">
          Explore Our AI Tools
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Boost productivity and creativity with smart AI solutions built to write, design, and analyze your content — effortlessly.
        </p>
      </div>
      {toastVisible && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-600 text-white py-2 px-6 rounded shadow-lg z-50 animate-fadeIn max-w-sm text-center">
          Please sign in to access this tool
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        {AiToolsData.map((tool) => (
          <div
            key={tool.title}
            className="group bg-white/95 p-8 rounded-2xl border border-gray-100 shadow-lg cursor-pointer flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 select-none"
            tabIndex={0}
            role="button"
            aria-label={`Navigate to ${tool.title} tool`}
            onClick={() => handleClick(tool.path)}
            onKeyDown={(e) => handleKeyDown(e, tool.path)}
          >
            <div
              className="w-12 h-12 mb-6 rounded-2xl flex items-center justify-center shadow"
              style={{ background: `linear-gradient(130deg, ${tool.bg.from}, ${tool.bg.to})` }}
            >
              <tool.Icon className="w-7 h-7 text-white drop-shadow" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900 text-center select-none">{tool.title}</h3>
            <p className="text-gray-500 text-base text-center mb-4 select-none">{tool.description}</p>
            <span className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ArrowRightCircle className="text-primary w-7 h-7 animate-bounce" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AiTools;
