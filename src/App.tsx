import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import Dashboard from "./layout/Dashboard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
