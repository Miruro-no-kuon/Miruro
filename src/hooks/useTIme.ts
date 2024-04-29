export const date = new Date();

export const time = new Date().getTime();

export const year = new Date().getFullYear();

export const month = new Date().getMonth();

export const getCurrentSeason = (): string => {
  if (month >= 2 && month <= 4) {
    return 'SPRING';
  } else if (month >= 5 && month <= 7) {
    return 'SUMMER';
  } else if (month >= 8 && month <= 10) {
    return 'FALL';
  } else {
    return 'WINTER';
  }
};

export const getNextSeason = (): string => {
  const currentSeason = getCurrentSeason();
  switch (currentSeason) {
    case 'SPRING':
      return 'SUMMER';
    case 'SUMMER':
      return 'FALL';
    case 'FALL':
      return 'WINTER';
    case 'WINTER':
      return 'SPRING';
    default:
      return 'UNKNOWN'; // Should never be reached
  }
};
