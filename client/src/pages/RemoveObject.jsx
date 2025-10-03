import {
  Scissors,
  Sparkles,
  Upload,
  Download,
  Copy,
  Check,
  Loader2,
  Image as ImageIcon,
  X,
  Info,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState(null);
  const [preview, setPreview] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { getToken } = useAuth();

  const exampleObjects = ["person", "car", "text", "watermark", "logo", "tree"];

  const handleFileChange = (file) => {
    if (file) {
      setInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setContent(""); // Clear previous result
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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleFileChange(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("Please upload an image first");
      return;
    }

    if (!object.trim()) {
      toast.error("Please describe the object to remove");
      return;
    }

    if (object.split(" ").length > 2) {
      toast.error("Please enter only one or two words");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Object removed successfully!");
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
      link.download = `object-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const clearImage = () => {
    setInput(null);
    setPreview("");
    setContent("");
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto pb-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Object Remover
              </h1>
            </div>
            <p className="text-gray-600">
              Remove unwanted objects from images with AI precision
            </p>
          </div>

          {/* Main Content Grid with fixed height for synced scroll */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)]">
            {/* Left Column: Configuration Form - scrollable */}
            <div className="space-y-6 overflow-y-auto">
              <form
                onSubmit={onSubmitHandler}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">
                      Object Removal Configuration
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Upload Area */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Upload Image
                    </label>

                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        dragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-input"
                      />

                      {!preview ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Drag & drop your image here
                            </p>
                            <p className="text-xs text-gray-500">or click to browse</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <ImageIcon className="w-4 h-4" />
                            <span>Supports JPG, PNG, WEBP</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group">
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-lg shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearImage();
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="mt-3 text-xs text-gray-600 font-medium">
                            {input?.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Object Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Object to Remove
                    </label>
                    <textarea
                      onChange={(e) => setObject(e.target.value)}
                      value={object}
                      rows={3}
                      className="w-full p-3 px-4 outline-none text-sm rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                      placeholder="e.g., person, car, logo, watermark..."
                      required
                    />
                    <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-800">
                        <strong>Tip:</strong> Use simple, specific terms (1-2 words). Examples: "person", "watermark", "car", "text"
                      </p>
                    </div>
                  </div>

                  {/* Quick Examples */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Quick Examples:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exampleObjects.map((obj, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setObject(obj)}
                          className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200"
                        >
                          {obj}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !input}
                    className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Removing Object...</span>
                      </>
                    ) : (
                      <>
                        <Scissors className="w-5 h-5" />
                        <span>Remove Object</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Pro Tips for Best Results
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Use clear, high-resolution images for better accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Describe objects with simple, specific terms (1-2 words)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Works best with distinct objects separate from the background</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>AI fills the area naturally based on surrounding context</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Result Image - scrollable with fixed height */}
            {/* Removed sticky/fixed position for synced scroll */}
            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden overflow-y-auto min-h-0 max-h-[600px]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Scissors className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Processed Image</h2>
                  </div>

                  {content && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                        title="Copy URL"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
              <div className="flex-1 p-6 overflow-y-auto">
                {!content && !loading ? (
                  <div className="h-full flex flex-col justify-center items-center text-gray-400">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                      <Scissors className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-center max-w-xs font-medium text-gray-600 mb-2">
                      Ready to Clean Up?
                    </p>
                    <p className="text-xs text-center max-w-xs text-gray-500">
                      Upload an image, describe the object, and let AI remove it seamlessly
                    </p>
                  </div>
                ) : loading ? (
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-pulse" />
                    </div>
                    <p className="text-gray-600 font-semibold text-lg mb-2">
                      Removing object...
                    </p>
                    <p className="text-sm text-gray-500">AI is analyzing and processing your image</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full space-y-4 animate-fadeIn">
                    {/* Comparison View */}
                    {preview && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Before</p>
                          <div className="relative rounded-lg overflow-hidden shadow-md">
                            <img src={preview} alt="Before" className="w-full h-auto" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">After</p>
                          <div className="relative rounded-lg overflow-hidden shadow-md">
                            <img src={content} alt="After" className="w-full h-auto" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Large Preview */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Final Result</p>
                      <div className="relative group rounded-xl overflow-hidden shadow-2xl">
                        <img
                          src={content}
                          alt="Processed"
                          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>

                    {/* Success Message */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <Check className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Object removed successfully!</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Removed: <span className="font-semibold">{object}</span>
                      </p>
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

export default RemoveObject;
