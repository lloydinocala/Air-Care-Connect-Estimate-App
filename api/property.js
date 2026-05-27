// Vercel Serverless Function — Property Lookup
// This keeps the RentCast API key secure on the server
// Never exposed to the browser

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, city, state, zip } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  const RENTCAST_KEY = process.env.RENTCAST_API_KEY;

  if (!RENTCAST_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Build query string
    const params = new URLSearchParams();
    params.append('address', address);
    if (city)  params.append('city', city);
    if (state) params.append('state', state);
    if (zip)   params.append('zipCode', zip);

    const url = `https://api.rentcast.io/v1/properties?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': RENTCAST_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('RentCast error:', response.status, err);
      return res.status(response.status).json({ error: 'Property lookup failed', details: err });
    }

    const data = await response.json();

    // Extract the first result
    const property = Array.isArray(data) ? data[0] : data;

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Return only what the app needs — never expose owner details
    return res.status(200).json({
      address:       property.formattedAddress || address,
      city:          property.city || city || '',
      state:         property.state || state || 'FL',
      zip:           property.zipCode || zip || '',
      county:        property.county || '',
      beds:          property.bedrooms || null,
      baths:         property.bathrooms || null,
      sqft:          property.squareFootage || null,
      yearBuilt:     property.yearBuilt || null,
      propertyType:  property.propertyType || '',
      stories:       property.stories || null,
      lotSize:       property.lotSize || null,
      lat:           property.latitude || null,
      lng:           property.longitude || null,
    });

  } catch (error) {
    console.error('Property lookup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
