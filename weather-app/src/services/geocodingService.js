const OPENCAGE_API = '2b4679febcb84b64a6962d51d8c0dfe3';
const GEOAPIFY_API = '29896cd5f9244baa9d532e72be27b7a3';

// 🔁 Try OpenCage first
const tryOpenCage = async (lat, lon) => {
  const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API}`);
  const data = await res.json();
  const comp = data?.results?.[0]?.components;
  const village = comp?.village || comp?.hamlet;
  const town = comp?.town || comp?.city || comp?.municipality;
  const district = comp?.county || comp?.state_district;
  const state = comp?.state;
  if (village) return `${village}, ${district || state}`;
  if (town) return `${town}, ${district || state}`;
  return null;
};

const tryGeoapify = async (lat, lon) => {
  const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API}`);
  const data = await res.json();
  const p = data?.features?.[0]?.properties;
  const locality = p?.village || p?.suburb || p?.city || p?.county;
  const state = p?.state;
  return locality ? `${locality}, ${state}` : null;
};

const tryNominatim = async (lat, lon) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
  const data = await res.json();
  const a = data?.address;
  const village = a?.village || a?.hamlet;
  const town = a?.town || a?.city || a?.county;
  const state = a?.state;
  if (village) return `${village}, ${state}`;
  if (town) return `${town}, ${state}`;
  return data?.display_name || 'Unknown';
};

export const fetchLocalityFromCoords = async (lat, lon) => {
  let result = await tryOpenCage(lat, lon);
  if (result) return result;
  result = await tryGeoapify(lat, lon);
  if (result) return result;
  result = await tryNominatim(lat, lon);
  return result;
};

export const fetchCoordsFromCity = async (city) => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${OPENCAGE_API}`;
  const res = await fetch(url);
  const data = await res.json();
  const result = data?.results?.[0]?.geometry;
  return result || null;
};
