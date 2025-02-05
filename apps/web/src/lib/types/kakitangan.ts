export interface Kakitangan {
  org_sort: number;
  org_id: string;
  org_name: string;
  org_type: string;
  division_sort: number;
  division_name: string | null;
  subdivision_name: string | null;
  person_name: string | null;
  position_name: string | null;
  person_phone: string | null;
  person_email: string | null;
  person_fax: string | null;
  parent_org_id: string | null;
  position_sort: number;
}

export interface OfficeDirectory {
  id: string;
  name: string;
  address: {
    line1: string;
    line2: string;
    line3: string;
    postcode: string;
    state: string;
    location: {
      lat: number;
      lon: number;
    };
  };
  contact: {
    phone: string | string[];
    fax: string | string[];
    email: string;
    website: string;
  };
  links: {
    googleMaps: string;
    waze: string;
    facebook: string;
    twitter: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  operating_hours: string | null;
}
