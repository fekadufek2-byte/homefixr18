import React, { useState, useEffect } from 'react';
import { MaintenanceRequest, RequestStatus, RequesterProfile } from './types';
import Header from './components/Header';
import RequestList from './components/RequestList';
import RequestForm from './components/RequestForm';
import RequestDetailsModal from './components/RequestDetailsModal';
import ReportView from './components/ReportView';
import AdminPasswordModal from './components/AdminPasswordModal';

type View = 'list' | 'form' | 'reports';
export type Role = 'requester' | 'admin';

const App: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [role, setRole] = useState<Role>('requester');
  const [view, setView] = useState<View>('form');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [currentRequester, setCurrentRequester] = useState<RequesterProfile | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const storedRequests = localStorage.getItem('maintenanceRequests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
    const storedRequester = localStorage.getItem('currentRequester');
    if (storedRequester) {
      setCurrentRequester(JSON.parse(storedRequester));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    if (currentRequester) {
      localStorage.setItem('currentRequester', JSON.stringify(currentRequester));
    }
  }, [currentRequester]);
  
  const handleSetRole = (newRole: Role) => {
    if (newRole === 'admin' && !isAdminAuthenticated) {
      setIsPasswordModalOpen(true);
      return;
    }
    
    setRole(newRole);
    setView(newRole === 'admin' ? 'list' : 'form');

    if (newRole === 'requester') {
      setIsAdminAuthenticated(false);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === 'admin123') {
      setIsAdminAuthenticated(true);
      setRole('admin');
      setView('list');
      setIsPasswordModalOpen(false);
      return true;
    }
    return false;
  };

  const handleAddRequest = (request: Omit<MaintenanceRequest, 'id' | 'status' | 'requestDate'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `REQ-${Date.now()}`,
      status: RequestStatus.Pending,
      requestDate: new Date().toISOString(),
    };
    setRequests(prev => [newRequest, ...prev]);
    setCurrentRequester(request.requester);
    setView('list');
  };

  const handleCompleteRequest = (id: string, workDescription: string, materialsUsed: string) => {
    const completionDate = new Date().toISOString();
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status: RequestStatus.Completed, workDescription, materialsUsed, completionDate }
          : req
      )
    );
    setSelectedRequest(prev => prev ? { ...prev, status: RequestStatus.Completed, workDescription, materialsUsed, completionDate } : null);
  };
  
  const handleSelectRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };
  
  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const renderView = () => {
    switch (view) {
      case 'form':
        return role === 'requester' ? <RequestForm onSubmit={handleAddRequest} /> : <RequestList requests={requests} onSelectRequest={handleSelectRequest} role={role} currentRequester={currentRequester} />;
      case 'reports':
        return role === 'admin' ? <ReportView requests={requests} /> : <RequestList requests={requests} onSelectRequest={handleSelectRequest} role={role} currentRequester={currentRequester} />;
      case 'list':
      default:
        return <RequestList requests={requests} onSelectRequest={handleSelectRequest} role={role} currentRequester={currentRequester} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Header 
        currentView={view} 
        setView={setView}
        role={role}
        setRole={handleSetRole} 
      />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={handleCloseModal}
          onComplete={handleCompleteRequest}
        />
      )}
      {isPasswordModalOpen && (
        <AdminPasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
};

export default App;