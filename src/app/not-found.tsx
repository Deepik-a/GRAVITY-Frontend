'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Construction, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -mr-64 -mt-64 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl -ml-72 -mb-72 opacity-50"></div>
      
      <div className="max-w-xl w-full text-center relative z-10">
        <div className="relative inline-block mb-12">
          {/* Animated 404 Number */}
          <h1 className="text-[180px] font-black text-gray-100 leading-none select-none tracking-tighter sm:text-[220px]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center translate-y-4">
             <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center border border-gray-100 rotate-12 animate-bounce duration-[2000ms]">
                <Construction className="text-blue-600" size={64} />
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">Lost in Space?</h2>
            <p className="text-gray-500 font-bold text-lg max-w-md mx-auto leading-relaxed">
              We couldn't find the architectural masterpiece you were looking for. It might have been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button 
              onClick={() => router.back()}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-2xl border border-gray-100 shadow-xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-2xl shadow-2xl font-black uppercase text-xs tracking-widest hover:shadow-blue-200/50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Home size={16} />
              Return Home
            </Link>
          </div>

          <div className="pt-20 border-t border-gray-100 mt-12">
             <div className="flex items-center justify-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                <Search size={14} />
                <span>Try searching for our companies or projects from the homepage</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Dots */}
      <div className="hidden lg:block absolute top-1/2 left-20 w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
      <div className="hidden lg:block absolute top-1/4 right-32 w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
      <div className="hidden lg:block absolute bottom-1/3 right-1/4 w-2 h-2 bg-red-400 rounded-full"></div>
    </div>
  );
}
