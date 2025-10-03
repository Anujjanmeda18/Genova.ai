import {
  FileText,
  Sparkles,
  Upload,
  Download,
  Copy,
  Check,
  Loader2,
  Award,
  TrendingUp,
  Target,
  X,
  AlertCircle,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { getToken } = useAuth();

  const handleFileChange = (file) => {
    if (file) {
      if (file.type === "application/pdf") {
        setInput(file);
        setFileName(file.name);
        setContent(""); // Clear previous result
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("Please upload your resume first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume reviewed successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Feedback copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `resume-review-${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Feedback downloaded!");
  };

  const clearFile = () => {
    setInput(null);
    setFileName("");
    setContent("");
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30">
      <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto pb-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                AI Resume Review
              </h1>
            </div>
            <p className="text-gray-600">
              Get expert AI feedback to improve your resume and land interviews
            </p>
          </div>

          {/* Main Content Grid with height constraint for sync scroll */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)]">
            {/* Left Column: Upload Form - scrollable */}
            <div className="space-y-6 overflow-y-auto">
              <form
                onSubmit={onSubmitHandler}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Upload Your Resume</h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Drag and Drop Area */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Resume File
                    </label>

                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        dragActive
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-300 hover:border-teal-400 hover:bg-teal-50/50"
                      }`}
                    >
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-input"
                      />

                      {!fileName ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-teal-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Drag & drop your resume here
                            </p>
                            <p className="text-xs text-gray-500">or click to browse</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FileText className="w-4 h-4" />
                            <span>PDF format only</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {fileName}
                              </p>
                              <p className="text-xs text-gray-600">{input && (input.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFile();
                            }}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-start gap-2 p-3 bg-teal-50 rounded-lg border border-teal-200">
                      <AlertCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-teal-800">
                        Upload your resume in PDF format for the most accurate analysis. Our AI will review formatting, content, keywords, and more.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !input}
                    className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing Resume...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>Review Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* What We Analyze Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  What We Analyze
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Content Quality */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Content Quality</p>
                      <p className="text-xs text-gray-600 mt-1">Experience, skills, achievements</p>
                    </div>
                  </div>
                  {/* Formatting */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Formatting</p>
                      <p className="text-xs text-gray-600 mt-1">Layout, sections, readability</p>
                    </div>
                  </div>
                  {/* Keywords */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Keywords</p>
                      <p className="text-xs text-gray-600 mt-1">ATS optimization, industry terms</p>
                    </div>
                  </div>
                  {/* Impact */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Impact</p>
                      <p className="text-xs text-gray-600 mt-1">Measurable results, action verbs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 p-6">
                <h3 className="text-sm font-semibold text-teal-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Tips for Best Results
                </h3>
                <ul className="space-y-2 text-sm text-teal-800">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Ensure your PDF is text-based, not scanned images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Include all sections: experience, education, skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Keep file size under 5MB for optimal processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Use standard resume formatting (no graphics-heavy designs)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Analysis Results - no sticky, scrollable */}
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden overflow-y-auto min-h-0 max-h-[600px]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-teal-600 p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Analysis Results</h2>
                  </div>

                  {content && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                        title="Copy feedback"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                        title="Download feedback"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {!content && !loading ? (
                  <div className="h-full flex flex-col justify-center items-center text-gray-400">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-center max-w-xs font-medium text-gray-600 mb-2">
                      Ready to Boost Your Resume?
                    </p>
                    <p className="text-xs text-center max-w-xs text-gray-500">
                      Upload your resume and get instant AI-powered feedback to improve your chances
                    </p>
                  </div>
                ) : loading ? (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-teal-500 animate-pulse" />
                    </div>
                    <p className="text-gray-600 font-semibold text-lg mb-2">Analyzing your resume...</p>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                      Our AI is reviewing formatting, content, keywords, and providing actionable feedback
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <div className="mb-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                      <div className="flex items-center gap-2 text-sm text-teal-800 mb-2">
                        <Check className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold">Analysis Complete!</span>
                      </div>
                      <p className="text-xs text-teal-700">
                        Review the detailed feedback below to enhance your resume
                      </p>
                    </div>

                    <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-teal-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:marker:text-teal-500 prose-code:text-teal-600 prose-code:bg-teal-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                      <Markdown>{content}</Markdown>
                    </div>
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

export default ReviewResume;
