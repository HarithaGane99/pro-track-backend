import React, { useState } from 'react';
import api from '../services/api';

interface AddAssetProps {
  onAssetAdded: () => void;
  onClose: () => void;
}

const AddAssetModal: React.FC<AddAssetProps> = ({ onAssetAdded, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    purchase_date: new Date().toISOString().split('T')[0],
    status: 'Healthy'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/assets', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onAssetAdded(); 
      onClose();     
    } catch (err) {
      console.error("Error adding asset", err);
      alert("Failed to add asset. Please check your data.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Add New Asset</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              text-black
              placeholder="Asset Name"
              className="w-full p-2 border rounded text-black"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="text"

              placeholder="Category (e.g. Cleaning, Tech)"
              className="w-full p-2 border rounded text-black"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
            <input
              type="text"
              
              placeholder="Location"
              className="w-full p-2 border rounded text-black"
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
            <input
              type="date"
              
              className="w-full p-2 border rounded text-black"
              value={formData.purchase_date}
              onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
              required
            />
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Asset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;