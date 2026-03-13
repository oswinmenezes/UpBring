/**
 * ocr_service.js
 *
 * Service to handle OCR API calls for resume text extraction.
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Sends a resume image to the backend OCR endpoint for text extraction.
 *
 * @param {File} imageFile - The image file to process (jpg, jpeg, png, gif, bmp, webp)
 * @returns {Promise<Object>} - Response object with success status and extracted text
 * @throws {Error} - If the request fails or returns an error
 */
export const extractResumeText = async (imageFile) => {
    if (!imageFile) {
        throw new Error('No image file provided');
    }

    // Validate file type
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const fileExtension = imageFile.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        throw new Error(
            `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
        );
    }

    try {
        // Create FormData to send file as multipart/form-data
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${API_BASE_URL}/ocr/extract-text`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to extract text: ${response.statusText}`);
        }

        if (!data.success) {
            throw new Error(data.error || 'OCR processing failed');
        }

        return {
            success: true,
            extractedText: data.extracted_text,
        };
    } catch (error) {
        console.error('Error extracting resume text:', error);
        throw error;
    }
};
