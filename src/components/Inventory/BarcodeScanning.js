// src/components/Inventory/BarcodeScanning.js
import React, { useState } from "react";
import BarcodeReader from "react-barcode-reader";

const BarcodeScanner = ({ onScan, onError }) => {
  const [scanning, setScanning] = useState(false);

  return (
    <div>
      {scanning ? (
        <div>
          <BarcodeReader
            onError={(err) => {
              console.error("Barcode scan error:", err);
              if (onError) onError(err);
            }}
            onScan={(data) => {
              if (data) {
                onScan(data);
                setScanning(false);
              }
            }}
          />
          <p>Scanning... (click to stop)</p>
          <button onClick={() => setScanning(false)}>Stop Scanning</button>
        </div>
      ) : (
        <button onClick={() => setScanning(true)}>Start Barcode Scan</button>
      )}
    </div>
  );
};

export default BarcodeScanner;