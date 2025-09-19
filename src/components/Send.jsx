import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Video, FileText, ArrowLeft, Check, X, Send } from "lucide-react";
import { uploadFile } from '../api/transfers';

export default function SendPage({ onNavigate }) {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [activeTab, setActiveTab] = useState("files");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [sessionId, setSessionId] = useState("");

  const fileTypes = [
    { type: "photo", icon: ImageIcon, label: "Foto", accept: "image/*", color: "bg-blue-500" },
    { type: "video", icon: Video, label: "Video", accept: "video/*", color: "bg-red-500" },
    { type: "document", icon: FileText, label: "Documenti", accept: ".pdf,.doc,.docx,.txt", color: "bg-green-500" }
  ];

  const handleFileSelect = (files, fileType) => {
    const newFiles = Array.from(files).map(file => ({
      file,
      type: fileType,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSendFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const newSessionId = Math.random().toString(36).substr(2, 9).toUpperCase();
    setSessionId(newSessionId);

    try {
      // Per ogni file, avvia l'upload vero
      for (const selectedFile of selectedFiles) {
        // La logica di upload deve gestire anche la progress bar se vuoi mantenerla
        await uploadFile(selectedFile.file, newSessionId);
      }
      
      alert(`File caricati! Session ID: ${newSessionId}`);
      setSelectedFiles([]);
      setUploadProgress({});
      onNavigate('home');
    } catch (error) {
      console.error('Errore upload:', error);
      alert('Errore durante il caricamento');
    } finally {
      setUploading(false);
    }
  };

  const handleSendText = async () => {
    // Mantieni la logica del testo, ma adatta per il back-end
    if (!textContent.trim()) return;

    setUploading(true);
    const newSessionId = Math.random().toString(36).substr(2, 9).toUpperCase();
    setSessionId(newSessionId);
    
    try {
      // Invia il testo al back-end
      // Esempio: await uploadText(textContent, newSessionId);
      alert(`Testo inviato con successo!\n\nID Sessione: ${newSessionId}\nCondividi questo ID con il destinatario.`);
      setTextContent("");
      setUploading(false);
      onNavigate('home');
    } catch (error) {
      console.error("Errore nell'invio del testo:", error);
      setUploading(false);
    }
  };

  const triggerFileInput = (accept) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = true;
    input.onchange = (e) => {
      const fileType = fileTypes.find(ft => ft.accept === accept)?.type || 'document';
      handleFileSelect(e.target.files, fileType);
    };
    input.click();
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
            <h1 className="text-2xl font-bold text-gray-900">Invia File</h1>
            <p className="text-gray-600">Seleziona cosa condividere</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "files" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("files")}
          >
            File e Media
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "text" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("text")}
          >
            Testo
          </button>
        </div>

        {activeTab === "files" ? (
          <>
            {/* File Type Selector */}
            <div className="grid gap-4">
              {fileTypes.map((fileType) => (
                <div key={fileType.type} className="bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="p-4">
                    <button
                      className="w-full flex items-center gap-4 text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                      onClick={() => triggerFileInput(fileType.accept)}
                    >
                      <div className={`w-12 h-12 ${fileType.color} rounded-xl flex items-center justify-center`}>
                        <fileType.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{fileType.label}</h3>
                        <p className="text-sm text-gray-600">Tocca per selezionare</p>
                      </div>
                      <Upload className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    File Selezionati ({selectedFiles.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedFiles.map((selectedFile) => (
                      <div key={selectedFile.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{selectedFile.file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {uploadProgress[selectedFile.id] !== undefined && (
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[selectedFile.id]}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(selectedFile.id)}
                          disabled={uploading}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Send Button */}
            {selectedFiles.length > 0 && (
              <button 
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSendFiles}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Caricamento...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Invia File ({selectedFiles.length})
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <>
            {/* Text Input */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Condividi Testo</h3>
                <p className="text-sm text-gray-600 mb-4">Scrivi il testo da inviare</p>
                <div className="space-y-4">
                  <textarea
                    placeholder="Scrivi qui il tuo testo..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full min-h-32 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-right text-sm text-gray-500">
                    {textContent.length} caratteri
                  </div>
                </div>
              </div>
            </div>

            {/* Send Text Button */}
            {textContent.trim() && (
              <button 
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSendText}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Invio...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Invia Testo
                  </>
                )}
              </button>
            )}
          </>
        )}

        {/* Session ID Display during upload */}
        {uploading && sessionId && (
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
            <p className="text-sm text-blue-800 mb-2">ID Sessione generato:</p>
            <p className="font-mono text-lg font-bold text-blue-900">{sessionId}</p>
            <p className="text-xs text-blue-600 mt-2">Condividi questo ID con il destinatario</p>
          </div>
        )}

      </div>
    </div>
  );
}