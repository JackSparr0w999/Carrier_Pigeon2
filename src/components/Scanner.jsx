import React, { useState } from "react";
import { Scan, Camera, ArrowLeft, Wifi, WifiOff } from "lucide-react";

export default function Scanner({ onNavigate }) {
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("idle"); // idle, connecting, connected, failed

  const startScanning = () => {
    setIsScanning(true);
    setConnectionStatus("connecting");
    
    // Simula processo di scansione QR
    setTimeout(() => {
      setConnectionStatus("connected");
      setIsScanning(false);
      
      // Dopo la connessione, mostra messaggio e torna alla home
      setTimeout(() => {
        alert("Connessione stabilita con successo! Ora puoi trasferire file.");
        onNavigate('home');
      }, 1000);
    }, 3000);
  };

  const handleManualConnect = () => {
    if (manualCode.length >= 6) {
      setConnectionStatus("connecting");
      setTimeout(() => {
        setConnectionStatus("connected");
        
        // Dopo la connessione manuale
        setTimeout(() => {
          alert(`Connessione stabilita con ID: ${manualCode}`);
          onNavigate('home');
        }, 1000);
      }, 2000);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connecting": return "bg-yellow-500";
      case "connected": return "bg-green-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-300";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connecting": return "Connessione in corso...";
      case "connected": return "Connesso con successo!";
      case "failed": return "Connessione fallita";
      default: return "Pronto per la scansione";
    }
  };

  return (
    <div className="min-h-screen p-4 pt-12">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scansiona QR</h1>
            <p className="text-gray-600">Connetti con il tuo computer</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {connectionStatus === "connected" ? (
                <Wifi className="w-6 h-6 text-green-600" />
              ) : (
                <WifiOff className="w-6 h-6 text-gray-500" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{getStatusText()}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                  <span className="text-sm text-gray-600">
                    {connectionStatus === "connecting" ? "Attendere..." : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Scan className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Scansione QR Code</h3>
            </div>
            
            {/* Mock Camera View */}
            <div className={`relative aspect-square bg-gray-900 rounded-2xl mb-6 overflow-hidden ${
              isScanning ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
            }`}>
              <div className="absolute inset-0 flex items-center justify-center">
                {isScanning ? (
                  <div className="relative">
                    <div className="w-48 h-48 border-2 border-blue-500 rounded-2xl animate-pulse" />
                    <div className="absolute top-0 left-0 w-full">
                      <div className="h-1 bg-blue-500 rounded-full animate-bounce" 
                           style={{
                             animation: 'scan-line 2s linear infinite'
                           }} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                        Scansione in corso...
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Tocca per attivare la fotocamera</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              className={`w-full font-medium py-3 px-4 rounded-xl transition-colors mb-4 ${
                isScanning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${connectionStatus === "connecting" ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={isScanning ? () => setIsScanning(false) : startScanning}
              disabled={connectionStatus === "connecting"}
            >
              {isScanning ? "Ferma Scansione" : "Avvia Scansione"}
            </button>
          </div>
        </div>

        {/* Manual Input */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inserimento Manuale</h3>
              <p className="text-sm text-gray-600">
                Inserisci il codice mostrato sul computer
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Es: ABC123"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                className="w-full p-4 border border-gray-300 rounded-xl text-center font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={9}
              />
              <button 
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors ${
                  (manualCode.length < 6 || connectionStatus === "connecting") ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleManualConnect}
                disabled={manualCode.length < 6 || connectionStatus === "connecting"}
              >
                {connectionStatus === "connecting" ? "Connessione..." : "Connetti"}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl border border-blue-100">
          <div className="p-4">
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Come funziona:</strong></p>
              <p>1. Apri FileShare sul tuo computer</p>
              <p>2. Scansiona il QR code mostrato</p>
              <p>3. Inizia a trasferire i tuoi file!</p>
              <p className="text-xs text-blue-600 mt-3">
                💡 Prova con qualsiasi codice di 6+ caratteri per testare
              </p>
            </div>
          </div>
        </div>

        {/* CSS Animation per la linea di scansione */}
        <style jsx>{`
          @keyframes scan-line {
            0% { transform: translateY(0px); }
            50% { transform: translateY(192px); }
            100% { transform: translateY(0px); }
          }
        `}</style>

      </div>
    </div>
  );
}