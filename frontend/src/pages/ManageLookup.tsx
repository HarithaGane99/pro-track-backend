import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface ManageLookupProps {
  title: string;
  endpoint: string;
}

const ManageLookup: React.FC<ManageLookupProps> = ({ title, endpoint }) => {
  const [items, setItems] = useState<{id: number, name: string}[]>([]);
  const [newName, setNewName] = useState('');

  const fetchData = async () => {
    const res = await api.get(endpoint);
    setItems(res.data);
  };

  useEffect(() => { fetchData(); }, [endpoint]);

  const handleAdd = async () => {
    await api.post(endpoint, { name: newName });
    setNewName('');
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if(window.confirm("Delete this?")) {
      await api.delete(`${endpoint}/${id}`);
      fetchData();
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow mb-6 text-black">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex gap-2 mb-4">
        <input 
          className="border p-2 flex-1 rounded" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`Add new ${title.toLowerCase()}`}
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex justify-between border-b py-2">
            <span>{item.name}</span>
            <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageLookup;