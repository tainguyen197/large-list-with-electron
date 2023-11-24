const NoPermission = ({ error }: any) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
      paddingTop: '72px',
    }}
  >
    <p>{error}</p>
  </div>
);

export default NoPermission;
