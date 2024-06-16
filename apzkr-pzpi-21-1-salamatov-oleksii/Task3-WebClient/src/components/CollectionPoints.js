import React, { useEffect, useState } from "react";
import { fetchCollectionPoints } from '../api';
import { Link } from "react-router-dom";

function CollectionPoints() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCollectionPoints().then(setData);
  }, []);

  const getTrashTypesString = (composition) => {
    return composition.map(item => item.trashType).join(', ');
  };

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Location</th>
            <th>Status</th>
            <th>Fullness</th>
            <th>Accepted types</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.location}</td>
              <td>{item.status}</td>
              <td>{item.fullness}</td>
              <td>{getTrashTypesString(item.collectionPointComposition)}</td>
              <td><Link to={`/pointDetails/${item.id}`}>Details</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollectionPoints;
