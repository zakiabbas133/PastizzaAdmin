export interface Location {
  id: string;
  address: string;
  coordinates: coordinate;
  name: string;
  openingHours: string[];
  phone: string;
  whatsapp: string;
}

interface coordinate {
  lat: Number;
  lng: Number;
}
