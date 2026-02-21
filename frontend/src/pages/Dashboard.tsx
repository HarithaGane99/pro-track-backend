import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import AddAssetModal from "../components/AddAssetModal";

interface Asset {
  id: number;
  name: string;
  category: string;
  status: string;
  location: string;
  purchase_date: string;
}

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const navigate = useNavigate();

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/assets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(response.data);
    } catch (err) {
      console.error("Failed to fetch assets", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/assets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAssets();
      } catch (err) {
        alert("Failed to delete asset");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Asset Inventory</h1>
        <div className="space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Add Asset
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-blue-600 text-white text-left text-sm uppercase font-semibold">
              <th className="px-5 py-3 border-b">Name</th>
              <th className="px-5 py-3 border-b">Category</th>
              <th className="px-5 py-3 border-b">Status</th>
              <th className="px-5 py-3 border-b">Location</th>
              <th className="px-5 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-100 border-b">
                  <td className="px-5 py-5 text-sm text-black">{asset.name}</td>
                  <td className="px-5 py-5 text-sm text-black">
                    {asset.category}
                  </td>
                  <td className="px-5 py-5 text-sm ">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        asset.status === "Healthy"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-sm text-black">
                    {asset.location}
                  </td>
                  <td className="px-5 py-5 text-sm text-center">
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="text-red-600 hover:text-red-900 font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-5 text-center text-gray-500">
                  No assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddAssetModal
          onAssetAdded={() => fetchAssets()}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
