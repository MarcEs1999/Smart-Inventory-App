// src/components/Inventory/ZXingBarcodeScanning.js
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Box, Button } from "@mui/material";

const ZXingBarcodeScanning = ({ onScan, onError }) => {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [reader, setReader] = useState(null);

  useEffect(() => {
    // Create a new ZXing reader instance
    const codeReader = new BrowserMultiFormatReader();
    setReader(codeReader);
    return () => {
      codeReader.reset();
    };
  }, []);

  const capture = async () => {
    if (!webcamRef.current || !reader) return;
    // Get a screenshot as a base64 encoded image
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        // Create an Image element from the screenshot
        const img = new Image();
        img.src = imageSrc;
        img.onload = async () => {
          try {
            // Try to decode a barcode from the image element
            const result = await reader.decodeFromImage(img);
            if (result) {
              onScan(result.getText());
              setScanning(false); // Stop scanning once a barcode is found
            }
          } catch (error) {
            // No barcode found in this frame; ignoring error
          }
        };
      } catch (error) {
        if (onError) onError(error);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (scanning) {
      // Capture a frame every second while scanning
      interval = setInterval(() => {
        capture();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanning, reader]);

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Button variant="contained" onClick={() => setScanning(!scanning)}>
        {scanning ? "Stop Scanning" : "Start Scanning"}
      </Button>
      <Box sx={{ mt: 2 }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: "100%", borderRadius: 2 }}
        />
      </Box>
    </Box>
  );
};

export default ZXingBarcodeScanning;