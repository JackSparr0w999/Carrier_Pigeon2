import React, { useState } from "react";
import { Copy, Check, ArrowLeft, Send, Share2 } from "lucide-react";

export default function TextShare({ onNavigate }) {
  const [textContent, setTextContent] = useState("");
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const handleSendText = async () => {
    if (!textContent.trim()) return;
    
    setSending(true);
    
    // Simula invio del testo
    setTimeout(() => {
      const link = `${window.location.origin}/receive?session=${sessionId}`;
      setShareLink(link);
      setSending(false);
    }, 1500);
  };

  const handleCopySessionId = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback per browser che non supportano clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = sessionId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback per browser che non supportano clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FileShare - Testo condiviso',
          text: textContent,
          url: shareLink
        });
      } catch (err) {
        console.error('Errore nella condivisione:', err);
      }
    } else {
      // Fallback se Web Share API non è supportata
      handleCopyLink();
      alert('Link copiato negli appunti!');
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
            <h1 className="text-2xl font-bold text-gray-900">Condividi Testo</h1>
            <p className="text-gray-600">Invia testo rapidamente</p>
          </div>
        </div>

        {!shareLink ? (
          <>
            {/* Text Input */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Il Tuo Testo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Scrivi o incolla il testo da condividere
                </p>
                <div className="space-y-4">
                  <textarea
                    placeholder="Incolla qui il tuo testo, link, codice, o qualsiasi altro contenuto..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full min-h-40 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-right text-sm text-gray-500">
                    {textContent.length} caratteri
                  </div>
                </div>
              </div>
            </div>

            {/* Session ID */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">ID Sessione</h3>
                    <p className="font-mono text-2xl font-bold">{sessionId}</p>
                    <p className="text-purple-100 text-sm mt-1">Condividi questo codice</p>
                  </div>
                  <button
                    onClick={handleCopySessionId}
                    className="p-3 text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Send Button */}
            {textContent.trim() && (
              <button 
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-4 rounded-xl transition-colors flex items-center justify-center text-lg ${
                  sending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSendText}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Condividi Testo
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          // Success State
          <>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Testo Condiviso!</h3>
                <p className="text-gray-600">
                  Il tuo testo è ora disponibile per la ricezione
                </p>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Condividi con:</h3>
              
              {/* Session ID */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">ID Sessione</h4>
                      <p className="font-mono text-lg text-gray-700">{sessionId}</p>
                    </div>
                    <button
                      onClick={handleCopySessionId}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Link diretto */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Link Diretto</h4>
                      <button
                        onClick={handleCopyLink}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <input 
                      value={shareLink} 
                      readOnly 
                      className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Native Share */}
              <button
                onClick={handleNativeShare}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Condividi con altre app
              </button>
            </div>

            {/* New Text Button */}
            <button
              onClick={() => {
                setTextContent("");
                setShareLink("");
                setCopied(false);
              }}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Condividi Altro Testo
            </button>
          </>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl border border-blue-100">
          <div className="p-4">
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Come funziona:</strong></p>
              <p>1. Scrivi o incolla il tuo testo</p>
              <p>2. Condividi l'ID sessione o il link</p>
              <p>3. L'altro dispositivo può ricevere il testo</p>
              <p className="text-xs text-blue-600 mt-2">
                Il testo sarà disponibile per 24 ore
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}