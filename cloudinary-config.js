// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'debp1kjtm',
    uploadPreset: 'sql_admin',
    folder: 'sql_users',
    uploadUrl: 'https://api.cloudinary.com/v1_1/debp1kjtm/image/upload'
};

// Upload image to Cloudinary
async function uploadToCloudinary(file) {
    if (!file) return '';
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('folder', CLOUDINARY_CONFIG.folder);
        
        const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Cloudinary Upload Success:', data);
        return data.secure_url || '';
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        showToast('Image upload failed: ' + error.message, 'error');
        return '';
    }
}

// Upload multiple files
async function uploadMultipleToCloudinary(files) {
    const urls = [];
    
    for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (url) urls.push(url);
    }
    
    return urls;
}

// Validate image before upload
function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        showToast('Invalid file type. Please upload JPG, PNG, GIF, or WebP', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showToast('File size exceeds 5MB limit', 'error');
        return false;
    }
    
    return true;
}
