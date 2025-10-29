import { Route, Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import QuizPage from './pages/QuizPage';
import { GlobalStyle } from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import Header from './components/Header';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<QuizPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
