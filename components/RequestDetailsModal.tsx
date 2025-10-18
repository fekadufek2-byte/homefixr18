import React, { useState } from 'react';
import { MaintenanceRequest, RequestStatus } from '../types';
import { CloseIcon, DocumentArrowDownIcon } from './icons';

// This lets TypeScript know about the jspdf library from the CDN
declare const jspdf: any;

interface RequestDetailsModalProps {
  request: MaintenanceRequest;
  onClose: () => void;
  onComplete: (id: string, workDescription: string, materialsUsed: string) => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose, onComplete }) => {
  const [workDescription, setWorkDescription] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');

  const handleComplete = () => {
    if (!workDescription.trim()) {
      alert('Please provide a description of the work completed.');
      return;
    }
    onComplete(request.id, workDescription, materialsUsed);
  };

  const handleGeneratePdf = () => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Maintenance Work Order Report", 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Request ID: ${request.id}`, 14, 40);
    doc.text(`Status: ${request.status}`, 14, 47);

    doc.setLineWidth(0.5);
    doc.line(14, 55, 196, 55);

    doc.setFontSize(16);
    doc.text("Requester Information", 14, 65);
    doc.setFontSize(12);
    doc.text(`Name: ${request.requester.name}`, 14, 75);
    doc.text(`House Number: ${request.requester.houseNumber}`, 14, 82);
    doc.text(`Phone: ${request.requester.phone}`, 14, 89);
    
    doc.setFontSize(16);
    doc.text("Request Details", 14, 105);
    doc.setFontSize(12);
    doc.text(`Category: ${request.category}`, 14, 115);
    doc.text(`Date Requested: ${new Date(request.requestDate).toLocaleString()}`, 14, 122);
    doc.text("Initial Issue:", 14, 129);
    const splitDescription = doc.splitTextToSize(request.description, 180);
    doc.text(splitDescription, 14, 136);
    
    doc.line(14, 155, 196, 155);

    doc.setFontSize(16);
    doc.text("Work Completion Details", 14, 165);
    doc.setFontSize(12);
    if(request.status === RequestStatus.Completed && request.completionDate) {
      doc.text(`Date Completed: ${new Date(request.completionDate).toLocaleString()}`, 14, 175);
      doc.text("Work Performed:", 14, 182);
      const splitWorkDescription = doc.splitTextToSize(request.workDescription || 'N/A', 180);
      doc.text(splitWorkDescription, 14, 189);
      
      doc.text("Materials Used:", 14, 210);
      const splitMaterials = doc.splitTextToSize(request.materialsUsed || 'None', 180);
      doc.text(splitMaterials, 14, 217);

    } else {
       doc.text("Work is still pending.", 14, 175);
    }
    
    doc.save(`Maintenance-Report-${request.id}.pdf`);
  };
  
  const DetailItem: React.FC<{label: string; value: string}> = ({label, value}) => (
    <div>
        <h4 className="text-sm font-medium text-gray-500">{label}</h4>
        <p className="mt-1 text-md text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <CloseIcon className="h-6 w-6" />
                </button>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <DetailItem label="Request ID" value={request.id} />
                <DetailItem label="Status" value={request.status} />
                <DetailItem label="Requester" value={request.requester.name} />
                <DetailItem label="House #" value={request.requester.houseNumber} />
                <DetailItem label="Phone" value={request.requester.phone} />
                <DetailItem label="Category" value={request.category} />
                <DetailItem label="Request Date" value={new Date(request.requestDate).toLocaleString()} />
                {request.completionDate && <DetailItem label="Completion Date" value={new Date(request.completionDate).toLocaleString()} />}
            </div>
            
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-500">Initial Issue Description</h4>
                    <p className="mt-1 text-md text-gray-900 bg-gray-50 p-3 rounded-md">{request.description}</p>
                </div>
                {request.status === RequestStatus.Completed && (
                    <>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Work Performed by Professional</h4>
                            <p className="mt-1 text-md text-gray-900 bg-green-50 p-3 rounded-md">{request.workDescription}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Materials Used</h4>
                            <p className="mt-1 text-md text-gray-900 bg-blue-50 p-3 rounded-md">{request.materialsUsed || 'None recorded'}</p>
                        </div>
                    </>
                )}
            </div>

            {request.status === RequestStatus.Pending && (
                <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium text-gray-900">Complete This Request</h3>
                    <div className="space-y-4 mt-2">
                         <div>
                            <label className="text-sm text-gray-600 font-medium">Work Performed</label>
                             <p className="text-xs text-gray-500 mt-1 mb-2">Describe the work that was completed.</p>
                            <textarea
                                value={workDescription}
                                onChange={(e) => setWorkDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                rows={3}
                                placeholder="e.g., Replaced faulty faucet in the kitchen sink, tested for leaks."
                            ></textarea>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 font-medium">Materials Used (Optional)</label>
                            <p className="text-xs text-gray-500 mt-1 mb-2">List any materials or parts used for this job.</p>
                            <textarea
                                value={materialsUsed}
                                onChange={(e) => setMaterialsUsed(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                rows={2}
                                placeholder="e.g., 1x Faucet, 2x Washers, Teflon tape"
                            ></textarea>
                        </div>
                    </div>
                    <button
                        onClick={handleComplete}
                        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors"
                    >
                        Mark as Complete
                    </button>
                </div>
            )}
            
            {request.status === RequestStatus.Completed && (
                 <div className="mt-6 pt-6 border-t">
                     <button
                        onClick={handleGeneratePdf}
                        className="w-full flex items-center justify-center bg-brand-blue text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                     >
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                        Download PDF Report
                    </button>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
