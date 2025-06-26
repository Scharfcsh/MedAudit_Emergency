"use client"
import { useState, useRef } from "react"
import { Smartphone, Wifi, AlertCircle, CheckCircle2, Scan, QrCode, Camera } from "lucide-react"
import QrScanner from 'qr-scanner'

export default function NFCScanner() {
  const [nfcData, setNfcData] = useState(null)
  const [error, setError] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [scanMode, setScanMode] = useState('nfc') // 'nfc' or 'qr'
  const [isQrScanning, setIsQrScanning] = useState(false)
  const videoRef = useRef(null)
  const qrScannerRef = useRef(null)

  const processCardData = async (cardId) => {
    setNfcData(cardId)
    setIsScanning(false)
    setIsQrScanning(false)
    setShowSuccess(true)

    // Auto-hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
    
    try {
      await fetch('https://trialdev.amanadhikari.me/nfc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: cardId }),
      });
    } catch (error) {
      console.error('Failed to send card data:', error);
    }
  }

  const scanQR = async () => {
    setError(null)
    setIsQrScanning(true)
    setShowSuccess(false)
    setScanMode('qr')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            const url = result.data;
            const urlMatch = url.match(/card_id=([^&]+)/);
            const cardId = urlMatch ? urlMatch[1] : url;
            
            // Stop scanning and camera
            qrScannerRef.current.stop();
            stream.getTracks().forEach(track => track.stop());
            
            processCardData(cardId);
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        
        qrScannerRef.current.start();
      }
    } catch (err) {
      setError(err.message || "Failed to access camera for QR scanning");
      setIsQrScanning(false);
    }
  }

  const scanNFC = async () => {
    setError(null)
    setIsScanning(true)
    setShowSuccess(false)
    setScanMode('nfc')

    try {
      if ("NDEFReader" in window) {
        const reader = new NDEFReader()
        await reader.scan()

        reader.onreading = async (event) => {
          const data = event.message.records[0].data
          const text = new TextDecoder().decode(data)
          const urlMatch = text.match(/card_id=([^&]+)/)
          const cardId = urlMatch ? urlMatch[1] : text
          await processCardData(cardId)
        }

        reader.onerror = (error) => {
          setError(error.message)
          setIsScanning(false)
        }
      } else {
        setError("Web NFC is not supported on this browser.")
        console.log("Web NFC is not supported on this browser.");
        setIsScanning(false)
      }
    } catch (err) {
      setError(err.message)
      setIsScanning(false)
    }
  }

  const stopQrScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsQrScanning(false);
  }

  const resetScanner = () => {
    setNfcData(null)
    setError(null)
    setShowSuccess(false)
    setScanMode('nfc')
    stopQrScanning()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            {scanMode === 'qr' ? <QrCode className="w-8 h-8 text-white" /> : <Smartphone className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Card Scanner</h1>
          <p className="text-gray-600">Scan your card using NFC or QR code</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          {/* Mode Selection */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setScanMode('nfc')
                stopQrScanning()
                setError(null)
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                scanMode === 'nfc'
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              NFC Scan
            </button>
            <button
              onClick={() => {
                setScanMode('qr')
                setIsScanning(false)
                setError(null)
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                scanMode === 'qr'
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR Scan
            </button>
          </div>

          {/* QR Code Video */}
          {scanMode === 'qr' && isQrScanning && (
            <div className="mb-6">
              <video 
                ref={videoRef} 
                className="w-full h-64 object-cover rounded-xl bg-black"
                playsInline 
                muted
              />
            </div>
          )}

          {/* Scanning Animation */}
          {(!isQrScanning || scanMode === 'nfc') && (
            <div className="relative mb-8">
              <div
                className={`mx-auto w-32 h-32 rounded-full border-4 border-dashed transition-all duration-500 flex items-center justify-center ${
                  isScanning || isQrScanning
                    ? scanMode === 'qr' ? "border-purple-500 animate-spin bg-purple-50" : "border-blue-500 animate-spin bg-blue-50"
                    : showSuccess
                      ? "border-green-500 bg-green-50"
                      : error
                        ? "border-red-500 bg-red-50"
                        : scanMode === 'qr' ? "border-purple-300 bg-purple-50" : "border-gray-300 bg-gray-50"
                }`}
              >
                {isScanning || isQrScanning ? (
                  scanMode === 'qr' ? (
                    <Camera className="w-12 h-12 text-purple-500 animate-pulse" />
                  ) : (
                    <Wifi className="w-12 h-12 text-blue-500 animate-pulse" />
                  )
                ) : showSuccess ? (
                  <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                ) : error ? (
                  <AlertCircle className="w-12 h-12 text-red-500" />
                ) : scanMode === 'qr' ? (
                  <QrCode className="w-12 h-12 text-purple-400" />
                ) : (
                  <Scan className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* Ripple effect for scanning */}
              {(isScanning || isQrScanning) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full border-2 animate-ping opacity-20 ${
                    scanMode === 'qr' ? 'border-purple-300' : 'border-blue-300'
                  }`}></div>
                  <div className={`absolute w-40 h-40 rounded-full border-2 animate-ping opacity-10 animation-delay-200 ${
                    scanMode === 'qr' ? 'border-purple-200' : 'border-blue-200'
                  }`}></div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Main Action Button */}
            <button
              onClick={nfcData ? resetScanner : (scanMode === 'qr' ? (isQrScanning ? stopQrScanning : scanQR) : scanNFC)}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                isScanning || isQrScanning
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : nfcData
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-lg"
                    : scanMode === 'qr'
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 hover:scale-105 shadow-lg"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg"
              } ${!(isScanning || isQrScanning) ? "hover:shadow-xl" : ""}`}
              disabled={isScanning || isQrScanning}
            >
              {isScanning || isQrScanning ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  {scanMode === 'qr' ? 'Scanning QR...' : 'Scanning NFC...'}
                </div>
              ) : nfcData ? (
                "Scan Another Card"
              ) : scanMode === 'qr' ? (
                isQrScanning ? "Stop QR Scan" : "Start QR Scan"
              ) : (
                "Start NFC Scan"
              )}
            </button>

            {/* Stop QR Scanning Button */}
            {isQrScanning && (
              <button
                onClick={stopQrScanning}
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
              >
                Stop Camera
              </button>
            )}
          </div>

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
              : isQrScanning
                ? "Point your camera at the QR code on the card..."
                : scanMode === 'qr'
                  ? "Make sure your camera is working and tap the scan button to begin QR scanning"
                  : "Make sure NFC is enabled on your device and tap the scan button to begin NFC scanning"}
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
