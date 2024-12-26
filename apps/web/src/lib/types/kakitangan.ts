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
// TODO: change the interface when ES is up
export interface OfficeDirectory {
  id: string;
  name: string;
  address: {
    line1: string;
    line2: string;
    line3: string;
    postcode: string;
    state: string;
  };
  contact: {
    phone: string;
    fax: string;
    email: string;
    website: string;
  };
  social_media: {
    facebook: string;
    twitter: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  operating_hours: string | null;
}
