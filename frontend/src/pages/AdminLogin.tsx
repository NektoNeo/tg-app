import api from '../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post<{ token: string }>('/admin/login', credentials);
      sessionStorage.setItem('adminToken', response.data.token);
      toast.success('Успешный вход в админ-панель');
      navigate('/admin/dashboard', { replace: true });
    } catch {
      toast.error('Вход не выполнен. Проверьте данные и доступность сервера.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Админ-панель VA-PC</h1>
          <p className="text-gray-500 mt-2">Войдите для управления магазином</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Имя пользователя"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Введите логин"
            required
          />

          <Input
            label="Пароль"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Введите пароль"
            icon={<Lock className="w-5 h-5" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
          >
            Войти в панель управления
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Защищенная зона администратора</p>
        </div>
      </motion.div>
    </div>
  );
}