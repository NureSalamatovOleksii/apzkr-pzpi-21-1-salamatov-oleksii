import React, { Component } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <h1>Hello, user!</h1>
        <h3>Welcome to our new generation-service of convenient garbage collection and recycling</h3>
        <p>To get full access to our app you need to register your account</p>
        <div className='text-center'>
          <img src='https://freevector-images.s3.amazonaws.com/uploads/vector/preview/41335/Vector4free-Recycling-Concept-Background-Revisi1-DP0622_generated.jpg' style={{width: '40%'}} className="img-fluid"></img>
        </div>
        <Container className="mt-5">
          <Row className="mb-5">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>User-Centric Design</Card.Title>
                  <Card.Text>
                    Our ReactJS-based interface ensures a seamless and intuitive experience. Every click and interaction is designed with the user in mind, offering an unparalleled journey through the garbage collection and recycling process.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Responsive and Adaptive</Card.Title>
                  <Card.Text>
                    Bootstrap's responsiveness ensures that our system adapts flawlessly to various devices, whether you're accessing it on a desktop, tablet, or mobile phone. Efficient waste management should be accessible anywhere, anytime.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Add more Card components for other features */}

          <Row className="mt-5">
            <Col>
              <h2 className="text-center mb-4">Why Recycling is Crucial</h2>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Environmental Protection</Card.Title>
                  <Card.Text>
                    Recycling helps to reduce the pollution caused by waste. By converting waste materials into new products, we can save energy, reduce greenhouse gas emissions, and limit the amount of waste sent to landfills.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Resource Conservation</Card.Title>
                  <Card.Text>
                    Recycling conserves natural resources such as timber, water, and minerals. It helps to sustain the environment for future generations and reduces the need for new raw materials.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Add more Card components for other benefits */}

          <Row className="mt-5">
            <Col>
              <h2 className="text-center mb-4">Join Us in Making a Difference</h2>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Text>
                    As developers, our mission goes beyond lines of code. We invite you to embark on this journey with us, contributing not just to efficient waste management but also to a sustainable future. Together, let's make the act of recycling a shared expression of environmental responsibility and community strength.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col>
              <img
                src="https://via.placeholder.com/1200x400"
                alt="Recycling Campaign"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
