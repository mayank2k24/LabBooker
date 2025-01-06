export const ValidateSystem = (system) => {
  if (!system) return false;
  
  try {
    const pattern = /^CVR-\d{3}-\d{1,2}$/i;
    return pattern.test(system.toString().trim());
  } catch (err) {
    console.error('Validation error:', err);
    return false;
  }
};

export const formatSystemName = (resourceId) => {
  if (!resourceId) return 'Unknown';
  
  try {
    return resourceId.toString().toUpperCase().replace(/^(CVR-\d{3}-\d{1,2}).*$/i, '$1');
  } catch (err) {
    console.error('Format error:', err);
    return resourceId;
  }
};