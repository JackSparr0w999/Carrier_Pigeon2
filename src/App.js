import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Share2, Home as HomeIcon, Scan, Send as SendIcon, Download, FileText } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';


// Importa i TUOI componenti
import Home from './components/Home';
import DesktopHome from './components/DesktopHome';
import Scanner from './components/Scanner';
import MyFiles from './components/MyFiles';
import Send from './components/Send';           // ← Componente Send separato
import Receive from './components/Receive';     // ← Componente Receive separato  
import TextShare from './components/TextShare';
import Layout from './components/Layout';

// Layout wrapper (usa questo se il tuo Layout.js ha problemi)
const AppLayout = ({ children, currentPage, onNavigate, isMobile }) => {
  return (
    <div className={isMobile ? "min-h-screen bg-gray-50" : "min-h-screen bg-gray-50"}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          {currentPage !== 'home' ? (
            <button 
              onClick={() => onNavigate('home')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">File sharing web app by JackSparr0w999</span>
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={isMobile ? "pb-20" : "pb-8"}>
        {children}
      </div>

      {/* Bottom Navigation - Solo per mobile */}
      {isMobile && currentPage !== 'home' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex">
            <button 
              onClick={() => onNavigate('home')}
              className={`flex-1 p-4 text-center ${currentPage === 'home' ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <HomeIcon className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">Home</span>
            </button>
            <button 
              onClick={() => onNavigate('scanner')}
              className={`flex-1 p-4 text-center ${currentPage === 'scanner' ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <Scan className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">Scanner</span>
            </button>
            <button 
              onClick={() => onNavigate('send')}
              className={`flex-1 p-4 text-center ${currentPage === 'send' ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <SendIcon className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">Invia</span>
            </button>
            <button 
              onClick={() => onNavigate('receive')}
              className={`flex-1 p-4 text-center ${currentPage === 'receive' ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <Download className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">Ricevi</span>
            </button>
            <button 
              onClick={() => onNavigate('my-files')}
              className={`flex-1 p-4 text-center ${currentPage === 'my-files' ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <FileText className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">File</span>
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
};

// App principale
function App() {
  
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Rileva se è dispositivo mobile
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileKeywords.test(userAgent) || window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'home':
        return isMobile 
          ? <Home onNavigate={setCurrentPage} />
          : <DesktopHome onNavigate={setCurrentPage} />;
      case 'scanner':
        return <Scanner onNavigate={setCurrentPage} />;
      case 'my-files':
        return <MyFiles onNavigate={setCurrentPage} />;
      case 'send':                                    // ← Pagina Send separata
        return <Send onNavigate={setCurrentPage} />;
      case 'receive':                                 // ← Pagina Receive separata
        return <Receive onNavigate={setCurrentPage} />;
      case 'text-share':
        return <TextShare onNavigate={setCurrentPage} />;
      default:
        return isMobile 
          ? <Home onNavigate={setCurrentPage} />
          : <DesktopHome onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <div className={isMobile ? "max-w-md mx-auto bg-white shadow-xl" : "min-h-screen bg-gray-50"}>
        <AppLayout currentPage={currentPage} onNavigate={setCurrentPage} isMobile={isMobile}>
          {renderCurrentPage()}
        </AppLayout>
      </div>
      <Analytics />
    </>  
  );
}

export default App;