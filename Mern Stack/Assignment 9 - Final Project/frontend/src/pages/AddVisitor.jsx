import React, { useState, useRef } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap'; // <--- Added Spinner
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
  const [loading, setLoading] = useState(false); // <--- New Loading State

  const webcamRef = useRef(null);
  const componentRef = useRef();

  // OPTIMIZATION: Limit camera resolution to make upload fast (480p is enough for badges)
  const videoConstraints = {
    width: 480,
    height: 360,
    facingMode: "user"
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  }, [webcamRef]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Visitor_Pass',
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // <--- Start Loading

    try {
      const { data } = await API.post('/visitors', { 
        name, 
        email, 
        phone, 
        purpose, 
        photo 
      });
      
      setGeneratedQR(JSON.stringify({ id: data._id, name: data.name }));
      alert('Visitor Added!');
    } catch (error) {
      console.error(error);
      alert('Error adding visitor: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false); // <--- Stop Loading (Success or Fail)
    }
  };

  return (
    <Container className="mt-4">
      <Row>
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
                <option value="Delivery">Delivery</option>
              </Form.Select>
            </Form.Group>

            <div className="mb-3 border p-2 text-center">
              {photo ? (
                <img src={photo} alt="Taken" style={{ width: '100%', maxWidth: '300px' }} />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  videoConstraints={videoConstraints} // <--- Apply Size Limit
                />
              )}
              <br />
              <div className="mt-2">
                {!photo && (
                    <Button variant="secondary" size="sm" onClick={capture} type="button">
                        Capture Photo
                    </Button>
                )}
                {photo && (
                    <Button variant="danger" size="sm" onClick={() => setPhoto(null)} type="button" className="ms-2">
                        Retake
                    </Button>
                )}
              </div>
            </div>

            {/* GENERATE BUTTON WITH LOADER */}
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Generating Pass...
                </>
              ) : (
                'Generate Pass'
              )}
            </Button>
          </Form>
        </Col>

        <Col md={6} className="d-flex flex-column align-items-center mt-4 mt-md-0">
          <h3>2. Digital Badge</h3>
          {generatedQR ? (
            <>
              <div ref={componentRef} className="border border-dark p-4 m-3 text-center" style={{ width: '300px', backgroundColor: 'white' }}>
                <h4 className="text-uppercase fw-bold mb-3">Visitor Pass</h4>
                {photo && <img src={photo} alt="Visitor" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }} />}
                <div className="my-2">
                  <QRCode value={generatedQR} size={120} />
                </div>
                <h5 className="mt-2">{name}</h5>
                <p className="text-muted mb-0">{email}</p>
                <p className="badge bg-dark mt-2">{purpose}</p>
                <p className="mt-3 text-muted" style={{ fontSize: '12px' }}>Authorized Entry</p>
              </div>

              <Button variant="success" onClick={handlePrint}>Download / Print PDF</Button>
            </>
          ) : (
             <div className="text-muted p-5 border border-dashed w-100 text-center">
                {loading ? 'Processing...' : 'Fill details to see pass preview.'}
             </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AddVisitor;