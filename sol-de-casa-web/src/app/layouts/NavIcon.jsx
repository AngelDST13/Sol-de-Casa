const PATHS = {
  home: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  share:
    'M16 6l-8 4.5M16 18l-8-4.5M18 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7M22 21v-1a6 6 0 0 0-4-5.6',
  panel: 'M3 9h18l-2 11H5zM8 9l-1 11M12 9v11M16 9l1 11M4 14.5h16M12 2v3M6.5 4l1.5 2M17.5 4L16 6',
  gauge: 'M4 18a8 8 0 1 1 16 0M12 18l4-6',
  inbox: 'M3 13h5l1.5 3h5l1.5-3h5M5 5h14l2 8v6H3v-6z',
  columns: 'M4 5h4v14H4zM10 9h4v10h-4zM16 12h4v7h-4z',
  chart: 'M4 19h16M5 15l4-4 3 3 7-7',
  doc: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  bars: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5M8 14h3M13 14h3M8 17h3',
  key: 'M14.5 9.5a4.5 4.5 0 1 0-4 4.47V14l1.5 1.5L10.5 17l1.5 1.5L10.5 20 12 21.5h2.5V14l.03-.03A4.5 4.5 0 0 0 14.5 9.5zM10 8h.01',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L15 3.4h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.4 7.4 0 0 0 1.7-1l2.4 1 2-3.4z',
};

export const NavIcon = ({ name }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={PATHS[name]} />
  </svg>
);
