// Antd React 19 uyumluluğu için polyfill

// React 19 uyumluluğu için global override
export const setupAntdCompat = () => {
  // Wave effect'i devre dışı bırak
  const style = document.createElement('style');
  style.textContent = `
    .ant-wave {
      display: none !important;
    }
    .ant-btn:active {
      transform: none !important;
    }
    .ant-config-provider {
      isolation: isolate;
    }
  `;
  document.head.appendChild(style);

  // Cleanup function
  return () => {
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  };
};

// Console warning'leri bastır
export const suppressAntdWarnings = () => {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      message.includes('antd v5 support React is 16 ~ 18')
    ) {
      return; // Bu uyarıyı bastır
    }
    originalWarn.apply(console, args);
  };
};
