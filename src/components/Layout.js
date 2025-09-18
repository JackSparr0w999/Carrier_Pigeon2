import React from "react";
import { Smartphone, Monitor, Share2, Scan, Home, Send, Download, FileText } from "lucide-react";

export default function Layout({ children, currentPage, onNavigate }) {
  const navigationItems = [
    {
      title: "Home",
      page: "home",
      icon: Home,
    },
    {
      title: "Scansiona", 
      page: "scanner",
      icon: Scan,
    },
    {
      title: "Invia",
      page: "send",
      icon: Send,
    },
    {
      title: "Ricevi",
      page: "receive", 
      icon: Download,
    },
    {
      title: "I Miei File",
      page: "my-files",
      icon: FileText,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        :root {
          --ios-blue: #007AFF;
          --ios-gray: #8E8E93;
          --ios-light-gray: #F2F2F7;
          --ios-background: #FFFFFF;
          --ios-secondary: #F9F9F9;
          --shadow-ios: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
          --shadow-ios-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .ios-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.85);
        }
        
        .ios-card {
          background: var(--ios-background);
          border-radius: 12px;
          box-shadow: var(--shadow-ios);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .ios-button {
          background: var(--ios-blue);
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        
        .ios-button:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-ios-lg);
        }
        
        .nav-item {
          transition: all 0.3s ease;
        }
        
        .nav-item:hover {
          transform: scale(1.05);
        }
      `}</style>
      
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation - iOS Style */}
      <div className="fixed bottom-0 left-0 right-0 ios-blur border-t border-gray-200/30 px-4 py-2">
        <div className="max-w-md mx-auto">
          <nav className="flex justify-around items-center">
            {navigationItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.title}
                  onClick={() => onNavigate(item.page)}
                  className={`nav-item flex flex-col items-center py-2 px-3 rounded-lg min-w-0 flex-1 ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`text-xs font-medium truncate ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}