export const getSeason = (next: boolean): string => {
  const month = new Date().getMonth();
  let currentSeason: string;

  if (month >= 2 && month <= 4) {
    currentSeason = 'SPRING';
  } else if (month >= 5 && month <= 7) {
    currentSeason = 'SUMMER';
  } else if (month >= 8 && month <= 10) {
    currentSeason = 'FALL';
  } else {
    currentSeason = 'WINTER';
  }

  if (!next) {
    return currentSeason;
  }

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
      return 'UNKNOWN';
  }
};
