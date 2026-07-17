export const loadHeic2Any = async (): Promise<any> => {
  if (typeof window === 'undefined') return null;
  try {
    const heic2any = await import('heic2any');
    return heic2any.default || heic2any;
  } catch (err) {
    console.error("Failed to load heic2any:", err);
    throw err;
  }
};
