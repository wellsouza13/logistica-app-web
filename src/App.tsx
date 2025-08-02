import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppRoutes } from './routes';
import { theme } from './styles/theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
