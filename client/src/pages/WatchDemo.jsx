import React from "react";
import { Sparkles, Play } from "lucide-react";

const DemoPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-16 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 text-center space-y-10">
      <Sparkles className="text-purple-700 w-12 h-12 animate-pulse" />
      <h1 className="text-5xl font-extrabold leading-tight text-gray-900 max-w-4xl">
        Discover the Power of <span className="text-primary">Genova.ai</span>
      </h1>
      <p className="max-w-3xl text-gray-700 text-lg font-medium">
        Experience the magic of AI-driven content creation with our smart tools 
        that help you write, design, and optimize faster and smarter than ever.
      </p>
      <button
        onClick={() => window.location.href = "/ai"}
        className="group relative inline-flex items-center justify-center px-14 py-4 rounded-full bg-primary text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-200"
      >
        <Play className="w-6 h-6 mr-3 animate-pulse group-hover:animate-spin" />
        Start Creating Now
      </button>

      <div className="max-w-5xl bg-white rounded-3xl p-10 shadow-2xl space-y-8">
        <Feature title="Write Smarter" description="Generate high-quality, human-like articles, blogs, and titles with advanced AI assistance." />
        <Feature title="Design Beautifully" description="Create eye-catching visuals and graphics effortlessly in your desired style." />
        <Feature title="Analyze Efficiently" description="Get insightful analysis to optimize your content and improve your workflow." />
      </div>
    </div>
  );
};

const Feature = ({ title, description }) => (
  <div>
    <h2 className="text-2xl font-semibold text-purple-700 mb-2">{title}</h2>
    <p className="text-gray-600 text-base">{description}</p>
  </div>
);

export default DemoPage;
