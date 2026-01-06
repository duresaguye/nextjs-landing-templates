"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  Palette, 
  Code2, 
  Zap, 
  Heart, 
  Eye,
  Download,
  Star,
  Filter,
  Grid3x3,
  List,
  ChevronRight,
  BookOpen,
  Users,
  Rocket,
  Brush,
  Cpu,
  Smartphone,
  ShoppingBag,
  TrendingUp,
  Coffee
} from "lucide-react";

type Template = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  likes: number;
  tags: string[];
  isTrending: boolean;
  isNew: boolean;
  color: string;
  author: string;
  complexity: "beginner" | "intermediate" | "advanced";
};

const getComplexityColor = (complexity: string) => {
  switch(complexity) {
    case "beginner": return "#10b981";
    case "intermediate": return "#f59e0b";
    case "advanced": return "#ef4444";
    default: return "#6b7280";
  }
};

const getCategoryIcon = (category: string) => {
  switch(category) {
    case "dashboard": return <TrendingUp className="h-4 w-4" />;
    case "ecommerce": return <ShoppingBag className="h-4 w-4" />;
    case "mobile": return <Smartphone className="h-4 w-4" />;
    case "portfolio": return <Palette className="h-4 w-4" />;
    default: return <Code2 className="h-4 w-4" />;
  }
};

