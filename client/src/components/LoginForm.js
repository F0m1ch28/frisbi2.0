import React, { useState } from 'react';
import { useStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { store } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await store.login(email, password);
      navigate('/'); // Перенаправление на домашнюю страницу
    } catch (error) {
      setError('Ошибка входа: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Ваши поля формы */}
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Войти</button>
    </form>
  );
};

export default LoginForm;