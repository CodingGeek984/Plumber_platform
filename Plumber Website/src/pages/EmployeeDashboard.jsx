import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest, mapRequest } from '../lib/api';

const STATUS = {
  pending:     { label: 'Новая',     color: '#f59e0b', icon: '⏳' },
  in_progress: { label: 'В работе',  color: '#3b82f6', icon: '⚙️' },
  completed:   { label: 'Завершена', color: '#22c55e', icon: '✅' },
  cancelled:   { label: 'Отменена',  color: '#ef4444', icon: '❌' },
};

const EmployeeDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const nav = useNavigate();
  const [sec, setSec] = useState('requests');
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  if (!user || user.role !== 'employee') { nav('/auth', { replace: true }); return null; }

  useEffect(() => {
    let ignore = false;

    const loadRequests = async () => {
      try {
        const data = await apiRequest('/employee/requests');
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

  const me = { ...user, status: user.status ?? 'offline' };
  const myReqs = reqs.filter(r => r.assignedTo === user.id);

  const toggleStatus = async () => {
    try {
      const data = await apiRequest('/employee/status', { method: 'PUT' });
      updateUser({ status: data.status });
    } catch (error) {
      setMsg(error.message);
    }
  };

  const updateReqStatus = async (id, status) => {
    try {
      const data = await apiRequest(`/employee/requests/${id}/status`, {
        method: 'PUT',
        body: { status },
      });
      const next = mapRequest(data);
      setReqs((prev) => prev.map((item) => (item.id === id ? next : item)));
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <div className="db">
      <aside className="db-side">
        <div className="db-logo">🛠️ Сантех строй</div>
        <div className="db-rolelbl">Сотрудник</div>
        <nav className="db-nav">
          {[
            { id: 'requests', icon: '📋', label: `Мои заявки (${myReqs.length})` },
            { id: 'profile',  icon: '👤', label: 'Профиль' },
          ].map(n => (
            <button key={n.id} className={`db-nav__item ${sec === n.id ? 'db-nav__item--on' : ''}`} onClick={() => setSec(n.id)}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="db-foot">
          <div className="db-who">
            <div className="db-av">{user.name[0]}</div>
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
              <div className={`st-toggle ${me.status === 'online' ? 'st-toggle--on' : ''}`} onClick={toggleStatus}>
                <span className="st-dot" />
                {me.status === 'online' ? 'На работе' : 'Не работаю'}
              </div>
            </div>

            {msg && <div className="db-alert db-alert--warn">{msg}</div>}
            {loading && <p className="db-empty">Загружаем заявки...</p>}

            {myReqs.length === 0 && (
              <div className="db-empty-box">
                <div>📋</div>
                <p>Нет назначенных заявок. Администратор назначит вам задачи.</p>
              </div>
            )}

            <div className="req-list">
              {myReqs.map(r => {
                const s = STATUS[r.status] || STATUS.pending;
                return (
                  <div key={r.id} className="req-card">
                    <div className="req-head">
                      <div>
                        <strong>{r.service}</strong>
                        <span>{r.clientName} · {new Date(r.createdAt).toLocaleDateString('ru')}</span>
                      </div>
                      <span className="req-badge" style={{ background: s.color + '20', color: s.color }}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                    {r.description && <p className="req-desc">{r.description}</p>}
                    {r.clientPhone && <p className="req-phone">📞 {r.clientPhone}</p>}
                    <div className="req-foot">
                      <div className="req-row">
                        <label>Изменить статус:</label>
                        <select value={r.status} onChange={e => updateReqStatus(r.id, e.target.value)}>
                          <option value="in_progress">В работе</option>
                          <option value="completed">Завершена</option>
                          <option value="cancelled">Отменена</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sec === 'profile' && (
          <div className="db-sec">
            <h1>Мой профиль</h1>
            <div className="profile-card">
              <div className="profile-av">{user.name[0]}</div>
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <span className={`emp-badge ${me.status === 'online' ? 'eb--on' : ''}`}>
                  {me.status === 'online' ? '🟢 На работе' : '⚫ Не работает'}
                </span>
              </div>
              <div className="profile-stats">
                <div><strong>{myReqs.length}</strong><span>Всего заявок</span></div>
                <div><strong>{myReqs.filter(r => r.status === 'in_progress').length}</strong><span>В работе</span></div>
                <div><strong>{myReqs.filter(r => r.status === 'completed').length}</strong><span>Завершено</span></div>
              </div>
              <button
                className={`btn btn--lg ${me.status === 'online' ? 'btn--dng' : 'btn--suc'}`}
                onClick={toggleStatus}
              >
                {me.status === 'online' ? '⚫ Завершить смену' : '🟢 Начать смену'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default EmployeeDashboard;
