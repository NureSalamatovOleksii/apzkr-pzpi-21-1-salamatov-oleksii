import React, { useEffect, useState } from "react";
import { fetchUsers } from '../api';

function Users() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUsers().then(setData);
  }, []);

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Role</th>
            <th>IsEmailConfirmed</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.surname}</td>
              <td>{item.role}</td>
              <td>{'true'}</td>
              <td>{item.email}</td>
              <td>{'protected'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
