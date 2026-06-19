import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest, mapRequest } from '../lib/api';

const SERVICES = [
  'Установка сантехники',
  'Прочистка канализации',
  'Монтаж теплого пола',
  'Установка водонагревателей',
  'Замена труб',
  'Устранение протечек',
  'Установка инсталляции',
  'Монтаж фильтров',
  'Разводка сантехники',
  'Другое',
];

const STATUS = {
  pending:     { label: 'Ожидает',   color: '#f59e0b', icon: '⏳' },
  in_progress: { label: 'В работе',  color: '#3b82f6', icon: '⚙️' },
  completed:   { label: 'Завершена', color: '#22c55e', icon: '✅' },
  cancelled:   { label: 'Отменена',  color: '#ef4444', icon: '❌' },
};

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [sec, setSec] = useState('requests');
  const [reqs, setReqs] = useState([]);
  const [form, setForm] = useState({ service: '', phone: '', description: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  if (!user || user.role !== 'client') { nav('/auth', { replace: true }); return null; }

  useEffect(() => {
    let ignore = false;

    const loadRequests = async () => {
      try {
        const data = await apiRequest('/client/requests');
        if (!ignore) setReqs(data.map(mapRequest));
      } catch (error) {
        if (!ignore) setMsg(error.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadRequests();

    return () => {
      ignore = true;
    };
  }, []);

  const myReqs = reqs.filter(r => r.clientId === user.id);

  const submitReq = async (e) => {
    e.preventDefault();
    try {
      const data = await apiRequest('/client/requests', {
        method: 'POST',
        body: {
          service: form.service,
          client_phone: form.phone,
          description: form.description,
        },
      });
      setReqs((prev) => [mapRequest(data), ...prev]);
      setForm({ service: '', phone: '', description: '' });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setSec('requests');
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <div className="db">
      <aside className="db-side">
        <div className="db-logo">🛠️ Сантех строй</div>
        <div className="db-rolelbl">Клиент</div>
        <nav className="db-nav">
          {[
            { id: 'requests', icon: '📋', label: `Мои заявки (${myReqs.length})` },
            { id: 'new',      icon: '➕', label: 'Новая заявка' },
            { id: 'profile',  icon: '👤', label: 'Профиль' },
          ].map(n => (
            <button key={n.id} className={`db-nav__item ${sec === n.id ? 'db-nav__item--on' : ''}`} onClick={() => setSec(n.id)}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="db-foot">
          <div className="db-who">
            <div className="db-av db-av--pur">{user.name[0]}</div>
            <div><strong>{user.name}</strong><span>{user.email}</span></div>
          </div>
          <button className="db-logout" onClick={() => { logout(); nav('/'); }}>Выйти</button>
        </div>
      </aside>

      <main className="db-main">

        {sec === 'requests' && (
          <div className="db-sec">
            <div className="db-sec__top">
              <h1>Мои заявки</h1>
              <button className="btn" onClick={() => setSec('new')}>+ Новая заявка</button>
            </div>

            {sent && <div className="db-alert">✅ Заявка успешно отправлена! Ожидайте звонка от мастера.</div>}
            {msg && <div className="db-alert db-alert--warn">{msg}</div>}
            {loading && <p className="db-empty">Загружаем заявки...</p>}

            {myReqs.length === 0 && !sent && (
              <div className="db-empty-box">
                <div>🔧</div>
                <p>У вас пока нет заявок</p>
                <button className="btn" onClick={() => setSec('new')}>Подать первую заявку</button>
              </div>
            )}

            <div className="req-list">
              {[...myReqs].reverse().map(r => {
                const s = STATUS[r.status] || STATUS.pending;
                return (
                  <div key={r.id} className="req-card">
                    <div className="req-head">
                      <div>
                        <strong>{r.service}</strong>
                        <span>{new Date(r.createdAt).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <span className="req-badge" style={{ background: s.color + '20', color: s.color }}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                    {r.description && <p className="req-desc">{r.description}</p>}
                    {r.assignedName && (
                      <div className="req-assigned">🔧 Исполнитель: <strong>{r.assignedName}</strong></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sec === 'new' && (
          <div className="db-sec">
            <h1>Новая заявка</h1>
            <div className="db-form-box">
              <form onSubmit={submitReq}>
                <div className="af">
                  <label>Услуга</label>
                  <select required value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                    <option value="">Выберите услугу</option>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="af">
                  <label>Телефон для связи</label>
                  <input type="tel" placeholder="+7 (700) 000-00-00" required
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="af">
                  <label>Описание проблемы</label>
                  <textarea rows={4} placeholder="Расскажите подробнее о вашей ситуации..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <button type="submit" className="btn btn--full btn--lg">Отправить заявку</button>
              </form>
            </div>
          </div>
        )}

        {sec === 'profile' && (
          <div className="db-sec">
            <h1>Мой профиль</h1>
            <div className="profile-card">
              <div className="profile-av profile-av--pur">{user.name[0]}</div>
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <span className="tag">Клиент</span>
              </div>
              <div className="profile-stats">
                <div><strong>{myReqs.length}</strong><span>Всего заявок</span></div>
                <div><strong>{myReqs.filter(r => r.status === 'completed').length}</strong><span>Завершено</span></div>
                <div><strong>{myReqs.filter(r => r.status === 'in_progress').length}</strong><span>В работе</span></div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ClientDashboard;
