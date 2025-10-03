import React, { useState, useEffect } from "react";
import { Sparkles, Gem, TrendingUp, Zap, Search } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const filteredCreations = creations.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
    <div
      className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 
        shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 
        hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <Icon className="w-full h-full text-gray-900" />
      </div>
      
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} 
            flex items-center justify-center shadow-lg group-hover:scale-110 
            transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Active</span>
        </div>
      </div>
      
      <div className={`h-1 bg-gradient-to-r ${gradient} transform scale-x-0 
        group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back! 👋
              </h1>
              <p className="text-gray-600">Here's what's happening with your creations today</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Creations"
              value={creations.length}
              icon={Sparkles}
              gradient="from-blue-500 to-cyan-500"
              delay={0}
            />
            
            <StatCard
              title="This Month"
              value={creations.filter(c => 
                new Date(c.created_at).getMonth() === new Date().getMonth()
              ).length}
              icon={Zap}
              gradient="from-purple-500 to-pink-500"
              delay={100}
            />

            <StatCard
              title="Images Generated"
              value={creations.filter(c => c.type === "image").length}
              icon={Sparkles}
              gradient="from-orange-500 to-red-500"
              delay={200}
            />

            <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 
              to-pink-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
              hover:-translate-y-1">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-white/90 mb-1">Active Plan</p>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      <Protect plan="premium" fallback="Free">
                        Premium
                      </Protect>
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center 
                    justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Gem className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Active Subscription</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your creations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 
                    ${filterType === "all" 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("image")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 
                    ${filterType === "image" 
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Images
                </button>
                <button
                  onClick={() => setFilterType("text")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 
                    ${filterType === "text" 
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Text
                </button>
              </div>
            </div>
          </div>

          {/* Creations List */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 bg-white rounded-2xl 
              border border-gray-200 shadow-sm">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full 
                  animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 
                  -translate-y-1/2 w-6 h-6 text-blue-500" />
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading your creations...</p>
            </div>
          ) : filteredCreations.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Creations
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredCreations.length})
                  </span>
                </h3>
              </div>
              <div className="space-y-4">
                {filteredCreations.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CreationItem item={item} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-32 bg-white rounded-2xl 
              border border-gray-200 shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No creations found</h3>
              <p className="text-gray-600 text-center max-w-md">
                {searchQuery || filterType !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Start creating something amazing!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
