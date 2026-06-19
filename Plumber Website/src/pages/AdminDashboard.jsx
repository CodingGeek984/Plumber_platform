import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest, mapRequest, mapUser } from '../lib/api';

const STATUS = {
  pending:     { label: 'Новая',    color: '#f59e0b' },
  in_progress: { label: 'В работе', color: '#3b82f6' },
  completed:   { label: 'Завершена',color: '#22c55e' },
  cancelled:   { label: 'Отменена', color: '#ef4444' },
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [sec, setSec] = useState('overview');
  const [users, setUsers] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  if (!user || user.role !== 'admin') { nav('/auth', { replace: true }); return null; }

  const employees = users.filter(u => u.role === 'employee');
  const clients   = users.filter(u => u.role === 'client');

  useEffect(() => {
    let ignore = false;

    const loadAdminData = async () => {
      try {
        const [usersData, requestsData, statsData] = await Promise.all([
          apiRequest('/admin/users'),
          apiRequest('/admin/requests'),
          apiRequest('/admin/stats'),
        ]);

        if (ignore) return;

        setUsers(usersData.map(mapUser));
        setReqs(requestsData.map(mapRequest));
        setStats(statsData);
      } catch (error) {
        if (!ignore) setMsg(error.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadAdminData();

    return () => {
      ignore = true;
    };
  }, []);

  const toggleEmp = async (id) => {
    try {
      const data = await apiRequest(`/admin/users/${id}/status`, { method: 'PUT' });
      setUsers((prev) => prev.map((item) => (item.id === id ? { ...item, status: data.status } : item)));
      setStats((prev) => prev ? {
        ...prev,
        employees_online: Math.max(0, prev.employees_online + (data.status === 'online' ? 1 : -1)),
      } : prev);
    } catch (error) {
      setMsg(error.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      if (!window.confirm('Удалить пользователя?')) return;
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((item) => item.id !== id));
      setReqs((prev) => prev.filter((item) => item.clientId !== id && item.assignedTo !== id));
    } catch (error) {
      setMsg(error.message);
    }
  };

  const assignReq = async (rid, eid) => {
    try {
      if (!eid) return;
      const data = await apiRequest(`/admin/requests/${rid}/assign`, {
        method: 'PUT',
        body: { employee_id: Number(eid) },
      });
      const next = mapRequest(data);
      setReqs((prev) => prev.map((item) => (item.id === rid ? next : item)));
    } catch (error) {
      setMsg(error.message);
    }
  };

  const changeStatus = async (rid, status) => {
    try {
      const data = await apiRequest(`/admin/requests/${rid}`, {
        method: 'PUT',
        body: { status },
      });
      const next = mapRequest(data);
      setReqs((prev) => prev.map((item) => (item.id === rid ? next : item)));
    } catch (error) {
      setMsg(error.message);
    }
  };

  const navItems = [
    { id: 'overview',   icon: '📊', label: 'Обзор' },
    { id: 'employees',  icon: '👷', label: `Сотрудники (${employees.length})` },
    { id: 'clients',    icon: '👥', label: `Клиенты (${clients.length})` },
    { id: 'requests',   icon: '📋', label: `Заявки (${reqs.length})` },
  ];

  return (
    <div className="db">
      <aside className="db-side">
        <div className="db-logo">🛠️ Сантех строй</div>
        <div className="db-rolelbl">Администратор</div>
        <nav className="db-nav">
          {navItems.map(n => (
            <button key={n.id} className={`db-nav__item ${sec === n.id ? 'db-nav__item--on' : ''}`} onClick={() => setSec(n.id)}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="db-foot">
          <div className="db-who">
            <div className="db-av">A</div>
            <div><strong>{user.name}</strong><span>{user.email}</span></div>
          </div>
          <button className="db-logout" onClick={() => { logout(); nav('/'); }}>Выйти</button>
        </div>
      </aside>

      <main className="db-main">

        {sec === 'overview' && (
          <div className="db-sec">
            <h1>Обзор</h1>
            {msg && <div className="db-alert db-alert--warn">{msg}</div>}
            {loading && <p className="db-empty">Загружаем данные...</p>}
            <div className="db-stats">
              {[
                { v: stats?.employees_total ?? employees.length, l: 'Сотрудников',  ic: '👷', c: '#3b82f6' },
                { v: stats?.employees_online ?? employees.filter(e => e.status === 'online').length, l: 'На работе', ic: '🟢', c: '#22c55e' },
                { v: stats?.clients_total ?? clients.length,   l: 'Клиентов',     ic: '👥', c: '#8b5cf6' },
                { v: stats?.requests_pending ?? reqs.filter(r => r.status === 'pending').length,     l: 'Новых заявок', ic: '📋', c: '#f59e0b' },
                { v: stats?.requests_in_progress ?? reqs.filter(r => r.status === 'in_progress').length, l: 'В работе',     ic: '⚙️', c: '#06b6d4' },
                { v: stats?.requests_completed ?? reqs.filter(r => r.status === 'completed').length,   l: 'Завершено',    ic: '✅', c: '#22c55e' },
              ].map((s, i) => (
                <div key={i} className="db-stat" style={{ '--c': s.c }}>
                  <span className="db-stat__ic">{s.ic}</span>
                  <strong>{s.v}</strong>
                  <span>{s.l}</span>
                </div>
              ))}
            </div>

            <h2>Статус сотрудников</h2>
            {employees.length === 0 && <p className="db-empty">Сотрудников пока нет</p>}
            <div className="emp-grid">
              {employees.map(e => (
                <div key={e.id} className="emp-card">
                  <div className="emp-av">{e.name[0]}</div>
                  <div className="emp-info">
                    <strong>{e.name}</strong>
                    <span>{e.email}</span>
                  </div>
                  <span className={`emp-badge ${e.status === 'online' ? 'eb--on' : ''}`}>
                    {e.status === 'online' ? '🟢 На работе' : '⚫ Не работает'}
                  </span>
                  <span className="emp-tasks">
                    {reqs.filter(r => r.assignedTo === e.id && r.status === 'in_progress').length} зад.
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sec === 'employees' && (
          <div className="db-sec">
            <h1>Сотрудники</h1>
            {employees.length === 0
              ? <p className="db-empty">Сотрудников пока нет. Они появятся после регистрации.</p>
              : (
                <div className="tbl-wrap">
                  <table className="tbl">
                    <thead><tr><th>Имя</th><th>Email</th><th>Статус</th><th>Заявок</th><th>Действия</th></tr></thead>
                    <tbody>
                      {employees.map(e => (
                        <tr key={e.id}>
                          <td><div className="td-name"><div className="db-av db-av--sm">{e.name[0]}</div>{e.name}</div></td>
                          <td>{e.email}</td>
                          <td><span className={`emp-badge ${e.status === 'online' ? 'eb--on' : ''}`}>{e.status === 'online' ? '🟢 На работе' : '⚫ Не работает'}</span></td>
                          <td>{e.assignedRequestsCount}</td>
                          <td className="td-acts">
                            <button className="dbbtn" onClick={() => toggleEmp(e.id)}>
                              {e.status === 'online' ? 'Снять с работы' : 'Поставить на работу'}
                            </button>
                            <button className="dbbtn dbbtn--del" onClick={() => deleteUser(e.id)}>Удалить</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        )}

        {sec === 'clients' && (
          <div className="db-sec">
            <h1>Клиенты</h1>
            {clients.length === 0
              ? <p className="db-empty">Клиентов пока нет. Они появятся после регистрации.</p>
              : (
                <div className="tbl-wrap">
                  <table className="tbl">
                    <thead><tr><th>Имя</th><th>Email</th><th>Заявок</th><th>Дата регистрации</th><th>Действия</th></tr></thead>
                    <tbody>
                      {clients.map(c => (
                        <tr key={c.id}>
                          <td><div className="td-name"><div className="db-av db-av--sm db-av--pur">{c.name[0]}</div>{c.name}</div></td>
                          <td>{c.email}</td>
                          <td>{c.serviceRequestsCount}</td>
                          <td>{new Date(c.createdAt).toLocaleDateString('ru')}</td>
                          <td><button className="dbbtn dbbtn--del" onClick={() => deleteUser(c.id)}>Удалить</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        )}

        {sec === 'requests' && (
          <div className="db-sec">
            <h1>Все заявки</h1>
            {reqs.length === 0 && <p className="db-empty">Заявок пока нет.</p>}
            <div className="req-list">
              {[...reqs].reverse().map(r => {
                const s = STATUS[r.status] || STATUS.pending;
                return (
                  <div key={r.id} className="req-card">
                    <div className="req-head">
                      <div>
                        <strong>{r.service}</strong>
                        <span>{r.clientName} · {new Date(r.createdAt).toLocaleDateString('ru')}</span>
                      </div>
                      <span className="req-badge" style={{ background: s.color + '20', color: s.color }}>{s.label}</span>
                    </div>
                    {r.description && <p className="req-desc">{r.description}</p>}
                    <div className="req-foot">
                      <div className="req-row">
                        <label>Назначить:</label>
                        <select value={r.assignedTo || ''} onChange={e => assignReq(r.id, e.target.value)}>
                          <option value="">— не назначен —</option>
                          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                      </div>
                      <div className="req-row">
                        <label>Статус:</label>
                        <select value={r.status} onChange={e => changeStatus(r.id, e.target.value)}>
                          <option value="pending">Новая</option>
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

      </main>
    </div>
  );
};

export default AdminDashboard;
