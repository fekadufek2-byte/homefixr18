import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, CloseIcon } from './icons';

interface AdminPasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => boolean;
}

const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onSubmit(password);
    if (!success) {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Admin Access</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-brand-text mb-4">Please enter the admin password to continue.</p>
            
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className={`block w-full px-3 py-2 pr-10 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-brand-blue focus:ring-brand-blue'}`}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-blue border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;
