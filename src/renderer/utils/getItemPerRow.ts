const mapping = {
  xs: 4,
  sm: 3,
  md: 2,
  lg: 2,
  xl: 1.5,
};

const getItemPerRow = (viewSize, variant) => {
  if (variant === 'listView') return 12;

  return mapping[viewSize];
};

export default getItemPerRow;
