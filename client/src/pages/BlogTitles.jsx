import React, { useState } from "react";
import {
  Sparkles,
  Hash,
  Copy,
  Download,
  RefreshCw,
  Check,
  Loader2,
  Wand2,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitle = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const exampleKeywords = [
    "AI in healthcare",
    "Remote work productivity",
    "Sustainable fashion",
    "Digital marketing trends",
  ];

  // Selected blog category state
  const [selectedCategory, setSelectedCategory] = useState("General");
  // Input keyword/topic state
  const [input, setInput] = useState("");
  // Loading state during API request
  const [loading, setLoading] = useState(false);
  // Generated titles content
  const [content, setContent] = useState("");
  // Clipboard copy feedback state
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  // Form submission handler to generate blog titles
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    try {
      setLoading(true);
      setContent("");

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt: input, category: selectedCategory },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Titles generated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  // Copy generated content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Download generated content as a text file
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `blog-titles-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Titles downloaded!");
  };

  // Regenerate titles by re-calling the submit handler
  const handleRegenerate = () => {
    if (input.trim()) {
      onSubmitHandler({ preventDefault: () => {} });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto pb-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Hash className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                AI Title Generator
              </h1>
            </div>
            <p className="text-gray-600">Create catchy, SEO-optimized blog titles instantly</p>
          </div>

          {/* Main Content Grid */}
          {/* 
            Apply a height limit to the grid container based on the viewport height minus header/footer space.
            This allows us to have scrollable left and right columns of equal height.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)]">
            {/* Left Column: Configuration form - scrollable */}
            <div className="space-y-6 overflow-y-auto">
              <form
                onSubmit={onSubmitHandler}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Title Configuration</h2>
                  </div>
                </div>

                {/* Form content */}
                <div className="p-6 space-y-6">
                  {/* Keyword Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Keyword or Topic
                    </label>
                    <div className="relative">
                      <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        className="w-full p-3 px-4 outline-none text-sm rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                        placeholder="e.g., sustainable living, AI technology..."
                        required
                      />
                      <Wand2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Example Keywords */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Quick Examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {exampleKeywords.map((keyword, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setInput(keyword)}
                          className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-lg border border-gray-200 hover:border-purple-300 transition-all duration-200"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Blog Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {blogCategories.map((category) => (
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                            selectedCategory === category
                              ? "bg-purple-50 border-purple-500 text-purple-700 shadow-md shadow-purple-100"
                              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                          key={category}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Titles...</span>
                      </>
                    ) : (
                      <>
                        <Hash className="w-5 h-5" />
                        <span>Generate Titles</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
                <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Use specific keywords for better results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Select the right category to match your audience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Generate multiple times for more options</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Generated Titles - scrollable */}
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Hash className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Generated Titles</h2>
                  </div>

                  {content && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRegenerate}
                        disabled={loading}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
                        title="Regenerate"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                      </button>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                        title="Download titles"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 min-h-0">
                {!content && !loading ? (
                  <div className="h-full flex flex-col justify-center items-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Hash className="w-10 h-10" />
                    </div>
                    <p className="text-sm text-center max-w-xs">
                      Enter a keyword and click "Generate Titles" to get started
                    </p>
                  </div>
                ) : loading ? (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-500" />
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Creating catchy titles...</p>
                    <p className="mt-2 text-sm text-gray-500">This will just take a moment</p>
                  </div>
                ) : (
                  <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:marker:text-purple-500 animate-fadeIn">
                    <Markdown>{content}</Markdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTitle;
