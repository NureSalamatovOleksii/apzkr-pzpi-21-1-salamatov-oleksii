import React, { useEffect, useState } from "react";
import { ModalDialog } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { Label } from "reactstrap";
import Users from "../components/Users";
import CollectionPoints from "../components/CollectionPoints";

function Data({refresh}) {
  const [activeMenuItem, setActiveMenuItem] = useState('item3'); // Set a default active menu item
  const [message, setMessage] = useState('');

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/import', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setMessage(data.message); // Update message state with server response
    } catch (error) {
      console.error('Error importing data:', error);
      setMessage('Error importing data. Please try again.');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('https://localhost:7051/api/Data/ExportDatabase');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exported_data.bak';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage('Error exporting data. Please try again.');
    }
  };

  //alert(refresh);
  
  return (
    <div>
      <h4>Manage Data</h4>
      <div className="float-right">
        <div className="mb-1">
          <input type="file" name="customFileInput" onChange={handleImport} /> {/* Устанавливаем имя для элемента input */}
          <button className="border-0" onClick={handleExport}>Import Data</button>
        </div>
        <div className="float-right mb-2">
          <button className="border-0" onClick={handleExport}>Export Data</button>
        </div>
        {/* <div>
          <input type="file" onChange={handleImport} />
        </div> */}
        {message && <p>{message}</p>}
      </div>
    {/* Menu items */}
    <button className="mr-1 border-0" onClick={() => setActiveMenuItem('item3')}>Users</button>
    <button className="mr-1 border-0" onClick={() => setActiveMenuItem('item2')}>Operations</button>
    <button className="mr-1 border-0" onClick={() => setActiveMenuItem('item4')}>Collection Points</button>
    <button className="mr-1 mb-3 border-0" onClick={() => setActiveMenuItem('item1')}>Transportations</button>
    <button className="border-0" onClick={() => setActiveMenuItem('item5')}>Recycling Points</button>

    {/* Render content based on the active menu item */}
    {activeMenuItem === 'item1' && <TransportationsItem />}
    {activeMenuItem === 'item2' && <OperationsItem />}
    {activeMenuItem === 'item3' && <Users />}
    {activeMenuItem === 'item4' && <CollectionPoints />}
    {/*activeMenuItem === 'item5' && <CollPointsItem />}*/}
  </div>
  );
}

// Transpoartations

