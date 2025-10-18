export enum MaintenanceCategory {
  Plumbing = 'Plumbing',
  Electrical = 'Electrical',
  Carpentry = 'Carpentry',
  Masonry = 'Masonry',
  Painting = 'Painting',
}

export enum RequestStatus {
  Pending = 'Pending',
  Completed = 'Completed',
}

export interface RequesterProfile {
  name: string;
  phone: string;
  houseNumber: string;
}

export interface MaintenanceRequest {
  id: string;
  requester: RequesterProfile;
  category: MaintenanceCategory;
  description: string;
  requestDate: string;
  status: RequestStatus;
  completionDate?: string;
  workDescription?: string;
  materialsUsed?: string;
}
