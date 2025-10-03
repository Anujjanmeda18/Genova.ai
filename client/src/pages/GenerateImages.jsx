import {
  Sparkles,
  Image,
  Download,
  Copy,
  RefreshCw,
  Check,
  Loader2,
  Wand2,
  Eye,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    { name: "Realistic", description: "Photo-realistic" },
    { name: "Anime", description: "Japanese anime" },
    { name: "Cartoon", description: "Cartoon style" },
    { name: "3D Render", description: "3D rendered" },
    { name: "Oil Painting", description: "Classic art" },
    { name: "Watercolor", description: "Soft painting" },
    { name: "Fantasy", description: "Magical theme" },
    { name: "Cyberpunk", description: "Futuristic tech" },
  ];

  const examplePrompts = [
    "A futuristic cityscape at sunset with flying cars",
    "A cute cat wearing a astronaut suit in space",
    "A mystical forest with glowing mushrooms and fireflies",
    "A modern minimalist living room with natural lighting",
  ];

  const [selectedStyle, setSelectedStyle] = useState(imageStyle[0].name);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      toast.error("Please describe your image");
      return;
    }

    try {
      setLoading(true);
      setContent("");

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt: input, style: selectedStyle, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Image generated successfully!");
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
    toast.success("Image URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleRegenerate = () => {
    if (input.trim()) {
      onSubmitHandler({ preventDefault: () => {} });
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto pb-8">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Image className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                AI Image Generator
              </h1>
            </div>
            <p className="text-gray-600">
              Transform your ideas into stunning visuals with AI
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)]">
            {/* Left Column: Configuration */}
            <div className="space-y-6 overflow-y-auto">
              <form
                onSubmit={onSubmitHandler}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Form Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">
                      Image Configuration
                    </h2>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                  {/* Prompt Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Describe Your Image
                    </label>
                    <div className="relative">
                      <textarea
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        rows={4}
                        className="w-full p-3 px-4 outline-none text-sm rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 resize-none"
                        placeholder="Describe what you want to see in the image..."
                        required
                      />
                      <Wand2 className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Example Prompts */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Try These Examples:
                    </p>
                    <div className="space-y-2">
                      {examplePrompts.map((prompt, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setInput(prompt)}
                          className="w-full text-left text-xs px-3 py-2 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Art Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {imageStyle.map((style) => (
                        <button
                          type="button"
                          onClick={() => setSelectedStyle(style.name)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            selectedStyle === style.name
                              ? "bg-green-50 border-green-500 shadow-md shadow-green-100"
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                          key={style.name}
                        >
                          <div
                            className={`text-sm font-semibold ${
                              selectedStyle === style.name
                                ? "text-green-700"
                                : "text-gray-700"
                            }`}
                          >
                            {style.name}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              selectedStyle === style.name
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {style.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Public Toggle */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Eye className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Make Public
                          </p>
                          <p className="text-xs text-gray-600">
                            Share with the community
                          </p>
                        </div>
                      </div>
                      <label className="relative cursor-pointer">
                        <input
                          type="checkbox"
                          onChange={(e) => setPublish(e.target.checked)}
                          checked={publish}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all duration-300 shadow-inner"></div>
                        <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-7 shadow-md"></span>
                      </label>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Image...</span>
                      </>
                    ) : (
                      <>
                        <Image className="w-5 h-5" />
                        <span>Generate Image</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Pro Tips for Better Results
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Be specific about details, colors, and mood</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>
                      Include lighting conditions for realistic images
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>
                      Experiment with different art styles for variety
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Combine multiple concepts for unique results</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Generated Image - scrollable */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden overflow-y-auto min-h-0 max-h-[600px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Image className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Generated Image</h2>
                  </div>

                  {content && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRegenerate}
                        disabled={loading}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
                        title="Regenerate"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                        />
                      </button>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                        title="Copy URL"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[500px] custom-scrollbar">
                {!content && !loading ? (
                  <div className="h-full flex flex-col justify-center items-center text-gray-400">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-green-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-center max-w-xs font-medium text-gray-600 mb-2">
                      Ready to Create Magic?
                    </p>
                    <p className="text-xs text-center max-w-xs text-gray-500">
                      Describe your image and click "Generate Image" to bring
                      your vision to life
                    </p>
                  </div>
                ) : loading ? (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-500 animate-pulse" />
                    </div>
                    <p className="text-gray-600 font-semibold text-lg mb-2">
                      Creating your masterpiece...
                    </p>
                    <p className="text-sm text-gray-500">
                      This may take 10-30 seconds
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col animate-fadeIn">
                    <div className="relative group rounded-xl overflow-y-auto max-h-[400px] shadow-2xl bg-black">
                      <img
                        src={content}
                        alt="Generated content"
                        className="w-full block"
                        style={{ maxHeight: "none" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

export default GenerateImages;
