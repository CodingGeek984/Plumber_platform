import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth-future.css';

const Auth = () => {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'client' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [navigate, user]);

  if (loading) return <div className="page-loader">Подключаем рабочее пространство...</div>;
  if (user) return null;

  const setValue = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  const switchTab = (nextTab) => {
    setTab(nextTab);
    setError('');
  };

  const doLogin = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    const result = await login(form.email, form.password);
    setBusy(false);
    if (result.ok) navigate('/dashboard');
    else setError(result.msg);
  };

  const doRegister = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Введите имя');
    if (form.password !== form.confirm) return setError('Пароли не совпадают');
    if (form.password.length < 6) return setError('Пароль минимум 6 символов');

    setBusy(true);
    const result = await register(form.name.trim(), form.email, form.password, form.role);
    setBusy(false);
    if (result.ok) navigate('/dashboard');
    else setError(result.msg);
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back">← На главную</Link>

      <div className="auth-shell auth-shell--compact">
        <div className="auth-card auth-card--wide auth-card--compact">
          <div className="auth-brand">
            <span className="brand-mark brand-mark--lg" />
            <div className="auth-brand__copy">
              <strong>Сантех строй</strong>
              <span>{tab === 'login' ? 'Вход' : 'Регистрация'}</span>
            </div>
          </div>

          <div className="auth-card__head">
            <h2>{tab === 'login' ? 'Войти' : 'Создать аккаунт'}</h2>
          </div>

          <div className="auth-tabs">
            <button className={tab === 'login' ? 'at-on' : ''} onClick={() => switchTab('login')}>Войти</button>
            <button className={tab === 'register' ? 'at-on' : ''} onClick={() => switchTab('register')}>Регистрация</button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={doLogin}>
              <div className="af">
                <label>Email</label>
                <input type="email" placeholder="example@mail.com" required value={form.email} onChange={setValue('email')} />
              </div>
              <div className="af">
                <label>Пароль</label>
                <input type="password" placeholder="••••••••" required value={form.password} onChange={setValue('password')} />
              </div>
              {error && <div className="auth-err">{error}</div>}
              <button type="submit" className="btn btn--full btn--lg" disabled={busy}>
                {busy ? 'Выполняем вход...' : 'Войти'}
              </button>
              <div className="auth-hint">
                <strong>Демо-доступ администратора</strong><br />
                <code>JennaKim123@gmail.com</code> / <code>JennaKim123456789</code>
              </div>
            </form>
          ) : (
            <form onSubmit={doRegister}>
              <div className="af">
                <label>Ваше имя</label>
                <input type="text" placeholder="Иван Иванов" required value={form.name} onChange={setValue('name')} />
              </div>
              <div className="af">
                <label>Email</label>
                <input type="email" placeholder="example@mail.com" required value={form.email} onChange={setValue('email')} />
              </div>
              <div className="af">
                <label>Роль в системе</label>
                <div className="role-row">
                  {[
                    ['client', 'CL', 'Клиент', 'Запускаю и отслеживаю заявки'],
                    ['employee', 'OP', 'Сотрудник', 'Веду назначенные выезды'],
                  ].map(([role, code, label, hint]) => (
                    <button
                      key={role}
                      type="button"
                      className={`role-opt ${form.role === role ? 'role-opt--on' : ''}`}
                      onClick={() => setForm((prev) => ({ ...prev, role }))}
                    >
                      <span className="ro-icon">{code}</span>
                      <strong>{label}</strong>
                      <span>{hint}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="af">
                <label>Пароль</label>
                <input type="password" placeholder="Минимум 6 символов" required value={form.password} onChange={setValue('password')} />
              </div>
              <div className="af">
                <label>Подтвердите пароль</label>
                <input type="password" placeholder="••••••••" required value={form.confirm} onChange={setValue('confirm')} />
              </div>
              {error && <div className="auth-err">{error}</div>}
              <button type="submit" className="btn btn--full btn--lg" disabled={busy}>
                {busy ? 'Создаём аккаунт...' : 'Создать аккаунт'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
