"use client"
import { useState } from "react"
import { Smartphone, Wifi, AlertCircle, CheckCircle2, Scan } from "lucide-react"

export default function NFCScanner() {
  const [nfcData, setNfcData] = useState(null)
  const [error, setError] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const scanNFC = async () => {
    setError(null)
    setIsScanning(true)
    setShowSuccess(false)

    try {
      if ("NDEFReader" in window) {
        const reader = new NDEFReader()
        await reader.scan()

        reader.onreading = async (event) => {
          const data = event.message.records[0].data
          const text = new TextDecoder().decode(data)
          const urlMatch = text.match(/card_id=([^&]+)/)
          const cardId = urlMatch ? urlMatch[1] : text
          setNfcData(cardId)
          setIsScanning(false)
          setShowSuccess(true)

      
          // Auto-hide success message after 3 seconds
          setTimeout(() => setShowSuccess(false), 3000)
            await fetch('https://trialdev.amanadhikari.me/nfc', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ card_id: cardId }),
            });
          
        }

        reader.onerror = (error) => {
          setError(error.message)
          setIsScanning(false)
        }
      } else {
          const card_id = "e81c6c64-c040-444d-92c2-419a8847e370";
        await fetch('https://trialdev.amanadhikari.me/nfc', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ card_id: card_id }),
            });
        setError("Web NFC is not supported on this browser.")
        console.log("Web NFC is not supported on this browser.");
        setIsScanning(false)
      }
    } catch (err) {
      setError(err.message)
      setIsScanning(false)
    }
  }

  const resetScanner = () => {
    setNfcData(null)
    setError(null)
    setShowSuccess(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NFC Scanner</h1>
          <p className="text-gray-600">Tap your NFC card to scan</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          {/* Scanning Animation */}
          <div className="relative mb-8">
            <div
              className={`mx-auto w-32 h-32 rounded-full border-4 border-dashed transition-all duration-500 flex items-center justify-center ${
                isScanning
                  ? "border-blue-500 animate-spin bg-blue-50"
                  : showSuccess
                    ? "border-green-500 bg-green-50"
                    : error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
              }`}
            >
              {isScanning ? (
                <Wifi className="w-12 h-12 text-blue-500 animate-pulse" />
              ) : showSuccess ? (
                <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
              ) : error ? (
                <AlertCircle className="w-12 h-12 text-red-500" />
              ) : (
                <Scan className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Ripple effect for scanning */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-2 border-blue-300 animate-ping opacity-20"></div>
                <div className="absolute w-40 h-40 rounded-full border-2 border-blue-200 animate-ping opacity-10 animation-delay-200"></div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={nfcData ? resetScanner : scanNFC}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
              isScanning
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : nfcData
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-lg"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg"
            } ${!isScanning ? "hover:shadow-xl" : ""}`}
            disabled={isScanning}
          >
            {isScanning ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Scanning...
              </div>
            ) : nfcData ? (
              "Scan Another Card"
            ) : (
              "Start NFC Scan"
            )}
          </button>

          {/* Status Messages */}
          <div className="mt-6 space-y-4">
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">Scan Failed</h3>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {nfcData && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 mb-2">Card Detected!</h3>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-600 mb-1 font-medium">CARD DATA:</p>
                      <code className="text-green-800 font-mono text-sm break-all">{nfcData}</code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center">
          <p className="text-gray-600 text-sm">
            {isScanning
              ? "Hold your NFC card near your device..."
              : "Make sure NFC is enabled on your device and tap the scan button to begin"}
          </p>
        </div>
      </div>

      <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animation-delay-200 {
                    animation-delay: 200ms;
                }
            `}</style>
    </div>
  )
}
