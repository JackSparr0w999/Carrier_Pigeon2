import React, { useState } from "react";
export default function Settings({ onNavigate }) {
    return (
    <div className="min-h-screen p-4 pt-12">
      <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Settings</span>
          </div>

    </div>
    
  );
}