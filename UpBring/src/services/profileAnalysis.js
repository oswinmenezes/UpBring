import supabase from './supabase_client';
import { analyzeCandidate } from './gemini';

/**
 * Analyze candidate profile and save to Supabase
 * 
 * @param {Object} profileData - Profile data object containing:
 *   - fullName: string
 *   - institution: string
 *   - resumeText: string | null
 *   - githubRepos: Array<{name, description, private, readme}>
 * @returns {Promise<Object>} - Analysis result from Gemini
 */
export async function analyzeAndSaveProfile(profileData) {
  const { fullName, institution, resumeText, githubRepos } = profileData;

  // Prepare comprehensive profile text for Gemini analysis
  let analysisText = `
=== CANDIDATE PROFILE ===
Name: ${fullName}
Institution/Organization: ${institution}

`;

  // Add resume content if available
  if (resumeText) {
    analysisText += `=== RESUME CONTENT ===
${resumeText}

`;
  }

  // Add GitHub repositories if available
  if (githubRepos && githubRepos.length > 0) {
    analysisText += `=== GITHUB REPOSITORIES ===
${githubRepos
  .map(repo => `
Repository: ${repo.name}
Description: ${repo.description || 'No description'}
Private: ${repo.private ? 'Yes' : 'No'}
README:
${repo.readme || 'No README found'}
`)
  .join('\n')}
`;
  }

  console.log('Sending profile data to Gemini:', analysisText);

  // Call Gemini API for analysis
  const analysisResult = await analyzeCandidate(analysisText);
  
  console.log('Gemini Analysis Result:', analysisResult);

  // Save the analysis result to Supabase users table
  if (analysisResult && analysisResult.profile) {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Prepare data for insert - send JSON objects directly, Supabase handles serialization
        const insertData = {
          user_id: user.id,
          full_name: fullName,
          institution: institution,
          profile_analysis: analysisResult,
          skills: analysisResult.skills || [],
          showcase: analysisResult.showcase || [],
          suitable_roles: analysisResult.suitable_roles || [],
        };

        // Create new row in users table
        const { error: analysisError } = await supabase
          .from('users')
          .insert(insertData);

        if (analysisError) {
          console.error('Error saving analysis to Supabase:', analysisError);
          console.error('Error details:', {
            code: analysisError.code,
            message: analysisError.message,
            details: analysisError.details,
          });
          throw new Error(`Database Error: ${analysisError.message}`);
        } else {
          console.log('Analysis successfully saved to Supabase users table');
        }
      }
    } catch (err) {
      console.error('Error in analyzeAndSaveProfile:', err);
      throw err;
    }
  }

  return analysisResult;
}
