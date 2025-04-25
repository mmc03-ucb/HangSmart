/**
 * Service for handling activity recommendations using Perplexity AI and Google Places API
 * Manages API calls and data processing for group activity suggestions
 */
import axios from 'axios';
import { PERPLEXITY_API_KEY, GOOGLE_PLACES_API_KEY } from '../firebase/config';

/**
 * Main function to get activity recommendations for a group
 * @param {Object} groupData - Group data including member preferences
 * @returns {Promise<Object>} - Formatted recommendations with activities and place details
 */
export const getRecommendations = async (groupData) => {
  try {
    // Extract preferences from all members
    const preferences = groupData.members.map(member => member.preferences);
    
    // Create a prompt for Perplexity
    const prompt = createPrompt(preferences);
    
    // Call Perplexity API for activity suggestions
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that suggests common activities and places for groups of people based on their preferences. Format your response as a JSON object with the following structure: { message: string, date: string, activities: [{ title: string, content: string, location: string, requests: string, url: string }] }'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the recommendations from the API response
    const recommendations = JSON.parse(response.data.choices[0].message.content);

    // Enhance activities with Google Places data
    const activitiesWithPlaceIds = await Promise.all(
      recommendations.activities.map(async (activity) => {
        if (activity.location) {
          try {
            const placeId = await getPlaceId(activity.location);
            return { ...activity, placeId };
          } catch (error) {
            console.error('Error getting place ID:', error);
            return activity;
          }
        }
        return activity;
      })
    );

    return { ...recommendations, activities: activitiesWithPlaceIds };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

/**
 * Creates a detailed prompt for the Perplexity API based on group preferences
 * @param {Array} preferences - Array of member preferences
 * @returns {string} - Formatted prompt string
 */
const createPrompt = (preferences) => {
  let prompt = 'Based on the following group preferences, suggest activities and places that appeal to all members of the group:\n\n';
  
  preferences.forEach((pref, index) => {
    prompt += `Member ${index + 1}:\n`;
    prompt += `- Interests: ${pref.interests}\n`;
    prompt += `- Availability: ${pref.availability}\n`;
    prompt += `- Special Requests: ${pref.specialRequests}\n`;
    prompt += `- Location: ${pref.location}\n\n`;
  });

  prompt += 'Please suggest common activities that would appeal to the whole group, taking into account their interests, availability, and any special requests. Include specific locations and URLs where applicable.';
  
  return prompt;
};

/**
 * Gets a Google Places place ID for a given location
 * @param {string} location - Location name or address
 * @returns {Promise<string|null>} - Place ID or null if not found
 */
const getPlaceId = async (location) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
      {
        params: {
          input: location,
          inputtype: 'textquery',
          fields: 'place_id',
          key: GOOGLE_PLACES_API_KEY
        }
      }
    );

    if (response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].place_id;
    }
    return null;
  } catch (error) {
    console.error('Error getting place ID:', error);
    throw error;
  }
}; 