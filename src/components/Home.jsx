import React, { useState } from "react";
import { Smartphone, Monitor, Wifi, WifiOff, Share2, Upload, Download, Copy, Check } from "lucide-react";

export default function Home({ onNavigate }) {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  const [copied, setCopied] = useState(false);

  const handleCopySessionId = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Errore nella copia:', err);
    }
  };

  const connectionFeatures = [
    {
      icon: Upload,
      title: "Invia File",
      description: "Foto, video, documenti",
      color: "bg-blue-500",
      page: "send"
    },
    {
      icon: Download,
      title: "Ricevi File", 
      description: "Da altri dispositivi",
      color: "bg-green-500",
      page: "receive"
    },
    {
      icon: Share2,
      title: "Condividi Testo",
      description: "Copia e incolla veloce",
      color: "bg-purple-500",
      page: "text-share"
    }
  ];

  return (
    <div className="min-h-screen p-4 pt-12">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Share2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrier Pigeon</h1>
          <p className="text-gray-600">Trasferisci file tra i tuoi dispositivi</p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isConnected ? (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <WifiOff className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {isConnected ? "Connesso" : "Non connesso"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isConnected ? "Pronto per il trasferimento" : "Scansiona QR per connettere"}
                  </p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>

            {/* Session ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">ID SESSIONE</p>
                  <p className="font-mono text-lg font-semibold text-gray-900">{sessionId}</p>
                </div>
                <button
                  onClick={handleCopySessionId}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('scanner')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Scansiona QR Code
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 px-2">Azioni Rapide</h2>
          
          <div className="grid gap-4">
            {connectionFeatures.map((feature, index) => (
              <div key={feature.title}>
                <button 
                  onClick={() => onNavigate(feature.page)}
                  className="w-full text-left"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Files Quick Access */}
        <div>
          <button 
            onClick={() => onNavigate('my-files')}
            className="w-full text-left"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Smartphone className="w-5 h-5" />
                  <span>I Miei File</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}