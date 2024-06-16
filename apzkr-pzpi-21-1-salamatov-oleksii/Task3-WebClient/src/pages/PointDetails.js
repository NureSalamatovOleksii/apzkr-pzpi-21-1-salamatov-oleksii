import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function PointDetails() {
    const { pointId } = useParams();
    const [pointData, setPointData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        fetch(`https://localhost:7051/api/CollectionPoint/GetCollectionPoint/${pointId}`)
            .then(response => response.json())
            .then(data => setPointData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [pointId]);

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if (name in pointData) {
            setPointData({ ...pointData, [name]: value });
        } else {
            const newComposition = [...pointData.collectionPointComposition];
            newComposition[index][name] = value;
            setPointData({ ...pointData, collectionPointComposition: newComposition });
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        fetch(`https://api.example.com/points/${pointId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pointData),
        })
            .then(response => response.json())
            .then(data => {
                setPointData(data);
                setIsEditing(false);
            })
            .catch(error => console.error('Error saving data:', error));
    };

    const handleReportCreating = () => {
        const firstDate = startDate.toLocaleDateString('en-GB').split("/").join(".");
        const secondDate = endDate.toLocaleDateString('en-GB').split("/").join(".");
        const pointId = 4;
    
        fetch(`https://localhost:7051/api/CollectionPoint/CreateReport?pointID=${pointId}&startDate=${firstDate}&endDate=${secondDate}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ pointId, startDate, endDate })
        })
        .then(response => {
            response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                //a.download = 'report.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    if (!pointData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div class="float-right">
                <h5>Select Date Range</h5>
                <div className="mb-2">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                    />
                </div>
                <div className="mb-2">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="End Date"
                    />
                </div>
                <button className="border-0" onClick={handleReportCreating}>
                    Get Report
                </button>
            </div>
            <h4>Collection Point №{pointId}</h4>
            
            {isEditing ? (
                <div className="form-group">
                    <div className="mb-3">
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="location"
                            name="location"
                            value={pointData.location}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="status">Status:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="status"
                            name="status"
                            value={pointData.status}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fullness">Fullness:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="fullness"
                            name="fullness"
                            value={pointData.fullness}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="row">
                        {pointData.collectionPointComposition.map((item, index) => (
                            <div key={item.id} className="col-md-3 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{item.trashType}</h5>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`weight-${item.id}`}>Weight:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`weight-${item.id}`}
                                                name="weight"
                                                value={item.weight}
                                                onChange={(e) => handleInputChange(e, index)}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`volume-${item.id}`}>Volume:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`volume-${item.id}`}
                                                name="volume"
                                                value={item.volume}
                                                onChange={(e) => handleInputChange(e, index)}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`maxVolume-${item.id}`}>Max Volume:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`maxVolume-${item.id}`}
                                                name="maxVolume"
                                                value={item.maxVolume}
                                                onChange={(e) => handleInputChange(e, index)}
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor={`fullness-${item.id}`}>Fullness:</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`fullness-${item.id}`}
                                                name="fullness"
                                                value={item.fullness}
                                                onChange={(e) => handleInputChange(e, index)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <p>Location: {pointData.location}</p>
                    <p>Status: {pointData.status}</p>
                    <p>Fullness: {pointData.fullness}</p>
                    <h5 className="mb-3">Composition</h5>
                    <div className="row">
                        {pointData.collectionPointComposition.map(item => (
                            <div key={item.id} className="col-md-3 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{item.trashType}</h5>
                                        <p>Weight: {item.weight}</p>
                                        <p>Volume: {item.volume}</p>
                                        <p>Max Volume: {item.maxVolume}</p>
                                        <p>Fullness: {item.fullness}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button className="btn btn-secondary mt-3 mr-2" onClick={handleEditToggle}>
                {isEditing ? "Cancel" : "Edit"}
            </button>
            <button className="btn btn-outline-danger mt-3" onClick={handleEditToggle}>
                {isEditing ? "Cancel" : "Delete"}
            </button>
        </div>
    );
}

export default PointDetails;
