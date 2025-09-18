import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, Share2, Upload, Download, Copy, Check, RefreshCw } from "lucide-react";

export default function DesktopHome({ onNavigate }) {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Genera QR Code
  useEffect(() => {
    // Simula generazione QR code - in produzione useresti una libreria QR
    const qrData = `${window.location.origin}?session=${sessionId}`;
    // Per ora uso un servizio online per generare QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    setQrCodeUrl(qrUrl);
  }, [sessionId]);

  const handleCopySessionId = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Errore nella copia:', err);
    }
  };

  const refreshSession = () => {
    const newSessionId = Math.random().toString(36).substr(2, 9).toUpperCase();
    setSessionId(newSessionId);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Desktop */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">FileSync Desktop</h1>
              <p className="text-xl text-gray-600">Trasferisci file con i tuoi dispositivi mobili</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonna QR Code */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-8">
              
              {/* Status Connessione */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-3">
                  {isConnected ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  )}
                  <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {isConnected ? 'Dispositivo Connesso' : 'In Attesa di Connessione'}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-white p-6 rounded-2xl shadow-inner border-2 border-gray-100 inline-block">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-64 h-64 mx-auto"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                      <div className="text-4xl text-gray-400">📱</div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Scansiona questo codice con il tuo smartphone
                </p>
              </div>

              {/* Session ID */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6 mb-6">
                <div className="text-center">
                  <p className="text-purple-100 text-sm mb-2">ID SESSIONE</p>
                  <p className="font-mono text-3xl font-bold mb-4">{sessionId}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopySessionId}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copiato!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copia ID
                        </>
                      )}
                    </button>
                    <button
                      onClick={refreshSession}
                      className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Istruzioni */}
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">Come funziona:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Scansiona il QR code con lo smartphone</li>
                  <li>Oppure inserisci l'ID sessione manualmente</li>
                  <li>Inizia a trasferire i tuoi file!</li>
                </ol>
              </div>

            </div>
          </div>

          {/* Colonna Principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Invia File */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <button 
                  onClick={() => onNavigate('send')}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Invia File</h3>
                      <p className="text-gray-600">Condividi foto, video e documenti</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <p className="text-center text-gray-500">
                      Clicca per selezionare file o trascina qui
                    </p>
                  </div>
                </button>
              </div>

              {/* Ricevi File */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                <button 
                  onClick={() => onNavigate('receive')}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Ricevi File</h3>
                      <p className="text-gray-600">Scarica file dai tuoi dispositivi</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-center text-green-700">
                      Pronto a ricevere file
                    </p>
                  </div>
                </button>
              </div>

            </div>

            {/* File Recenti Desktop */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">File Recenti</h3>
                  <button 
                    onClick={() => onNavigate('my-files')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Vedi tutti
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {/* File simulati */}
                  {[
                    { name: 'Presentazione.pdf', size: '2.3 MB', time: '2 ore fa', type: 'document' },
                    { name: 'Foto_vacanze.jpg', size: '5.1 MB', time: '1 giorno fa', type: 'image' },
                    { name: 'Video_demo.mp4', size: '15.2 MB', time: '3 giorni fa', type: 'video' }
                  ].map((file, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">
                          {file.type === 'document' ? '📄' : file.type === 'image' ? '🖼️' : '🎬'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-600">{file.size} • {file.time}</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Desktop */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Altre Funzioni</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => onNavigate('text-share')}
                  className="p-4 text-center hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Share2 className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Condividi Testo</span>
                </button>
                <button 
                  onClick={() => onNavigate('my-files')}
                  className="p-4 text-center hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Upload className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">I Miei File</span>
                </button>
                <button 
                  onClick={() => onNavigate('receive')}
                  className="p-4 text-center hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Download className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Ricevi</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}