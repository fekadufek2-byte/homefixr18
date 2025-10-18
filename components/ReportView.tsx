import React, { useState, useMemo } from 'react';
import { MaintenanceRequest, MaintenanceCategory, RequestStatus } from '../types';
import { CATEGORIES } from '../constants';
import { PlumbingIcon, ElectricalIcon, CarpentryIcon, MasonryIcon, PaintingIcon } from './icons';

interface ReportViewProps {
  requests: MaintenanceRequest[];
}

const categoryIcons: { [key in MaintenanceCategory]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  [MaintenanceCategory.Plumbing]: PlumbingIcon,
  [MaintenanceCategory.Electrical]: ElectricalIcon,
  [MaintenanceCategory.Carpentry]: CarpentryIcon,
  [MaintenanceCategory.Masonry]: MasonryIcon,
  [MaintenanceCategory.Painting]: PaintingIcon,
};

const TimeFilterButton: React.FC<{label: string, value: number, activeValue: number, onClick: (value: number) => void}> = 
  ({ label, value, activeValue, onClick }) => (
  <button 
    onClick={() => onClick(value)}
    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
      activeValue === value 
      ? 'bg-brand-blue text-white shadow' 
      : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
    }`}
  >
    {label}
  </button>
);

const CategorySummaryReport: React.FC<{ requests: MaintenanceRequest[] }> = ({ requests }) => {
  const { reportData, totals } = useMemo(() => {
    const data = CATEGORIES.reduce((acc, category) => {
      acc[category] = { requested: 0, completed: 0 };
      return acc;
    }, {} as { [key in MaintenanceCategory]: { requested: number; completed: number } });

    requests.forEach(req => {
      if (data[req.category]) {
        data[req.category].requested += 1;
        if (req.status === RequestStatus.Completed) {
          data[req.category].completed += 1;
        }
      }
    });

    const totals = {
      requested: Object.values(data).reduce((sum, d) => sum + d.requested, 0),
      completed: Object.values(data).reduce((sum, d) => sum + d.completed, 0),
    };

    return { reportData: data, totals };
  }, [requests]);

  const totalCompletionRate = totals.requested > 0 ? ((totals.completed / totals.requested) * 100).toFixed(0) : 0;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 p-4 border-b">Category Summary</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 border">Category</th>
              <th scope="col" className="px-6 py-3 text-center border">Total Requested</th>
              <th scope="col" className="px-6 py-3 text-center border">Completed</th>
              <th scope="col" className="px-6 py-3 text-center border">Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(category => {
              const data = reportData[category];
              const completionRate = data.requested > 0 ? ((data.completed / data.requested) * 100).toFixed(0) : 0;
              const CategoryIcon = categoryIcons[category];
              return (
                <tr key={category} className="bg-white hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center border">
                    <CategoryIcon className="h-5 w-5 mr-3 text-brand-text" />
                    {category}
                  </th>
                  <td className="px-6 py-4 text-center text-lg font-semibold border">{data.requested}</td>
                  <td className="px-6 py-4 text-center text-lg font-semibold text-green-600 border">{data.completed}</td>
                  <td className="px-6 py-4 text-center border">
                    <div className="flex items-center justify-center">
                      <span className="text-gray-900 font-medium">{completionRate}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 ml-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-bold text-gray-800">
              <th scope="row" className="px-6 py-4 text-base border">Total</th>
              <td className="px-6 py-4 text-center text-lg border">{totals.requested}</td>
              <td className="px-6 py-4 text-center text-lg text-green-700 border">{totals.completed}</td>
              <td className="px-6 py-4 text-center border">
                <div className="flex items-center justify-center">
                  <span className="text-gray-900 font-medium">{totalCompletionRate}%</span>
                  <div className="w-24 bg-gray-300 rounded-full h-2.5 ml-4">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${totalCompletionRate}%` }}></div>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const MaterialConsumptionReport: React.FC<{ requests: MaintenanceRequest[] }> = ({ requests }) => {
  const completedWithMaterials = useMemo(() => 
    requests.filter(req => req.status === RequestStatus.Completed && req.materialsUsed), 
  [requests]);

  return (
     <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 p-4 border-b">Material Consumption</h3>
      {completedWithMaterials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-text">No material consumption data available.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 border">Request ID</th>
                <th scope="col" className="px-6 py-3 border">Category</th>
                <th scope="col" className="px-6 py-3 border">Completion Date</th>
                <th scope="col" className="px-6 py-3 border">Materials Used</th>
              </tr>
            </thead>
            <tbody>
              {completedWithMaterials.map(req => (
                <tr key={req.id} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs border">{req.id}</td>
                  <td className="px-6 py-4 border">{req.category}</td>
                  <td className="px-6 py-4 border">{req.completionDate ? new Date(req.completionDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-800 whitespace-pre-wrap border">{req.materialsUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const ReportView: React.FC<ReportViewProps> = ({ requests }) => {
  const [timeFilter, setTimeFilter] = useState(12); // months

  const filteredRequests = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    filterDate.setMonth(now.getMonth() - timeFilter);
    return requests.filter(req => new Date(req.requestDate) >= filterDate);
  }, [requests, timeFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Reports</h2>
        <p className="text-brand-text">Analyze maintenance trends and material consumption.</p>
      </div>

      <div>
        <div className="mb-4 flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
          <span className="text-sm font-medium text-gray-700 mr-2">Time Period:</span>
          <TimeFilterButton label="1M" value={1} activeValue={timeFilter} onClick={setTimeFilter} />
          <TimeFilterButton label="3M" value={3} activeValue={timeFilter} onClick={setTimeFilter} />
          <TimeFilterButton label="6M" value={6} activeValue={timeFilter} onClick={setTimeFilter} />
          <TimeFilterButton label="9M" value={9} activeValue={timeFilter} onClick={setTimeFilter} />
          <TimeFilterButton label="1 Year" value={12} activeValue={timeFilter} onClick={setTimeFilter} />
        </div>
        {filteredRequests.length > 0 ? (
          <CategorySummaryReport requests={filteredRequests} />
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-700">No data available for the selected period.</h2>
            <p className="text-brand-text mt-2">Try selecting a different time range or create new requests.</p>
          </div>
        )}
      </div>

      <div>
        <MaterialConsumptionReport requests={requests} />
      </div>
    </div>
  );
};

export default ReportView;
