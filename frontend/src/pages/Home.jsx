// client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { postService } from '../services/api';
import { ArrowRight, PenTool, Users, Zap, Star, Rocket, TrendingUp } from 'lucide-react';

const Home = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const data = await postService.getPopularPosts(3);
        setPopularPosts(data.data || []);
      } catch (error) {
        console.error('Error fetching popular posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl mx-4 mb-16 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-pulse">
            <Rocket className="w-4 h-4" />
            <span>🚀 Most Popular Blog Platform 2024</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to BlogHub
        </h1>
        <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto font-medium">
          Discover amazing stories, share your thoughts, and connect with a community of passionate writers and readers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3">
                <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="group border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3">
                <PenTool className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/create-post"
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3"
            >
              <PenTool className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Writing
            </Link>
            <Link
              to="/posts"
              className="group border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
            >
              Explore Posts
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Popular Posts Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Trending Posts
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Check out what everyone is reading right now
        </p>
        
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-5/6"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : popularPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {popularPosts.map((post, index) => (
              <div 
                key={post._id}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:transform hover:-translate-y-2 group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-600">Trending #{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt || post.content.substring(0, 120) + '...'}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{post.author?.firstName} {post.author?.lastName}</span>
                  <span>{post.viewCount} views</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No popular posts yet. Be the first to create amazing content!</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Why Choose BlogHub?
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Experience the future of blogging with our cutting-edge platform
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <PenTool className="w-12 h-12" />,
              title: "Beautiful Writing",
              description: "Write with our elegant editor and focus on your content with seamless Clerk authentication.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: <Users className="w-12 h-12" />,
              title: "Secure Community",
              description: "Connect safely with readers and writers through Clerk's secure authentication system.",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: <Zap className="w-12 h-12" />,
              title: "Lightning Fast",
              description: "Enjoy blazing fast performance with modern technology and instant Clerk sign-ins.",
              color: "from-orange-500 to-red-500"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-transparent transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl group"
            >
              <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;