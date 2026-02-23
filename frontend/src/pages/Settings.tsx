import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Settings: React.FC = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [newCat, setNewCat] = useState('');
  const [newLoc, setNewLoc] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [catRes, locRes] = await Promise.all([
        api.get('/categories', { headers }),
        api.get('/locations', { headers })
      ]);
      setCategories(catRes.data);
      setLocations(locRes.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddCategory = async () => {
    if (!newCat) return;
    await api.post('/categories', { name: newCat }, { headers });
    setNewCat('');
    fetchData();
  };

  const handleAddLocation = async () => {
    if (!newLoc) return;
    await api.post('/locations', { name: newLoc }, { headers });
    setNewLoc('');
    fetchData();
  };

  const handleDelete = async (type: 'categories' | 'locations', id: number) => {
    if (window.confirm(`Delete this ${type.slice(0, -1)}?`)) {
      try {
        await api.delete(`/${type}/${id}`, { headers });
        fetchData();
      } catch (err) {
        alert("Cannot delete: This item is currently used by an asset.");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manage Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex gap-2 mb-4">
            <input 
              className="border p-2 flex-1 rounded text-black" 
              value={newCat} 
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Add Category"
            />
            <button onClick={handleAddCategory} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </div>
          <ul className="divide-y">
            {categories.map(c => (
              <li key={c.id} className="py-2 flex justify-between items-center">
                <span>{c.name}</span>
                <button onClick={() => handleDelete('categories', c.id)} className="text-red-500">Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Manage Locations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Locations</h2>
          <div className="flex gap-2 mb-4">
            <input 
              className="border p-2 flex-1 rounded text-black" 
              value={newLoc} 
              onChange={(e) => setNewLoc(e.target.value)}
              placeholder="Add Location"
            />
            <button onClick={handleAddLocation} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </div>
          <ul className="divide-y">
            {locations.map(l => (
              <li key={l.id} className="py-2 flex justify-between items-center">
                <span>{l.name}</span>
                <button onClick={() => handleDelete('locations', l.id)} className="text-red-500">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;