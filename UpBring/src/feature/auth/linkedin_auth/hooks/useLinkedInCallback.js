import { useEffect } from 'react';
import { handleLinkedInSuccess } from '../handlers/handleLinkedInSuccess';
import { handleLinkedInError } from '../handlers/handleLinkedInError';
/**
 * Custom hook to handle the LinkedIn OAuth 2.0 redirect.
 * 
 * This hook parses the URL for authorization code or error parameters
 * returned by LinkedIn and triggers the appropriate handler functions.
 * It's designed to be used in the component that corresponds to your
 * approved redirect URI (e.g., App.jsx or a dedicated Callback page).
 */
export const useLinkedInCallback = () => {
    useEffect(() => {
        // Parse the query parameters from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        const authError = urlParams.get('error');
        const authErrorDescription = urlParams.get('error_description');

        if (authCode) {
            // If a code is present, the login was successful.
            // Call our dedicated success handler.
            handleLinkedInSuccess(authCode);

            // Clean up the URL so the code doesn't stay in the address bar
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (authError) {
            // If there's an error in the redirect URL, handle it
            handleLinkedInError({ error: authError, description: authErrorDescription });

            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);
};