function TransportationsItem() {
  const [transportations, setTransportations] = useState([]);
  console.log(localStorage.getItem('token'));

  useEffect(() => {
    fetch("https://localhost:7051/api/Transportation/GetTransportations", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTransportations(data);
      });
  }, []);

  function onUpdateTransportation(updatedTransportation) {
    const updatedTransportations = transportations.map((transportation) =>
      transportation.id === updatedTransportation.id ? updatedTransportation : transportation
    );
    setTransportations(updatedTransportations);
  }

  function onDeleteBank(id) {
    fetch(`https://localhost:7178/api/BloodBank/DeleteBloodBank/${id}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          const updatedTransportations = transportations.filter((transportation) => transportation.id !== id);
          setTransportations(updatedTransportations);
          console.log("Bank deleted successfully!");
        } else {
          console.error("Error deleting bank");
        }
      })
      .catch((error) => {
        console.error("Error deleting bank:", error.message);
      });
  }

  return (
    <div>
      <Transportations transportations={transportations} onUpdateCustomer={onUpdateTransportation} onDeleteBank={onDeleteBank} />
    </div>
  );
}

function Transportations({ transportations, onUpdateCustomer, onDeleteBank }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bloodBankID: "",
    name: "",
    address: "",
    workTime: "",
  });

  function handleCustomerUpdate(updatedCustomer) {
    setIsEditing(false);
    onUpdateCustomer(updatedCustomer);
  }

  function handleChange(e) {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  }

  function changeEditState(bank) {
    if (bank.bloodBankID === editForm.bloodBankID) {
      setIsEditing((isEditing) => !isEditing); // hides the form
    } else if (isEditing === false) {
      setIsEditing((isEditing) => !isEditing); // shows the form
    }
  }

  function captureEdit(clickedCustomer) {
    let filtered = transportations.filter((bank) => bank.bloodBankID === clickedCustomer.bloodBankID);
    setEditForm(filtered[0]);
  }

  return (
    <div>
      <button className="mb-2 btn btn-outline-secondary" onClick={() => AddBank()}>
        Create Transportation
      </button>
      {isEditing ? <EditBank editForm={editForm} handleChange={handleChange} handleCustomerUpdate={handleCustomerUpdate} /> : null}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Trash Type</th>
            <th>Weight</th>
            <th>Status</th>
            <th>Collection Time</th>
            <th>Delivery Time</th>
          </tr>
        </thead>
        <tbody>
          {transportations.map((bank) => (
            <Bank
              key={bank.bloodBankID}
              bank={bank}
              captureEdit={captureEdit}
              changeEditState={changeEditState}
              onDeleteBank={onDeleteBank}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bank({ bank, captureEdit, changeEditState, onDeleteBank }) {
  const { bloodBankID, name, address, workTime } = bank;

  return (
    <tr key={bloodBankID}>
      <td>{bloodBankID}</td>
      <td>{name}</td>
      <td>{address}</td>
      <td>{workTime}</td>
      <td>
        <button
          className="border-0"
          onClick={() => {
            captureEdit(bank);
            changeEditState(bank);
          }}
        >
          Edit
        </button>
        <button className="border-0 text-danger ml-2" onClick={() => onDeleteBank(bank.bloodBankID)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

function EditBank({ editForm, handleCustomerUpdate, handleChange }) {
  const { bloodBankID, name, address, workTime } = editForm;

  function handleEditForm(e) {
    e.preventDefault();
    fetch(`https://localhost:7178/api/BloodBank/UpdateBank/${bloodBankID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    })
      .then((resp) => {
        if (resp.status === 204) {
          handleCustomerUpdate(editForm);
        } else {
          return resp.json(); // Continue with normal JSON processing
        }
      })
      .then((updatedCustomer) => {
        if (updatedCustomer) {
          handleCustomerUpdate(updatedCustomer);
        }
      })
      .catch((error) => {
        console.error("Error updating bank:", error.message);
      });
  }
  return (
    <div>
      <h4>Edit Blood Bank</h4>
      <form onSubmit={handleEditForm}>
        <input type="text" name="name" value={name} onChange={handleChange} />
        <input type="text" name="address" value={address} onChange={handleChange} />
        <input type="text" name="workTime" value={workTime} onChange={handleChange} />
        <button type="submit">Submit Changes</button>
      </form>
    </div>
  );
}