export default function TemplateMarketplace() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [likedTemplates, setLikedTemplates] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const templates: Template[] = [
    {
      id: 1,
      name: "Midnight Dashboard",
      category: "dashboard",
      description: "Dark mode analytics with organic shapes",
      price: 49,
      rating: 4.8,
      likes: 124,
      tags: ["Next.js", "Chart.js", "Dark"],
      isTrending: true,
      isNew: false,
      color: "#1e293b",
      author: "Studio Noir",
      complexity: "intermediate"
    },
    {
      id: 2,
      name: "portfolio and SaaS",
      category: "portfolio",
      description: "Imperfect beauty for creatives",
      price: 39,
      rating: 4.9,
      likes: 89,
      tags: ["Minimal", "Japanese", "Elegant"],
      isTrending: true,
      isNew: true,
      color: "#f5f5f5",
      author: "Zen Studio",
      complexity: "beginner"
    },
    {
      id: 3,
      name: "Cyberpunk Store",
      category: "ecommerce",
      description: "Neon e-commerce with glitch effects",
      price: 69,
      rating: 4.7,
      likes: 156,
      tags: ["Neon", "Glitch", "Cyberpunk"],
      isTrending: true,
      isNew: false,
      color: "#0a0a0a",
      author: "Neon Labs",
      complexity: "advanced"
    },
    {
      id: 4,
      name: "Papercraft Blog",
      category: "blog",
      description: "Analog feel with digital precision",
      price: 29,
      rating: 4.6,
      likes: 67,
      tags: ["Paper", "Textured", "Warm"],
      isTrending: false,
      isNew: true,
      color: "#fef3c7",
      author: "Analog Digital",
      complexity: "beginner"
    },
    {
      id: 5,
      name: "Retro Mobile UI",
      category: "mobile",
      description: "80s nostalgia meets modern UX",
      price: 59,
      rating: 4.8,
      likes: 98,
      tags: ["Retro", "Gradient", "Fun"],
      isTrending: true,
      isNew: false,
      color: "#fbbf24",
      author: "Retro Future",
      complexity: "intermediate"
    },
    {
      id: 6,
      name: "Brutalist Admin",
      category: "dashboard",
      description: "Raw functionality, bold aesthetics",
      price: 45,
      rating: 4.5,
      likes: 112,
      tags: ["Brutalist", "Bold", "Raw"],
      isTrending: false,
      isNew: true,
      color: "#ffffff",
      author: "Concrete Studio",
      complexity: "intermediate"
    },
    {
      id: 7,
      name: "Organic Shop",
      category: "ecommerce",
      description: "Natural colors and fluid animations",
      price: 55,
      rating: 4.9,
      likes: 134,
      tags: ["Organic", "Natural", "Fluid"],
      isTrending: true,
      isNew: false,
      color: "#d1fae5",
      author: "Nature Tech",
      complexity: "advanced"
    },
    {
      id: 8,
      name: "Synthwave SaaS",
      category: "saas",
      description: "Sunset gradients and synth vibes",
      price: 79,
      rating: 4.7,
      likes: 145,
      tags: ["Synthwave", "Vaporwave", "Retro"],
      isTrending: true,
      isNew: false,
      color: "#1e1b4b",
      author: "Synth Labs",
      complexity: "advanced"
    }
  ];

  const categories = [
    { id: "all", label: "All", color: "#6366f1", count: 56 },
    { id: "dashboard", label: "Dashboards", color: "#0ea5e9", count: 12 },
    { id: "ecommerce", label: "E-commerce", color: "#10b981", count: 18 },
    { id: "portfolio", label: "Portfolios", color: "#f59e0b", count: 15 },
    { id: "blog", label: "Blogs", color: "#ec4899", count: 8 },
    { id: "mobile", label: "Mobile", color: "#8b5cf6", count: 7 },
    { id: "saas", label: "SaaS", color: "#3b82f6", count: 9 },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (id: number) => {
    setLikedTemplates(prev =>
      prev.includes(id) ? prev.filter(templateId => templateId !== id) : [...prev, id]
    );
  };

  // Hand-drawn background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw organic lines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      ctx.moveTo(startX, startY);
      
      // Create hand-drawn effect with slight randomness
      for (let j = 0; j < 10; j++) {
        const cp1x = startX + Math.random() * 200 - 100;
        const cp1y = startY + Math.random() * 200 - 100;
        const cp2x = cp1x + Math.random() * 200 - 100;
        const cp2y = cp1y + Math.random() * 200 - 100;
        const endX = cp2x + Math.random() * 200 - 100;
        const endY = cp2y + Math.random() * 200 - 100;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      }
      ctx.stroke();
    }

    // Add some dots
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.fillStyle = i % 3 === 0 ? 'rgba(139, 92, 246, 0.1)' : 
                     i % 3 === 1 ? 'rgba(245, 158, 11, 0.1)' : 
                     'rgba(236, 72, 153, 0.1)';
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 4 + 1;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-gray-900 relative overflow-hidden">
      {/* Hand-drawn background canvas */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
      />

      {/* Paper texture overlay */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M11%2018c3.866%200%207-3.134%207-7s-3.134-7-7-7-7%203.134-7%207%203.134%207%207%207zm48%2025c3.866%200%207-3.134%207-7s-3.134-7-7-7-7%203.134-7%207%203.134%207%207%207zm-43-7c1.657%200%203-1.343%203-3s-1.343-3-3-3-3%201.343-3%203%201.343%203%203%203zm63%2031c1.657%200%203-1.343%203-3s-1.343-3-3-3-3%201.343-3%203%201.343%203%203%203zM34%2090c1.657%200%203-1.343%203-3s-1.343-3-3-3-3%201.343-3%203%201.343%203%203%203zm56-76c1.657%200%203-1.343%203-3s-1.343-3-3-3-3%201.343-3%203%201.343%203%203%203zM12%2086c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm28-65c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm23-11c2.76%200%205-2.24%205-5s-2.24-5-5-5-5%202.24-5%205%202.24%205%205%205zm-6%2060c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm29%2022c2.76%200%205-2.24%205-5s-2.24-5-5-5-5%202.24-5%205%202.24%205%205%205zM32%2063c2.76%200%205-2.24%205-5s-2.24-5-5-5-5%202.24-5%205%202.24%205%205%205zm57-13c2.76%200%205-2.24%205-5s-2.24-5-5-5-5%202.24-5%205%202.24%205%205%205zm-9-21c1.105%200%202-.895%202-2s-.895-2-2-2-2%20.895-2%202%20.895%202%202%202zM60%2091c1.105%200%202-.895%202-2s-.895-2-2-2-2%20.895-2%202%20.895%202%202%202zM35%2041c1.105%200%202-.895%202-2s-.895-2-2-2-2%20.895-2%202%20.895%202%202%202zM12%2060c1.105%200%202-.895%202-2s-.895-2-2-2-2%20.895-2%202%20.895%202%202%202z%22%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E")` }} />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-gray-300/50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-rose-300 rounded-xl flex items-center justify-center rotate-12 shadow-sm">
                <Brush className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">TemplateCraft</span>
                <div className="text-xs text-gray-500 -mt-1">handmade digital goods</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">Gallery</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">Artists</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">Studio</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium">Journal</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:shadow-md transition-shadow">
                Upload Design
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200 mb-6">
            <Sparkles className="h-4 w-4 text-amber-600 mr-2" />
            <span className="text-sm font-medium text-amber-900">Limited: Hand-signed templates</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Templates with
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              personality
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Curated collection of templates designed by independent artists. 
            Each piece tells a story, each design has a soul.
          </p>
          
          {/* Search */}
          <div className="max-w-2xl relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for textures, moods, or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 shadow-sm"
              />
              <div className="absolute right-3 top-3 flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
                <div className="flex items-center border-l border-gray-200 pl-2">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-amber-100 text-amber-900" : "hover:bg-gray-100"}`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${viewMode === "list" ? "bg-amber-100 text-amber-900" : "hover:bg-gray-100"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse by mood</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
              See all vibes
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative px-5 py-3 rounded-xl transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-white shadow-lg border border-gray-200"
                    : "bg-white/50 hover:bg-white/80 border border-transparent hover:border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-800">{category.label}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
                {activeCategory === category.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">342</div>
            <div className="text-sm text-gray-600">Independent Artists</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-gray-600">Handcrafted Templates</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Avg. Artist Rating</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">89%</div>
            <div className="text-sm text-gray-600">Repeat Customers</div>
          </div>
        </div>

        {/* Template Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`group ${
                viewMode === "grid" 
                  ? "bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  : "bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6"
              }`}
            >
              {viewMode === "grid" ? (
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center`}
                             style={{ backgroundColor: template.color }}>
                          {getCategoryIcon(template.category)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{template.name}</div>
                          <div className="text-xs text-gray-500">by {template.author}</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleLike(template.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          likedTemplates.includes(template.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">{template.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">{template.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Heart className="h-4 w-4" />
                        <span className="ml-1 text-sm">{template.likes}</span>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium"
                           style={{ 
                             backgroundColor: `${getComplexityColor(template.complexity)}20`,
                             color: getComplexityColor(template.complexity)
                           }}>
                        {template.complexity}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
                        ${template.price}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center`}
                         style={{ backgroundColor: template.color }}>
                      {getCategoryIcon(template.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                        {template.isTrending && (
                          <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs rounded-full">
                            Trending
                          </span>
                        )}
                        {template.isNew && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 max-w-2xl">{template.description}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-sm text-gray-500">by {template.author}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <span className="ml-1 text-sm">{template.rating}</span>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-medium"
                             style={{ 
                               backgroundColor: `${getComplexityColor(template.complexity)}20`,
                               color: getComplexityColor(template.complexity)
                             }}>
                          {template.complexity}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(template.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          likedTemplates.includes(template.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow">
                      ${template.price}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Featured Artists */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Meet the Artists</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each template is signed by its creator. Get to know the people behind the pixels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Elena Russo", role: "Textural Artist", templates: 24, color: "#f5e6d3" },
              { name: "Marcus Chen", role: "Digital Brutalist", templates: 18, color: "#d4e6f1" },
              { name: "Sofia Petrova", role: "Organic Designer", templates: 31, color: "#e8f5e9" },
            ].map((artist, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: artist.color }}></div>
                  <div>
                    <div className="font-bold text-gray-900">{artist.name}</div>
                    <div className="text-sm text-gray-500">{artist.role}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Specializes in creating templates that feel analog in a digital world.
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{artist.templates} templates</span>
                  <button className="text-amber-600 hover:text-amber-700 font-medium">
                    View collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50"></div>
          <div className="relative z-10 p-12 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-amber-200 mb-6">
              <Coffee className="h-4 w-4 text-amber-600 mr-2" />
              <span className="text-sm font-medium text-amber-900">Support independent artists</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Ready to build something<br />
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                with character?
              </span>
            </h2>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              Join 15,000+ designers and developers creating unique digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">
                Browse All Templates
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors">
                Join as Artist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-gray-300/50 bg-white/80 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-rose-300 rounded-xl flex items-center justify-center rotate-12">
                  <Brush className="h-5 w-5 text-gray-900" />
                </div>
                <span className="text-xl font-bold">TemplateCraft</span>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                A marketplace for templates with soul. Supporting independent digital artists since 2020.
              </p>
            </div>
            
            {[
              ["Marketplace", ["Templates", "Artists", "Collections", "Trending"]],
              ["Resources", ["Documentation", "Tutorials", "Blog", "Community"]],
              ["Company", ["About", "Journal", "Careers", "Contact"]]
            ].map(([title, links], idx) => (
              <div key={idx}>
                <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
                <ul className="space-y-2">
                  {(links as string[]).map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© 2024 TemplateCraft. All designs are handcrafted by independent artists.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}