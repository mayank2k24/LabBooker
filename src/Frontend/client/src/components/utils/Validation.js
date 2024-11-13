export const ValidateSystem = (system) => {
    const validLabs = ['CVR-212 MT LAB', 'CVR-215 RS LAB'];
    const [lab, pcNumber] = system.split('-');
    const pcNum = parseInt(pcNumber.replace('PC', ''));
    return validLabs.includes(lab) && pcNum > 0 && pcNum <= 30; // Assume max 30 PCs per lab
  };
  
  export const formatSystemName = (system) => {
    if (!system || typeof system !== 'string') {
      return 'Unknown System';
    }
    const parts = system.split('-');
    if (parts.length !== 2) {
      return system;
    }
    const [lab, pcNumber] = parts;
    const pcNum = pcNumber.replace(/\D/g, '');
    return `${lab}-PC${pcNum.padStart(2, '0')}`;
  };