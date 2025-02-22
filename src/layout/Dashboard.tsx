import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import GroupIcon from "@mui/icons-material/Group";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { createTheme } from "@mui/material/styles";
import FishFarmsPage from "../pages/FishFarmsPage";
import WorkersPage from "../pages/WorkersPage";
import Logo from "../assets/logo.svg";

const NAVIGATION: Navigation = [
  {
    segment: "boats",
    title: "Boats",
    icon: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
        }}
      >
        <DirectionsBoatIcon sx={{ fontSize: "medium" }} />
      </div>
    ),
  },
  {
    segment: "workers",
    title: "Workers",
    icon: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
        }}
      >
        <GroupIcon sx={{ fontSize: "medium" }} />
      </div>
    ),
  },
];

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  palette: {
    primary: {
      main: "#26b0ff",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#fff",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: "0.75rem",
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          fontSize: "0.75rem",
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          marginBottom: "5px",
        },
      },
    },
  },
});

function PageContent({ pathname }: { pathname: string }) {
  switch (pathname) {
    case "/boats":
      return <FishFarmsPage />;
    case "/workers":
      return <WorkersPage />;
    default:
      return (
        <div className="p-4">
          <h2 className="text-xl mb-4">Welcome</h2>
          <p>Please select a section from the menu</p>
        </div>
      );
  }
}

interface DashboardProps {
  window?: () => Window;
}

export default function CustomDashboard(props: DashboardProps) {
  const { window } = props;
  const router = useDemoRouter("/boats");
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={customTheme}
      window={demoWindow}
    >
      <DashboardLayout
        sidebarExpandedWidth="250"
        branding={{
          logo: (
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "30px", height: "30px" }}
            />
          ),
          title: "Aqua Flow",
        }}
        defaultSidebarCollapsed
      >
        <PageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
