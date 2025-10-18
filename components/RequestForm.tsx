
import React, { useState } from 'react';
import { MaintenanceCategory, RequesterProfile } from '../types';
import { CATEGORIES } from '../constants';

interface RequestFormProps {
  onSubmit: (request: { requester: RequesterProfile; category: MaintenanceCategory; description: string }) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>(CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !houseNumber || !description) {
      alert('Please fill out all fields.');
      return;
    }
    onSubmit({
      requester: { name, phone, houseNumber },
      category,
      description,
    });
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue";
  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a New Maintenance Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium px-2">Requester Information</legend>
          <div className="space-y-4 mt-2">
            <div>
              <label htmlFor="name" className={labelClass}>Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone Number</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="houseNumber" className={labelClass}>House/Apartment Number</label>
              <input type="text" id="houseNumber" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} className={inputClass} required />
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-medium px-2">Request Details</legend>
          <div className="space-y-4 mt-2">
            <div>
              <label htmlFor="category" className={labelClass}>Maintenance Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value as MaintenanceCategory)} className={inputClass}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="description" className={labelClass}>Description of Issue</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={4} required></textarea>
            </div>
          </div>
        </fieldset>
        
        <button type="submit" className="w-full bg-brand-blue text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
