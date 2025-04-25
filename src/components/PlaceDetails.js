/**
 * Component for displaying Google Maps place details
 * Renders an embedded Google Maps iframe for a specific location
 */
import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { GOOGLE_PLACES_API_KEY } from '../firebase/config';

/**
 * PlaceDetails component that displays a Google Maps embed for a specific location
 * @param {Object} props - Component props
 * @param {string} props.placeId - Google Places place ID
 */
function PlaceDetails({ placeId }) {
  return (
    <Box sx={{ 
      width: '100%',
      height: '300px',
      border: '1px solid rgba(144, 202, 249, 0.2)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Google Maps embed iframe */}
      <iframe
        title="Google Place Details"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_PLACES_API_KEY}&q=place_id:${placeId}`}
        allowFullScreen
      />
    </Box>
  );
}

// Prop type validation
PlaceDetails.propTypes = {
  placeId: PropTypes.string.isRequired
};

export default PlaceDetails; 