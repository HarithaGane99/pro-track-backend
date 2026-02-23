import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface AddAssetProps {
  onAssetAdded: () => void;
  onClose: () => void;
}

interface LookupItem {
  id: number;
  name: string;
}

const AddAssetModal: React.FC<AddAssetProps> = ({ onAssetAdded, onClose }) => {
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [locations, setLocations] = useState<LookupItem[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '', 
    location_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
    status: 'Healthy'
  });


  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          api.get('/categories'),
          api.get('/locations')
        ]);
        setCategories(catRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error("Error fetching dropdown data", err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const dataToSend = {
        ...formData,
        category_id: parseInt(formData.category_id),
        location_id: parseInt(formData.location_id)
      };

      await api.post('/assets', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onAssetAdded(); 
      onClose();     
    } catch (err) {
      console.error("Error adding asset", err);
      alert("Failed to add asset. Please check if you selected Category and Location.");
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
              placeholder="Asset Name"
              className="w-full p-2 border rounded text-black"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            {/* Category Dropdown */}
            <select
              className="w-full p-2 border rounded text-black"
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Location Dropdown */}
            <select
              className="w-full p-2 border rounded text-black"
              value={formData.location_id}
              onChange={(e) => setFormData({...formData, location_id: e.target.value})}
              required
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>

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