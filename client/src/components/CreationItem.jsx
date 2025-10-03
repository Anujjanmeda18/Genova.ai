import React, { useState } from "react";
import Markdown from "react-markdown";
import { ChevronDown, Calendar, Sparkles, Image as ImageIcon } from "lucide-react";

const CreationItem = ({ item }) => {
  const [expand, setExpand] = useState(false);

  const typeConfig = {
    image: {
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
      borderLight: "border-purple-200",
      textColor: "text-purple-700",
      icon: ImageIcon
    },
    text: {
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      borderLight: "border-blue-200",
      textColor: "text-blue-700",
      icon: Sparkles
    }
  };

  const config = typeConfig[item.type] || typeConfig.text;
  const Icon = config.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-200 
        transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300
        ${expand ? 'shadow-lg' : 'shadow-sm'}`}
    >
      {/* Gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.color}`} />
      
      <div
        onClick={() => setExpand(!expand)}
        className="p-5 sm:p-6 cursor-pointer"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} 
                flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                  {item.prompt}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.bgLight} 
              ${config.borderLight} ${config.textColor} border capitalize`}>
              {item.type}
            </span>
            <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
              transition-transform duration-300 ${expand ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded content with smooth animation */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out
        ${expand ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 sm:px-6 pb-6 pt-2">
          <div className="border-t border-gray-100 pt-5">
            {item.type === "image" ? (
              <div className="relative group/image">
                <img
                  src={item.content}
                  alt="Generated content"
                  className="w-full max-w-2xl mx-auto rounded-xl shadow-lg 
                    transition-transform duration-300 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                  opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
            ) : (
              <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 
                prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900
                prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1.5 
                prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 
                prose-pre:shadow-lg max-h-[600px] overflow-y-auto custom-scrollbar">
                <Markdown>{item.content}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationItem;
