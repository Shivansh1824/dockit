const DockitLogo = ({ size = 22, color = '#01696f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Dockit logo">
    <path
      d="M9 11l3 3L22 4"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DockitLogo;
