import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      {/* Chứa toàn bộ logic điều hướng của ứng dụng */}
      <AppRoutes />
      
      {/* Cấu hình hiển thị thông báo (toast) ở góc trên bên phải */}
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;