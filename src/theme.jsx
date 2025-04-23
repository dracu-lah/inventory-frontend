import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Color palette
const primaryColor = {
  main: "#3a7bd5",
  light: "#5e99f7",
  dark: "#0d5baf",
  contrastText: "#fff",
};

const secondaryColor = {
  main: "#00b0ff",
  light: "#69e2ff",
  dark: "#0081cb",
  contrastText: "#fff",
};

const successColor = {
  main: "#2e7d32",
  light: "#4caf50",
  dark: "#1b5e20",
};

const errorColor = {
  main: "#d32f2f",
  light: "#ef5350",
  dark: "#c62828",
};

const warningColor = {
  main: "#ed6c02",
  light: "#ff9800",
  dark: "#e65100",
};

const infoColor = {
  main: "#0288d1",
  light: "#03a9f4",
  dark: "#01579b",
};

// Create a base theme
let theme = createTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    success: successColor,
    error: errorColor,
    warning: warningColor,
    info: infoColor,
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2d3748",
      secondary: "#4a5568",
    },
    divider: "rgba(0, 0, 0, 0.06)",
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.07)",
    "0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.07)",
    "0 4px 8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.07)",
    "0 8px 16px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.07)",
    "0 12px 24px rgba(0,0,0,0.05), 0 3px 6px rgba(0,0,0,0.07)",
    "0 16px 32px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.07)",
    "0 20px 40px rgba(0,0,0,0.05), 0 5px 10px rgba(0,0,0,0.07)",
    "0 24px 48px rgba(0,0,0,0.05), 0 6px 12px rgba(0,0,0,0.07)",
    "0 28px 56px rgba(0,0,0,0.05), 0 7px 14px rgba(0,0,0,0.07)",
    "0 32px 64px rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.07)",
    "0 36px 72px rgba(0,0,0,0.05), 0 9px 18px rgba(0,0,0,0.07)",
    "0 40px 80px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.07)",
    "0 44px 88px rgba(0,0,0,0.05), 0 11px 22px rgba(0,0,0,0.07)",
    "0 48px 96px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.07)",
    "0 52px 104px rgba(0,0,0,0.05), 0 13px 26px rgba(0,0,0,0.07)",
    "0 56px 112px rgba(0,0,0,0.05), 0 14px 28px rgba(0,0,0,0.07)",
    "0 60px 120px rgba(0,0,0,0.05), 0 15px 30px rgba(0,0,0,0.07)",
    "0 64px 128px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.07)",
    "0 68px 136px rgba(0,0,0,0.05), 0 17px 34px rgba(0,0,0,0.07)",
    "0 72px 144px rgba(0,0,0,0.05), 0 18px 36px rgba(0,0,0,0.07)",
    "0 76px 152px rgba(0,0,0,0.05), 0 19px 38px rgba(0,0,0,0.07)",
    "0 80px 160px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.07)",
    "0 84px 168px rgba(0,0,0,0.05), 0 21px 42px rgba(0,0,0,0.07)",
    "0 88px 176px rgba(0,0,0,0.05), 0 22px 44px rgba(0,0,0,0.07)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.07)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow:
              "0 8px 16px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.07)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryColor.main} 0%, ${primaryColor.dark} 100%)`,
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${secondaryColor.main} 0%, ${secondaryColor.dark} 100%)`,
        },
        sizeMedium: {
          padding: "8px 16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 20px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "20px",
          "&:last-child": {
            paddingBottom: "20px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          padding: "12px 16px",
        },
        head: {
          fontSize: "0.825rem",
          fontWeight: 600,
          color: "#4a5568",
          backgroundColor: "rgba(0, 0, 0, 0.01)",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
          },
          "&.MuiTableRow-hover:hover": {
            backgroundColor: "rgba(58, 123, 213, 0.04)",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: primaryColor.main,
          },
        },
        notchedOutline: {
          borderColor: "rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        sizeSmall: {
          height: 24,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          minWidth: "auto",
          padding: "12px 16px",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.06)",
        },
      },
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
