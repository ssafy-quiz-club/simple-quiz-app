import QuizPage from './pages/QuizPage';
import { GlobalStyle } from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <QuizPage />
    </ThemeProvider>
  );
}

export default App;
