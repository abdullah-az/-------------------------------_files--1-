import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { AIModel } from '../../types';
import * as aiService from '../../api/aiService';

const AISettings: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<Omit<AIModel, 'id'>>({
    name: '',
    api_key: '',
    model_identifier: '',
    is_active: true,
  });

  useEffect(() => {
    if (authContext?.user?.role !== 'admin') {
      // Redirect or show an unauthorized message
      // For simplicity, we'll just return null, but a redirect is better.
      // navigate('/unauthorized');
      return;
    }
    fetchModels();
  }, [authContext]);

  const fetchModels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await aiService.getAIModels();
      setModels(data);
    } catch (err) {
      setError('Failed to fetch AI models.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', api_key: '', model_identifier: '', is_active: true });
    setEditingModel(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (editingModel) {
        // If api_key is empty, don't send it in the update payload
        const updateData: Partial<Omit<AIModel, 'id'>> = { ...formData };
        if (!formData.api_key) {
          delete updateData.api_key;
        }
        await aiService.updateAIModel(editingModel.id, updateData);
      } else {
        await aiService.createAIModel(formData);
      }
      fetchModels();
      resetForm();
    } catch (err) {
      setError(editingModel ? 'Failed to update AI model.' : 'Failed to create AI model.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (model: AIModel) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      api_key: '', // API key is not displayed, user enters new one if they want to change
      model_identifier: model.model_identifier,
      is_active: model.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this AI model?')) {
      setIsLoading(true);
      setError(null);
      try {
        await aiService.deleteAIModel(id);
        fetchModels();
      } catch (err) {
        setError('Failed to delete AI model.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (authContext?.user?.role !== 'admin') {
    return <div className="p-4">Access Denied. You must be an admin to view this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Model Settings</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      
      <button
        onClick={() => { setShowForm(true); setEditingModel(null); setFormData({ name: '', api_key: '', model_identifier: '', is_active: true }); }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add New AI Model
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-sm">
          <h2 className="text-xl mb-3">{editingModel ? 'Edit AI Model' : 'Add New AI Model'}</h2>
          <div className="mb-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-3">
            <label htmlFor="api_key" className="block text-sm font-medium text-gray-700">API Key:</label>
            <input type="password" name="api_key" id="api_key" value={formData.api_key || ''} onChange={handleInputChange} placeholder={editingModel ? "Enter new key to change" : ""} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-3">
            <label htmlFor="model_identifier" className="block text-sm font-medium text-gray-700">Model Identifier:</label>
            <input type="text" name="model_identifier" id="model_identifier" value={formData.model_identifier} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="mb-3">
            <label htmlFor="is_active" className="flex items-center">
              <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              <span className="ml-2 text-sm text-gray-700">Is Active</span>
            </label>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
              {isLoading ? (editingModel ? 'Updating...' : 'Creating...') : (editingModel ? 'Update Model' : 'Create Model')}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading && !showForm && <p>Loading models...</p>}

      {!isLoading && models.length === 0 && !showForm && <p>No AI models found.</p>}

      {!showForm && models.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Identifier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {models.map(model => (
                <tr key={model.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{model.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{model.model_identifier}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${model.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {model.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(model)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(model.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AISettings;