function AddBank() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    workTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7178/api/BloodBank/AddBloodBank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful response
        console.log("Bank added successfully!");
      } else {
        // Handle error response
        console.error("Error adding bank");
      }
    } catch (error) {
      console.error("Error adding bank:", error.message);
    }
  };

  return (
    <div>
      <h4>Add Blood Bank</h4>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        <input type="text" name="workTime" value={formData.workTime} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// Operations

function OperationsItem() {
  const [operations, setOperations] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7051/api/Operation/GetOperations")
      .then((resp) => resp.json())
      .then((data) => {
        setOperations(data);
      });
  }, []);

  function onUpdateCustomer(updatedCustomer) {
    const updatedCustomers = operations.map((operation) =>
      operation.operationID === updatedCustomer.operationID ? updatedCustomer : operation
    );
    setOperations(updatedCustomers);
  }

  function onDeleteBank(bloodBankID) {
    fetch(`https://localhost:7178/api/BloodBank/DeleteBloodBank/${bloodBankID}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          const updatedBanks = operations.filter((bank) => bank.bloodBankID !== bloodBankID);
          setOperations(updatedBanks);
          console.log("Bank deleted successfully!");
        } else {
          console.error("Error deleting bank");
        }
      })
      .catch((error) => {
        console.error("Error deleting bank:", error.message);
      });
  }

  return (
    <div>
      <Operations operations={operations} onUpdateCustomer={onUpdateCustomer} onDeleteBank={onDeleteBank} />
    </div>
  );
}

function Operations({ operations, onUpdateCustomer, onDeleteBank }) {
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    id: "",
    trashType: "",
    volume: "",
    time: "",
    userID: "",
    collectionPointID: "",
  });

  function handleCustomerUpdate(updatedCustomer) {
    setIsEditing(false);
    onUpdateCustomer(updatedCustomer);
  }

  function handleChange(e) {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  }

  function changeEditState(bank) {
    if (bank.bloodBankID === editForm.operationID) {
      setIsEditing((isEditing) => !isEditing); // hides the form
    } else if (isEditing === false) {
      setIsEditing((isEditing) => !isEditing); // shows the form
    }
  }

  function captureEdit(clickedCustomer) {
    let filtered = operations.filter((operation) => operation.donationOperationID === clickedCustomer.donationOperationID);
    //    let filtered = operations.filter((operation) => operation.operationID === clickedCustomer.operationID);
    setEditForm(filtered[0]);
  }

  return (
    <div>
      {isEditing ? <EditOperation editForm={editForm} handleChange={handleChange} handleCustomerUpdate={handleCustomerUpdate} setShow={setIsEditing} /> : null}
      <table className="table table-striped" style={{fontSize: '13px'}}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Trash Type</th>
            <th>Volume</th>
            <th>Time</th>
            <th>User Id</th>
            <th>Point Id</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((operation) => (
            <Operation
              key={operation.id}
              operation={operation}
              captureEdit={captureEdit}
              changeEditState={changeEditState}
              onDeleteBank={onDeleteBank}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Operation({ operation, captureEdit, changeEditState, onDeleteBank }) {
  const {
    id,
    trashType,
    volume,
    time,
    userID,
    collectionPointID,
  } = operation;

  function convertUTCToLocalTime(utcTime) {
    const localTime = new Date(utcTime);
    return localTime.toLocaleString();
  }

  return (
    <tr key={id}>
      <td>{id}</td>
      <td>{trashType}</td>
      <td>{volume}</td>
      <td>{convertUTCToLocalTime(time)}</td>
      <td>{userID}</td>
      <td>{collectionPointID}</td>
      <td>
        <button
          className="border-0 mb-2"
          onClick={() => {
            captureEdit(operation);
            changeEditState(operation);
          }}
        >
          Edit
        </button>
        <button
          className="border-0 text-danger"
          onClick={() => onDeleteBank(operation.operationID)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function EditOperation({ editForm, handleCustomerUpdate, handleChange, setShow }) {
  const { trashType, time, volume, weight, collectionPointID, userID, id } = editForm;

  const statusOptions = ["metal", "glass", "paper", "plastic"]; // Add the possible status values

  const handleClose = () => setShow(false);
  
  function handleEditForm(e) {
    e.preventDefault();
    fetch(`https://localhost:7178/api/DonationOperation/UpdateOperation/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    })
      .then((resp) => {
        if (resp.status === 204) {
          // No Content, consider it a success
          handleCustomerUpdate(editForm);
        } else if (resp.ok) {
          return resp.json(); // Continue with normal JSON processing
        } else {
          throw new Error(`Unexpected response status: ${resp.status}`);
        }
      })
      .then((updatedCustomer) => {
        if (updatedCustomer) {
          handleCustomerUpdate(updatedCustomer);
        }
      })
      .catch((error) => {
        console.error("Error updating operation:", error.message);
      });
      window.location.reload();
  }
  
  return (
    <div  
      className="modal show"
      style={{ display: 'block', top: '20%'}}
    >
      <ModalDialog style={{boxShadow: '4px 4px 10px grey'}}>
        <Modal.Header>
          <h4>Operation №{id}</h4>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleEditForm}>
            <div className="row">
            <div className="col-md-6">
            <Label>
                Trash Type:
              </Label>
              <div>
              <select className="mb-2" style={{padding: '2.5px 35px'}} name="status" value={trashType} onChange={handleChange}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <Label>
                Weight:
              </Label>
                <input className="mb-2" type="text" name="volume" value={weight} onChange={handleChange} />
              <Label>
                Volume:
              </Label>
              <input className="mb-2" type="text" name="volume" value={volume} onChange={handleChange} />
              <Label>
                Time:
              </Label>
              <input className="mb-2" type="text" name="expiryTime" value={time} onChange={handleChange} />
            </div>
            
            <div className="col-md-6">
            <Label>
                Operation Id: 
              </Label>
              <input className="mb-2" type="text" name="collectionTime" value={id} onChange={handleChange} />
              <Label>
                User ID:
              </Label>
              <input className="mb-2" type="text" name="bloodBankID" value={userID} onChange={handleChange} />
              <Label>
                Point ID:
              </Label>
              <input className="mb-2" type="text" name="donorID" value={collectionPointID} onChange={handleChange} />
            </div>
            </div>
            
          </form>
        </Modal.Body>
      
        <Modal.Footer style={{float: 'left'}}>
          <button className="btn-primary border-0" type="submit">Submit Changes</button>
          <button className="btn-secondary border-0" onClick={handleClose}>Cancel</button>
        </Modal.Footer>
      </ModalDialog>
    </div>
  );
}

export default Data;