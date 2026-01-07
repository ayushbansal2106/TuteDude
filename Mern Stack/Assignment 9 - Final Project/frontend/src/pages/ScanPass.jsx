import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner'; // <--- The new library
import { Container, Card, Alert } from 'react-bootstrap';
import API from '../api';

const ScanPass = () => {
  const [message, setMessage] = useState('');
  const [scannedData, setScannedData] = useState(null);

  const handleScan = async (detectedCodes) => {
    // This library returns an array of detected codes
    if (detectedCodes && detectedCodes.length > 0) {
      const rawValue = detectedCodes[0].rawValue;
      
      // Prevent scanning the same code multiple times in a loop
      if (rawValue === scannedData) return;

      setScannedData(rawValue);

      try {
        const parsed = JSON.parse(rawValue);
        
        // Automatically Check In the visitor
        await API.put(`/visitors/${parsed.id}`, { status: 'checked-in' });
        setMessage(`Success! Checked in: ${parsed.name}`);
          setTimeout(() => {
            setScannedData(null);
            setMessage('');
        }, 3000);
        
      } catch (err) {
        console.error(err);
        setMessage('Invalid QR Code');
      }
    }
  };

  return (
    <Container className="mt-5 d-flex flex-column align-items-center">
      <h2>Security Scanner</h2>
      <Card className="p-3 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <p className="text-muted text-center">Point camera at Visitor Pass</p>
        
        {/* The Scanner Component */}
        <Scanner 
            onScan={handleScan} 
            allowMultiple={true} 
            scanDelay={2000} // Wait 2 seconds between scans
        />

      </Card>
      
      {message && (
        <Alert variant={message.includes('Success') ? 'success' : 'danger'} className="mt-3">
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default ScanPass;