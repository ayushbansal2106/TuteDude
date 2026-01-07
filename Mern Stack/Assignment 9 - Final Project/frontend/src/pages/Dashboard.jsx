import React, { useEffect, useState } from 'react';
import { Table, Container, Badge, Button, Row, Col, Card } from 'react-bootstrap';
import API from '../api';

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // This "trigger" number is the secret key. 
  // Whenever we change it (e.g., set it to 1, 2, 3...), the useEffect runs again.
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. The Fetch Logic is now SAFELY inside useEffect
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const { data } = await API.get('/visitors');
        setVisitors(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchVisitors();
  }, [refreshKey]); // <--- Only runs when component loads or refreshKey changes

  // Handle Check-In / Check-Out
  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/visitors/${id}`, { status: newStatus });
      alert(`Visitor Marked as ${newStatus}`);
      
      // Instead of calling a function, we just bump the key number
      // This forces the useEffect above to run again automatically.
      setRefreshKey(oldKey => oldKey + 1);
      
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Admin Dashboard</h2>
          <p className="text-muted">Manage real-time visitor entries.</p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm border-primary">
            <Card.Body>
              <h3>{visitors.length}</h3>
              <p>Total Visitors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <h3>{visitors.filter(v => v.status === 'checked-in').length}</h3>
              <p>Currently Inside</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm border-danger">
            <Card.Body>
              <h3>{visitors.filter(v => v.status === 'checked-out').length}</h3>
              <p>Checked Out</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search & Filter */}
      <Row className="mb-3">
        <Col md={8}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
          />
        </Col>
        <Col md={4}>
          <select 
            className="form-control" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="checked-in">Checked In</option>
            <option value="checked-out">Checked Out</option>
          </select>
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-dark text-white">
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Current Status</th>
            <th>Entry Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors
            .filter(v => 
              (v.name?.toLowerCase() || '').includes(search.toLowerCase()) && 
              (filterStatus === 'all' || v.status === filterStatus)
            )
            .map((v) => (
            <tr key={v._id}>
              <td style={{verticalAlign: 'middle'}}>{v.name}</td>
              <td style={{verticalAlign: 'middle'}}>{v.purpose}</td>
              <td style={{verticalAlign: 'middle'}}>
                <Badge 
                  bg={v.status === 'checked-in' ? 'success' : v.status === 'checked-out' ? 'danger' : 'warning'}
                >
                  {v.status?.toUpperCase()}
                </Badge>
              </td>
              <td style={{verticalAlign: 'middle'}}>
                {v.entryTime ? new Date(v.entryTime).toLocaleTimeString() : '-'}
              </td>
              <td>
                {v.status === 'pending' && (
                  <Button size="sm" variant="success" onClick={() => handleStatusChange(v._id, 'checked-in')}>
                    Check In
                  </Button>
                )}
                {v.status === 'checked-in' && (
                  <Button size="sm" variant="danger" onClick={() => handleStatusChange(v._id, 'checked-out')}>
                    Check Out
                  </Button>
                )}
                {v.status === 'checked-out' && (
                  <span className="text-muted">Visit Complete</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Dashboard;