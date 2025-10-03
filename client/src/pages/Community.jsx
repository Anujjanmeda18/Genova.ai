import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Heart, Sparkles, Users, TrendingUp, Filter, Search, Grid3x3, Grid2x2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [filteredCreations, setFilteredCreations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [gridSize, setGridSize] = useState("large");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
        setFilteredCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  // Filter and search logic
  useEffect(() => {
    let filtered = creations;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // Search by prompt
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCreations(filtered);
  }, [searchQuery, filterType, creations]);

  const stats = {
    total: creations.length,
    totalLikes: creations.reduce((sum, c) => sum + (c.likes?.length || 0), 0),
    trending: creations.filter((c) => (c.likes?.length || 0) > 5).length,
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto pb-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Community Gallery
              </h1>
            </div>
            <p className="text-gray-600">Discover amazing creations from our community</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Creations</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                <p className="text-sm text-gray-600">Total Likes</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.trending}</p>
                <p className="text-sm text-gray-600">Trending</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="flex-1 w-full sm:w-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search creations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filters and View Toggle */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex gap-2 flex-1 sm:flex-none">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      filterType === "all"
                        ? "bg-purple-500 text-white shadow-lg shadow-purple-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType("image")}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      filterType === "image"
                        ? "bg-purple-500 text-white shadow-lg shadow-purple-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Images
                  </button>
                </div>

                {/* Grid Size Toggle */}
                <div className="flex gap-2 border-l pl-2 border-gray-200">
                  <button
                    onClick={() => setGridSize("large")}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      gridSize === "large"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Large grid"
                  >
                    <Grid2x2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setGridSize("small")}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      gridSize === "small"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Small grid"
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredCreations.length}</span> creation
              {filteredCreations.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-500" />
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading community creations...</p>
            </div>
          ) : filteredCreations.length > 0 ? (
            <div
              className={`grid gap-4 ${
                gridSize === "large"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              }`}
            >
              {filteredCreations.map((creation, index) => (
                <div
                  key={creation.id || index}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={creation.content}
                      alt={creation.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm font-medium line-clamp-2 mb-3">
                          {creation.prompt}
                        </p>

                        {/* Like Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs text-white/90">
                              {creation.creator?.name || "Anonymous"}
                            </span>
                          </div>

                          <button
                            onClick={() => imageLikeToggle(creation.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
                          >
                            <Heart
                              className={`w-4 h-4 transition-all duration-200 ${
                                creation.likes?.includes(user?.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-white"
                              }`}
                            />
                            <span className="text-white text-sm font-medium">
                              {creation.likes?.length || 0}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Bar (Always Visible) */}
                  <div className="p-3 flex items-center justify-between bg-white">
                    <p className="text-xs text-gray-600 truncate flex-1">
                      {creation.prompt}
                    </p>
                    <button
                      onClick={() => imageLikeToggle(creation.id)}
                      className="flex items-center gap-1 ml-2 flex-shrink-0"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-200 hover:scale-110 ${
                          creation.likes?.includes(user?.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                      <span className="text-xs font-medium text-gray-600">
                        {creation.likes?.length || 0}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-32 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No creations found</h3>
              <p className="text-gray-600 text-center max-w-md">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Be the first to share your creation with the community!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
