export const resolveImageUrl = (path?: string | null): string | null => {
  if (!path) return null;
  
  // If it's already a full URL or base64 or blob, return as is
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  
  // Clean up the path and prepend base URL
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${base}${cleanPath}`;
};
