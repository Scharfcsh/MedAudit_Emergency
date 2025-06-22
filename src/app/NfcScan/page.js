
'use client';
import { useState, useEffect } from 'react';

export default function NFCScanner() {
    const [nfcData, setNfcData] = useState(null);
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const scanNFC = async () => {
        setError(null);
        setIsScanning(true);

        try {
            if ('NDEFReader' in window) {
                const reader = new NDEFReader();
                await reader.scan();
                
                reader.onreading = (event) => {
                    const data = event.message.records[0].data;
                    const text = new TextDecoder().decode(data);
                    setNfcData(text);

                    // Send to server
                    // fetch("http://your-server-ip:3000/nfc", {
                    //     method: "POST",
                    //     headers: { "Content-Type": "application/json" },
                    //     body: JSON.stringify({ nfc: text }),
                    // }).catch(err => {
                    //     console.error('Error sending NFC data to server:', err);
                    // });
                };

                reader.onerror = (error) => {
                    setError(error.message);
                    setIsScanning(false);
                };
            } else {
                setError("Web NFC is not supported on this browser.");
                setIsScanning(false);
            }
        } catch (err) {
            setError(err.message);
            setIsScanning(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">NFC Card Scanner</h1>
            
            <button
                onClick={scanNFC}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={isScanning}
            >
                {isScanning ? 'Scanning...' : 'Start NFC Scan'}
            </button>

            {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {nfcData && (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
                    <h2 className="font-bold">Card Data:</h2>
                    <pre>{nfcData}</pre>
                </div>
            )}
        </div>
    );
}