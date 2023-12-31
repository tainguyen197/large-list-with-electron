const noFoundIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0YWRhdGE+DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMjQ2LDEzOS4ybC01My41LTk3LjZsMCwwSDYzLjVsMCwwTDEwLDEzOS4ybDAsMHY3NS4xaDIzNlYxMzkuMkwyNDYsMTM5LjJ6IE0yMzkuNCwxMzkuMmgtMjIuMmwtMjQuNS01Mi41VjU0TDIzOS40LDEzOS4yeiBNNjguMyw5MC4ySDE4OGwyMi45LDQ5LjNoLTUwLjFsLTAuNSwwLjNjLTEuMSwwLjUtMi40LDEuMy0zLjksMi4xYy02LjksMy45LTE2LjEsOS0yOC4yLDljLTE1LDAtMzIuNC0xMC44LTMyLjctMTEuMWwtMC44LTAuNUg0Ny4yTDY4LjMsOTAuMnogTTY5LjMsNDcuMmgxMTcuOXYzNy4ySDY5LjNWNDcuMnogTTYzLjUsNTR2MzIuN2wtMjIuNCw1Mi41SDE2LjlMNjMuNSw1NHogTTI0MC41LDIwOC44SDE1LjhWMTQ1aDc3LjVjMy43LDIuMSwxOS44LDExLjYsMzQuOCwxMS42YzEzLjQsMCwyNC01LjgsMzEuMS05LjhjMS4xLTAuNSwyLjEtMS4zLDMuMi0xLjZoNzguM3Y2My42SDI0MC41TDI0MC41LDIwOC44eiBNOTQuMSwxNzQuM2g2Ny41djkuNUg5NC4xVjE3NC4zeiIvPjwvZz48L2c+DQo8L3N2Zz4=';

const NoData = () => (
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
    <img src={noFoundIcon} width="128" height="128" />
    <p>No items found here.</p>
  </div>
);

export default NoData;
