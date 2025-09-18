import React, { useState, useEffect } from "react";
import { FileText, Image as ImageIcon, Video, Trash2, Download, ArrowLeft, RefreshCw } from "lucide-react";

export default function MyFiles({ onNavigate }) {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMyFiles();
  }, []);

  const loadMyFiles = async () => {
    setLoading(true);
    // Simula caricamento dati - sostituisci con la tua API
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          file_name: "Documento_importante.pdf",
          file_type: "document",
          file_size: 2340000,
          file_url: "#",
          created_date: new Date().toISOString(),
          text_content: null
        },
        {
          id: 2,
          file_name: "Foto_vacanza.jpg", 
          file_type: "photo",
          file_size: 5120000,
          file_url: "#",
          created_date: new Date(Date.now() - 86400000).toISOString(),
          text_content: null
        },
        {
          id: 3,
          file_name: null,
          file_type: "text",
          file_size: null,
          file_url: null,
          created_date: new Date(Date.now() - 172800000).toISOString(),
          text_content: "Questo è un messaggio di testo condiviso tra dispositivi"
        },
        {
          id: 4,
          file_name: "Video_demo.mp4",
          file_type: "video", 
          file_size: 45600000,
          file_url: "#",
          created_date: new Date(Date.now() - 259200000).toISOString(),
          text_content: null
        }
      ];
      setTransfers(mockData);
      setLoading(false);
    }, 1000);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "photo": return { icon: ImageIcon, color: "bg-blue-500" };
      case "video": return { icon: Video, color: "bg-red-500" };
      case "document": return { icon: FileText, color: "bg-green-500" };
      case "text": return { icon: FileText, color: "bg-purple-500" };
      default: return { icon: FileText, color: "bg-gray-500" };
    }
  };

  const handleDownload = (transfer) => {
    if (transfer.file_url && transfer.file_url !== "#") {
      const link = document.createElement('a');
      link.href = transfer.file_url;
      link.download = transfer.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Download simulato per: ' + (transfer.file_name || 'file'));
    }
  };

  const handleDelete = async (transferId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo file?')) {
      setTransfers(prev => prev.filter(t => t.id !== transferId));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Oggi';
    if (diffDays === 2) return 'Ieri';
    if (diffDays <= 7) return `${diffDays - 1} giorni fa`;
    return date.toLocaleDateString('it-IT');
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

  const groupedTransfers = transfers.reduce((groups, transfer) => {
    const date = formatDate(transfer.created_date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transfer);
    return groups;
  }, {});

  return (
    <div className="min-h-screen p-4 pt-12">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">I Miei File</h1>
              <p className="text-gray-600">Cronologia trasferimenti</p>
            </div>
          </div>
          
          <button 
            onClick={loadMyFiles}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <div className={loading ? 'animate-spin' : ''}>
              <RefreshCw className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{transfers.length}</h3>
                <p className="text-blue-100">File trasferiti</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          // Loading State
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : transfers.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nessun file ancora</h3>
              <p className="text-sm text-gray-600">
                I tuoi file trasferiti appariranno qui
              </p>
            </div>
          </div>
        ) : (
          // Files List
          <div className="space-y-6">
            {Object.entries(groupedTransfers).map(([date, dayTransfers]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 px-2">
                  {date}
                </h3>
                
                {dayTransfers.map((transfer) => (
                  <div key={transfer.id} className="bg-white rounded-xl shadow-md border border-gray-100">
                    <div className="p-4">
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
                          <h4 className="font-semibold text-gray-900 truncate">
                            {transfer.file_name || 'Messaggio di testo'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatTime(transfer.created_date)}
                            {transfer.file_size && ` • ${formatFileSize(transfer.file_size)}`}
                          </p>
                        </div>
                        
                        <div className="flex gap-1">
                          {transfer.file_url && (
                            <button
                              onClick={() => handleDownload(transfer)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(transfer.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {transfer.file_type === "text" && transfer.text_content && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-800 line-clamp-2">
                            {transfer.text_content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}