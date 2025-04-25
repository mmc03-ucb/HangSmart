import React from 'react';
import { Box } from '@mui/material';
import config from '../config';

function PlaceDetails({ placeId }) {
  return (
    <Box sx={{ 
      width: '100%',
      height: '300px',
      border: '1px solid rgba(144, 202, 249, 0.2)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <iframe
        title="Google Place Details"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/place?key=${config.googleMapsApiKey}&q=place_id:${placeId}`}
        allowFullScreen
      />
    </Box>
  );
}

export default PlaceDetails; 