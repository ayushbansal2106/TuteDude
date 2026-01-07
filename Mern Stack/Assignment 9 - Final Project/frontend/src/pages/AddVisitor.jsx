import React, { useState, useRef } from 'react'; // <--- 1. Added useRef
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import Webcam from 'react-webcam';
import { useReactToPrint } from 'react-to-print';
import API from '../api';

const AddVisitor = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [photo, setPhoto] = useState(null);
  const [generatedQR, setGeneratedQR] = useState(null);

  const webcamRef = useRef(null);
  const componentRef = useRef(); // <--- Reference for PDF area

  // Function to capture photo
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  }, [webcamRef]);

  // Function to download PDF - Fixed Logic
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Updated for newer react-to-print versions
    documentTitle: 'Visitor_Pass',
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // <--- 2. Sending 'photo' in the body now
      const { data } = await API.post('/visitors', { 
        name, 
        email, 
        phone, 
        purpose, 
        photo 
      });
      
      alert('Visitor Added & Pass Generated!');
      setGeneratedQR(JSON.stringify({ id: data._id, name: data.name }));
    } catch (error) {
      console.error(error);
      alert('Error adding visitor: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        {/* LEFT: Form & Camera */}
        <Col md={6}>
          <h3>1. Enter Details & Capture Photo</h3>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                <option value="">Select Purpose...</option>
                <option value="Meeting">Meeting</option>
                <option value="Interview">Interview</option>
              </Form.Select>
            </Form.Group>

            {/* Webcam Section */}
            <div className="mb-3 border p-2 text-center">
              {photo ? (
                <img src={photo} alt="Taken" style={{ width: '200px' }} />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={200}
                />
              )}
              <br />
              <Button variant="secondary" size="sm" onClick={capture} type="button" className="mt-2">
                Capture Photo
              </Button>
              <Button variant="danger" size="sm" onClick={() => setPhoto(null)} type="button" className="mt-2 ms-2">
                Retake
              </Button>
            </div>

            <Button variant="primary" type="submit" className="w-100">Generate Pass</Button>
          </Form>
        </Col>

        {/* RIGHT: The Printable Pass */}
        <Col md={6} className="d-flex flex-column align-items-center">
          <h3>2. Digital Badge</h3>
          {generatedQR ? (
            <>
              {/* <--- 3. This div gets printed */}
              <div ref={componentRef} className="border border-dark p-4 m-3 text-center" style={{ width: '300px', backgroundColor: 'white' }}>
                <h4 className="text-uppercase fw-bold mb-3">Visitor Pass</h4>
                {photo && <img src={photo} alt="Visitor" style={{ width: '100px', borderRadius: '50%', marginBottom: '10px' }} />}
                <div className="my-2">
                  <QRCode value={generatedQR} size={120} />
                </div>
                <h5 className="mt-2">{name}</h5>
                <p className="text-muted mb-0">{email}</p>
                <p className="badge bg-dark mt-2">{purpose}</p>
                <p className="mt-3 text-muted" style={{ fontSize: '12px' }}>Authorized Entry</p>
              </div>

              {/* <--- 4. Correct print handler */}
              <Button variant="success" onClick={handlePrint}>Download / Print PDF</Button>
            </>
          ) : (
             <p className="text-muted">Fill details to see pass preview.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AddVisitor;