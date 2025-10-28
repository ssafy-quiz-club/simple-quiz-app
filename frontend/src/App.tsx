import QuizPage from './pages/QuizPage';
import AdminPage from './pages/AdminPage';
import { GlobalStyle } from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

function App() {
  // URL 파라미터로 관리자 페이지 접근: ?admin=true
  const isAdminPage = new URLSearchParams(window.location.search).get('admin') === 'true';

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {isAdminPage ? <AdminPage /> : <QuizPage />}
    </ThemeProvider>
  );
}

export default App;
