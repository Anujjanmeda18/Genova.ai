import {
  Sparkles,
  Edit,
  Copy,
  Download,
  RefreshCw,
  Wand2,
  Check,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short", description: "500-800 words" },
    { length: 1200, text: "Medium", description: "800-1200 words" },
    { length: 1600, text: "Long", description: "1200+ words" },
  ];

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "creative", label: "Creative" },
    { value: "informative", label: "Informative" },
  ];

  const examplePrompts = [
    "The future of artificial intelligence in healthcare",
    "Sustainable living tips for modern families",
    "Understanding blockchain technology",
    "Benefits of remote work in 2025",
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [selectedTone, setSelectedTone] = useState(toneOptions[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      setContent("");

      const prompt = `Write a ${selectedTone.label.toLowerCase()} article about ${input} in ${
        selectedLength.text
      } format (${selectedLength.description})`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        {
          prompt,
          length: selectedLength.length,
          tone: selectedTone.value,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
        setWordCount(data.content.split(/\s+/).length);
        toast.success("Article generated successfully!");
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
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `article-${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Article downloaded!");
  };

  const handleRegenerate = () => {
    if (input.trim()) {
      onSubmitHandler({ preventDefault: () => {} });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto pb-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl 
                flex items-center justify-center shadow-lg"
              >
                <Edit className="w-5 h-5 text-white" />
              </div>
              AI Article Writer
            </h1>
            <p className="text-gray-600">
              Generate high-quality articles with AI assistance
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)]">
            {/* Left Column - Configuration */}
            <div className="space-y-6 overflow-y-auto">
              {/* Configuration Card */}
              <form
                onSubmit={onSubmitHandler}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md 
                  transition-shadow duration-300 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Article Configuration</h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Topic Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Article Topic
                    </label>
                    <div className="relative">
                      <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        className="w-full p-3 px-4 outline-none text-sm rounded-xl border-2 
                          border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 
                          transition-all duration-200"
                        placeholder="e.g., The future of artificial intelligence..."
                        required
                      />
                      <Wand2
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 
                          w-5 h-5 text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Example Prompts */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Quick Examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {examplePrompts.map((example, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setInput(example)}
                          className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-blue-50 
                            text-gray-600 hover:text-blue-600 rounded-lg border border-gray-200 
                            hover:border-blue-300 transition-all duration-200"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Article Length */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Article Length
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {articleLength.map((item, index) => (
                        <button
                          type="button"
                          onClick={() => setSelectedLength(item)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 
                            ${
                              selectedLength.text === item.text
                                ? "bg-blue-50 border-blue-500 shadow-md shadow-blue-100"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          key={index}
                        >
                          <div
                            className={`text-sm font-semibold ${
                              selectedLength.text === item.text
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {item.text}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              selectedLength.text === item.text
                                ? "text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            {item.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Writing Tone
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {toneOptions.map((tone, index) => (
                        <button
                          type="button"
                          onClick={() => setSelectedTone(tone)}
                          className={`p-3 rounded-xl border-2 text-sm font-medium 
                            transition-all duration-200 ${
                              selectedTone.value === tone.value
                                ? "bg-purple-50 border-purple-500 text-purple-700 shadow-md shadow-purple-100"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          key={index}
                        >
                          {tone.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-3 
                      bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 
                      hover:to-purple-700 text-white px-6 py-4 rounded-xl font-semibold 
                      shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 
                      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Article...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Article</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Stats Card (Only show when content exists) */}
              {content && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Article Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{wordCount}</div>
                      <div className="text-xs text-gray-500 mt-1">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.ceil(wordCount / 200)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Min Read</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {content.split("\n\n").length}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Paragraphs</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Generated Content */}
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md 
              transition-shadow duration-300 flex flex-col overflow-hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Edit className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Generated Article</h2>
                  </div>

                  {content && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRegenerate}
                        disabled={loading}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 
                        transition-all duration-200 disabled:opacity-50"
                        title="Regenerate"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                        />
                      </button>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 
                        transition-all duration-200"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 
                        transition-all duration-200"
                        title="Download article"
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
                    <div
                      className="w-20 h-20 bg-gray-100 rounded-full flex items-center 
                      justify-center mb-4"
                    >
                      <Edit className="w-10 h-10" />
                    </div>
                    <p className="text-sm text-center max-w-xs">
                      Enter a topic and click "Generate Article" to get started
                    </p>
                  </div>
                ) : loading ? (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="relative">
                      <div
                        className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 
                        rounded-full animate-spin"
                      />
                      <Sparkles
                        className="absolute top-1/2 left-1/2 transform 
                        -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-500"
                      />
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Crafting your article...</p>
                    <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
                  </div>
                ) : (
                  <div
                    className="prose prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 
                    prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900
                    prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700
                    prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1.5 
                    prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 
                    prose-pre:shadow-lg animate-fadeIn"
                  >
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

export default WriteArticle;
