import axios from 'axios';

// Upload a document file for a specific user and document type
export async function uploadDocument({ file, documentType, user }) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  formData.append('user', user);

  try {
    const response = await axios.post('http://localhost:5000/api/submissions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Fetch all submissions for a specific user
export async function fetchUserSubmissions(user) {
  try {
    const response = await axios.get('http://localhost:5000/api/submissions/user-submissions', {
      params: { user }
    });
    return response.data;
  } catch (error) {
    console.error('Fetch submissions failed:', error);
    throw error;
  }
}
