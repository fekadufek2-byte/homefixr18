import React from 'react';
import { MaintenanceRequest, RequestStatus, MaintenanceCategory, RequesterProfile } from '../types';
import { PlumbingIcon, ElectricalIcon, CarpentryIcon, MasonryIcon, PaintingIcon, CalendarIcon, UserIcon } from './icons';
import { Role } from '../App';

interface RequestListProps {
  requests: MaintenanceRequest[];
  onSelectRequest: (request: MaintenanceRequest) => void;
  role: Role;
  currentRequester: RequesterProfile | null;
}

const categoryDetails: { [key in MaintenanceCategory]: { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string } } = {
  [MaintenanceCategory.Plumbing]: { icon: PlumbingIcon, color: 'text-blue-500' },
  [MaintenanceCategory.Electrical]: { icon: ElectricalIcon, color: 'text-yellow-500' },
  [MaintenanceCategory.Carpentry]: { icon: CarpentryIcon, color: 'text-amber-700' },
  [MaintenanceCategory.Masonry]: { icon: MasonryIcon, color: 'text-gray-600' },
  [MaintenanceCategory.Painting]: { icon: PaintingIcon, color: 'text-purple-500' },
};

const RequestCard: React.FC<{ request: MaintenanceRequest; onSelectRequest: (request: MaintenanceRequest) => void; }> = ({ request, onSelectRequest }) => {
  const { icon: CategoryIcon, color: iconColor } = categoryDetails[request.category];
  const isCompleted = request.status === RequestStatus.Completed;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className={`p-5 flex-grow ${isCompleted ? 'opacity-70' : ''}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <CategoryIcon className={`h-8 w-8 ${iconColor}`} />
            <div>
              <h3 className="text-lg font-bold text-gray-800">{request.category}</h3>
              <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${isCompleted ? 'text-green-600 bg-green-200' : 'text-yellow-600 bg-yellow-200'}`}>
                {request.status}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">{request.description}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-brand-text">
            <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                <span>{request.requester.name} - House #{request.requester.houseNumber}</span>
            </div>
            <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{new Date(request.requestDate).toLocaleDateString()}</span>
            </div>
        </div>
      </div>
       <div className="bg-gray-50 px-5 py-3">
        <button
          onClick={() => onSelectRequest(request)}
          className="w-full text-sm font-medium text-brand-blue hover:text-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const RequestList: React.FC<RequestListProps> = ({ requests, onSelectRequest, role, currentRequester }) => {
  const displayedRequests = role === 'requester' && currentRequester
    ? requests.filter(req => 
        req.requester.phone === currentRequester.phone && 
        req.requester.houseNumber === currentRequester.houseNumber
      )
    : requests;

  if (displayedRequests.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-700">No maintenance requests found.</h2>
        <p className="text-brand-text mt-2">
          {role === 'requester' ? "Submit a new request to see it here." : "There are currently no requests."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {role === 'requester' ? "My Maintenance Requests" : "All Maintenance Requests"}
      </h2>
      {role === 'admin' ? (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House #</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedRequests.map(request => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{request.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{request.requester.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requester.houseNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.requestDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === RequestStatus.Completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onSelectRequest(request)} className="text-brand-blue hover:text-blue-700 font-semibold">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRequests.map(request => (
            <RequestCard key={request.id} request={request} onSelectRequest={onSelectRequest} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;