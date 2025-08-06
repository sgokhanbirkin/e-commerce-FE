import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    // Primary color
    colorPrimary: '#1890ff',
    colorPrimaryHover: '#40a9ff',
    colorPrimaryActive: '#096dd9',

    // Success colors
    colorSuccess: '#52c41a',
    colorSuccessHover: '#73d13d',
    colorSuccessActive: '#389e0d',

    // Warning colors
    colorWarning: '#faad14',
    colorWarningHover: '#ffc53d',
    colorWarningActive: '#d48806',

    // Error colors
    colorError: '#ff4d4f',
    colorErrorHover: '#ff7875',
    colorErrorActive: '#d9363e',

    // Text colors
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
    colorTextTertiary: '#bfbfbf',
    colorTextQuaternary: '#d9d9d9',

    // Background colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgElevated: '#ffffff',
    colorBgSpotlight: '#ffffff',

    // Border colors
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',

    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // Font sizes
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,

    // Line heights
    lineHeight: 1.5714,
    lineHeightLG: 1.5,
    lineHeightSM: 1.6667,

    // Spacing
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,

    // Padding
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,

    // Margin
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
    },
    Card: {
      borderRadiusLG: 8,
      boxShadowTertiary:
        '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    },
    Input: {
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
    },
  },
};
