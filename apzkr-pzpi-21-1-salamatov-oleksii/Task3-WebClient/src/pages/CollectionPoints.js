import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import Map, { Marker, Popup } from 'react-map-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';

function CollectionPoints() {
    const { t } = useTranslation();
    const [points, setPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);

    useEffect(() => {
        fetch("https://localhost:7051/api/CollectionPoint/GetCollectionPoints")
            .then(response => response.json())
            .then(data => setPoints(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const mapContainerStyle = {
        width: '100%',
        height: '500px'
    };

    const center = {
        latitude: 50.005830,
        longitude: 36.228945
    };

    const getTrashTypesString = (composition) => {
        return composition.map(item => item.trashType).join(', ');
    };

    const getColorByFullness = (fullness) => {
        if (fullness > 75) return 'red';
        if (fullness > 50) return 'orange';
        if (fullness > 25) return 'yellow';
        return 'green';
    };

    const FullnessIndicator = ({ fullness }) => (
        <div style={{ 
            width: '100%', 
            backgroundColor: getColorByFullness(fullness), 
            color: 'white', 
            textAlign: 'center', 
            borderRadius: '3px', 
            padding: '5px 0',
            opacity: '0.7' 
        }}>
            {fullness}%
        </div>
    );

    return (
        <div>
            <h4 className="mb-3">{t('pointAddresses')}</h4>
            <Row>
                <Col md={6}>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <Container>
                            <Row>
                                {points.map(point => (
                                    <Col key={point.id} md={6} className="mb-3">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>{t('pointId')}: {point.id}</Card.Title>
                                                <Card.Text>
                                                    {t('status')}: {point.status}<br />
                                                    {t('acceptedTypes')}: {getTrashTypesString(point.collectionPointComposition)}<br />
                                                    {t('fullness')}: <FullnessIndicator fullness={point.fullness} /><br />
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    </div>
                </Col>
                <Col md={6}>
                    <Map
                        initialViewState={{
                            latitude: center.latitude,
                            longitude: center.longitude,
                            zoom: 10
                        }}
                        style={mapContainerStyle}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        mapboxAccessToken="pk.eyJ1Ijoib2xla3NpeXkiLCJhIjoiY2x2ejQ3am9wMWJ0dTJrb2dqMmtoMzVzNSJ9.poCEnt5lJRlocbukSzazZQ"
                    >
                        {points.map(point => (
                            point.location !== "string" &&
                            <Marker 
                                key={point.id} 
                                latitude={parseFloat(point.location.split(' ')[0])} 
                                longitude={parseFloat(point.location.split(' ')[1])}
                                onClick={() => setSelectedPoint(point)}
                            >
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '-25px', 
                                        left: '50%', 
                                        transform: 'translateX(-50%)', 
                                        background: 'white', 
                                        padding: '2px 5px', 
                                        borderRadius: '3px', 
                                        color: 'red', 
                                        fontWeight: 'bold'
                                    }}>
                                        {point.id}
                                    </div>
                                    <div style={{ 
                                        width: '5px', 
                                        height: '5px', 
                                        backgroundColor: 'black', 
                                        borderRadius: '50%' 
                                    }}></div>
                                </div>
                            </Marker>
                        ))}
                        
                        {selectedPoint && (
                            <Popup
                                latitude={parseFloat(selectedPoint.location.split(' ')[0])}
                                longitude={parseFloat(selectedPoint.location.split(' ')[1])}
                                onClose={() => setSelectedPoint(null)}
                            >
                                <div>
                                    <h4>{t('point id')}: {selectedPoint.id}</h4>
                                    <p>{t('status')}: {selectedPoint.status}</p>
                                    <p>{t('accepted types')}: {getTrashTypesString(selectedPoint.collectionPointComposition)}</p>
                                    <p>{t('fullness')}: {selectedPoint.fullness}%</p>
                                </div>
                            </Popup>
                        )}
                    </Map>
                </Col>
            </Row>
        </div>
    );
}

export default CollectionPoints;
