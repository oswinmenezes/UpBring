/**
 * github_service.js
 * 
 * Provides utility functions to interact with the GitHub REST API.
 */

const GITHUB_API_BASE_URL = 'https://api.github.com';

/**
 * Fetches all repositories (public and private) for the authenticated user.
 * Requires the 'repo' scope in the access token.
 * 
 * @param {string} accessToken - The GitHub OAuth access token.
 * @returns {Promise<Array>} - A promise that resolves to an array of repository objects.
 */
export const fetchUserRepos = async (accessToken) => {
    if (!accessToken) {
        throw new Error('Access token is required to fetch repositories.');
    }

    try {
        const response = await fetch(`${GITHUB_API_BASE_URL}/user/repos?sort=updated&per_page=100`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorData.message}`);
        }

        const data = await response.json();
        return data; // Array of repo objects
    } catch (error) {
        console.error('Error fetching user repositories:', error);
        throw error;
    }
};

/**
 * Fetches the README file content for a specific repository.
 * 
 * @param {string} accessToken - The GitHub OAuth access token.
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<string|null>} - A promise that resolves to the README content as a string, or null if not found.
 */
export const fetchRepoReadme = async (accessToken, owner, repo) => {
    if (!accessToken) {
        throw new Error('Access token is required to fetch README.');
    }

    try {
        const response = await fetch(`${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/readme`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        if (response.status === 404) {
            console.warn(`No README found for repository: ${owner}/${repo}`);
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorData.message}`);
        }

        const data = await response.json();
        
        // GitHub API returns README content base64 encoded by default.
        // We need to decode it.
        // atob() is supported in browsers but may have issues with non-ASCII characters.
        // For broad Unicode support, we use a custom decode function or TextDecoder.
        
        // Convert base64 to Uint8Array then decode with TextDecoder (handles Unicode better)
        const binaryString = atob(data.content.replace(/\n/g, ''));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        const decodedContent = new TextDecoder('utf-8').decode(bytes);
        
        return decodedContent;
    } catch (error) {
        console.error(`Error fetching README for ${owner}/${repo}:`, error);
        throw error;
    }
};
