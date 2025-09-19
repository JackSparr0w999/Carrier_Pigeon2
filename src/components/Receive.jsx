import React, { useState } from "react";
import { Download, FileText, Image as ImageIcon, Video, ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import { getTransfers } from '../api/transfers';


export default function Receive({ onNavigate }) {
  const [sessionId, setSessionId] = useState("");
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  const loadTransfers = async () => {
    if (!sessionId.trim() || sessionId.length < 6) return;
    
    setLoading(true);
    
    try {
      // Chiama la funzione reale che si connette al tuo back-end
      const data = await getTransfers(sessionId.toUpperCase());
      setTransfers(data);
    } catch (error) {
      console.error('Errore caricamento:', error);
      // Se c'è un errore, è utile svuotare i trasferimenti
      setTransfers([]); 
    } finally {
      // Assicurati che loading sia sempre impostato su false
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "photo": return { icon: ImageIcon, color: "bg-blue-500" };
      case "video": return { icon: Video, color: "bg-red-500" };
      case "document": return { icon: FileText, color: "bg-green-500" };
      default: return { icon: FileText, color: "bg-gray-500" };
    }
  };

  const handleCopyText = async (text, transferId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(transferId);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Errore nella copia:', err);
      // Fallback per browser che non supportano clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedText(transferId);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const handleDownload = (transfer) => {
    if (transfer.file_url) {
      const link = document.createElement('a');
      link.href = transfer.file_url;
      link.download = transfer.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Errore: URL del file non disponibile.`);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
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
            <h1 className="text-2xl font-bold text-gray-900">Ricevi File</h1>
            <p className="text-gray-600">Inserisci l'ID sessione per ricevere</p>
          </div>
        </div>

        {/* Session ID Input */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ID Sessione</h3>
              <p className="text-sm text-gray-600">
                Inserisci l'ID mostrato sul dispositivo mittente
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Es: ABC123XYZ"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                className="w-full p-4 border border-gray-300 rounded-xl text-center font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={9}
              />
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={loadTransfers}
                disabled={sessionId.length < 6 || loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    Ricerca...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Cerca File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Transfers List */}
        {transfers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 px-2">
              File Disponibili ({transfers.length})
            </h2>
            
            {transfers.map((transfer) => (
              <div key={transfer.id} className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-4">
                  {transfer.file_type === "text" ? (
                    // Text Transfer
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Messaggio di Testo</h3>
                          <p className="text-sm text-gray-600">
                            Da {transfer.device_name} • {formatTime(transfer.created_date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800 leading-relaxed">{transfer.text_content}</p>
                      </div>
                      
                      <button
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                        onClick={() => handleCopyText(transfer.text_content, transfer.id)}
                      >
                        {copiedText === transfer.id ? (
                          <>
                            <Check className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-green-600">Copiato!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copia Testo
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    // File Transfer
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const { icon: Icon, color } = getFileIcon(transfer.file_type);
                          return (
                            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          );
                        })()}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{transfer.file_name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatFileSize(transfer.file_size)} • Da {transfer.device_name}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                        onClick={() => handleDownload(transfer)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Scarica File
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sessionId && transfers.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nessun file trovato</h3>
              <p className="text-sm text-gray-600">
                Verifica l'ID sessione o attendi che il mittente invii dei file.
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl border border-blue-100">
          <div className="p-4">
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Come ricevere file:</strong></p>
              <p>1. Chiedi l'ID sessione al mittente</p>
              <p>2. Inseriscilo qui sopra e cerca</p>
              <p>3. Scarica i file disponibili</p>
              <p className="text-xs text-blue-600 mt-3">
                💡 Prova con "ABC123" per vedere i file demo
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}