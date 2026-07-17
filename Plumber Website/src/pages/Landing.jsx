import { useEffect, useRef, useState } from 'react';
import '../styles/landing-future.css';

const SERVICE_LINES = [
  {
    code: 'IN-01',
    title: 'Установка сантехники',
    summary: 'Монтаж раковин, унитазов, душевых, ванн и подключение новой сантехники под ключ.',
    eta: 'ETA 29 мин',
    availability: '2 монтажные группы',
    price: 'от 12 000 тг',
    zone: 'Алматы · весь город',
    bullets: ['Монтаж и герметизация узлов', 'Подключение сифонов и сливов', 'Демонтаж старого оборудования по запросу'],
  },
  {
    code: 'DR-02',
    title: 'Прочистка канализации',
    summary: 'Кухня, ванная, стояк и сложные участки канализации с понятным прогнозом по приезду.',
    eta: 'ETA 18 мин',
    availability: '5 слотов сегодня',
    price: 'от 6 500 тг',
    zone: 'Алматы · центр / запад',
    bullets: ['Механическая и гидродинамическая прочистка', 'Диагностика повторных засоров', 'Профилактика после завершения работ'],
  },
  {
    code: 'HF-03',
    title: 'Монтаж теплого пола',
    summary: 'Укладка водяного теплого пола, подключение контуров и подготовка системы к запуску.',
    eta: 'ETA 45 мин',
    availability: '2 бригады по монтажу',
    price: 'от 25 000 тг',
    zone: 'Алматы · квартиры и дома',
    bullets: ['Раскладка контуров по зонам', 'Подключение коллектора', 'Проверка давления перед заливкой'],
  },
  {
    code: 'WH-04',
    title: 'Установка водонагревателей',
    summary: 'Монтаж, подключение и безопасный запуск накопительных и проточных водонагревателей.',
    eta: 'ETA 39 мин',
    availability: '1 окно на сегодня',
    price: 'от 15 000 тг',
    zone: 'Алматы · север / пригород',
    bullets: ['Подключение к воде и питанию', 'Защитная арматура и проверка безопасности', 'Первый запуск и инструкция'],
  },
  {
    code: 'PP-05',
    title: 'Замена труб',
    summary: 'Частичная или полная замена трубопроводов с цифровым контролем этапов и давления.',
    eta: 'ETA 34 мин',
    availability: '2 проектные бригады',
    price: 'от 18 000 тг',
    zone: 'Алматы · квартиры и дома',
    bullets: ['Полная и локальная замена труб', 'Монтаж ПВХ, полипропилена и металлопластика', 'Опрессовка после завершения'],
  },
  {
    code: 'LK-06',
    title: 'Устранение протечек',
    summary: 'Поиск источника течи, перекрытие воды, локальный ремонт и проверка соединений.',
    eta: 'ETA 12 мин',
    availability: '4 бригады онлайн',
    price: 'от 8 000 тг',
    zone: 'Алматы · 24/7',
    bullets: ['Быстрая локализация аварии', 'Замена поврежденных соединений', 'Фотоотчет и рекомендации после ремонта'],
  },
  {
    code: 'FR-07',
    title: 'Установка инсталляции',
    summary: 'Монтаж рамной системы, подключение подвесного унитаза и аккуратная настройка бачка.',
    eta: 'ETA 36 мин',
    availability: '2 мастера рядом',
    price: 'от 20 000 тг',
    zone: 'Алматы · весь город',
    bullets: ['Крепление рамы по уровню', 'Подключение воды и канализации', 'Проверка смыва и герметичности'],
  },
  {
    code: 'FL-08',
    title: 'Монтаж фильтров',
    summary: 'Установка магистральных фильтров, питьевых систем и узлов очистки воды.',
    eta: 'ETA 31 мин',
    availability: '3 слота сегодня',
    price: 'от 10 000 тг',
    zone: 'Алматы · центр / запад',
    bullets: ['Подбор места установки', 'Монтаж колб и картриджей', 'Проверка давления после запуска'],
  },
  {
    code: 'PL-09',
    title: 'Разводка сантехники',
    summary: 'Проектирование и монтаж разводки воды и канализации для кухни, ванной и санузла.',
    eta: 'ETA 42 мин',
    availability: '2 проектные бригады',
    price: 'от 22 000 тг',
    zone: 'Алматы · квартиры и дома',
    bullets: ['Разметка точек подключения', 'Монтаж труб и фитингов', 'Опрессовка и проверка системы'],
  },
];

const HERO_METRICS = [
  ['12', 'бригад онлайн'],
  ['7 мин', 'медианный ответ'],
  ['24/7', 'аварийная линия'],
  ['98%', 'закрытие за визит'],
];

const LIVE_FEED = [
  { code: 'KZ-14', district: 'Центр / Акмешит', service: 'Аварийный выезд', eta: '14 мин', load: 78, status: 'В пути', tone: 'moving' },
  { code: 'KZ-08', district: 'Левый берег / Север', service: 'Монтаж и установка', eta: '21 мин', load: 61, status: 'Готов', tone: 'ready' },
  { code: 'KZ-21', district: 'Юг / Запад', service: 'Засоры и канализация', eta: '19 мин', load: 84, status: 'На заказе', tone: 'busy' },
  { code: 'KZ-05', district: 'Восток / Пригород', service: 'Трубы и бойлеры', eta: '27 мин', load: 52, status: 'Свободен', tone: 'ready' },
];

const AUDIENCE = [
  {
    code: '01',
    title: 'Владельцам квартир',
    text: 'Для ремонта ванной, кухни, санузла, замены труб и срочного устранения протечек в квартире.',
    tags: ['Квартира', 'Ремонт', 'Аварии'],
  },
  {
    code: '02',
    title: 'Частным домам',
    text: 'Для разводки сантехники, теплого пола, водонагревателей, фильтров и комплексных монтажных работ.',
    tags: ['Дом', 'Монтаж', 'Комфорт'],
  },
  {
    code: '03',
    title: 'Офисам и бизнесу',
    text: 'Для быстрого обслуживания санузлов, прочистки канализации и плановых сантехнических работ без простоя.',
    tags: ['Офис', 'Сервис', 'Сроки'],
  },
  {
    code: '04',
    title: 'Новостройкам и ремонту',
    text: 'Для установки инсталляций, разводки точек, монтажа фильтров и подготовки сантехники к чистовой отделке.',
    tags: ['Новостройка', 'Разводка', 'Под ключ'],
  },
];

const REVIEWS = [
  {
    name: 'Александр М.',
    role: 'Аварийный выезд',
    text: 'Платформа показала ближайшего сантехника, ETA и понятный статус. Это ощущалось как нормальный цифровой продукт, а не хаотичный обзвон.',
  },
  {
    name: 'Светлана К.',
    role: 'Установка сантехники',
    text: 'Сразу было видно, что именно заказано, кто приедет и что будет после работ. Очень спокойный и прозрачный сценарий.',
  },
  {
    name: 'Дмитрий П.',
    role: 'Прочистка засора',
    text: 'Самое сильное впечатление дало не только качество работ, а контроль над процессом: статус, история и гарантия остались в кабинете.',
  },
];

const NAV_ITEMS = [
  ['Услуги', 'services'],
  ['Кому подойдёт', 'audience'],
  ['Доступность', 'dispatch'],
  ['Отзывы', 'reviews'],
  ['Мастер', 'contact'],
];

const Landing = () => {
  const shellRef = useRef(null);
  const orbRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in');
        });
      },
      { threshold: 0.16 }
    );

    document.querySelectorAll('.fu').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (event) => {
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${event.clientX - 320}px, ${event.clientY - 320}px)`;
      }

      if (shellRef.current) {
        const x = event.clientX / window.innerWidth;
        const y = event.clientY / window.innerHeight;
        const rotateX = ((0.5 - y) * 8).toFixed(2);
        const rotateY = ((x - 0.5) * 10).toFixed(2);
        const shiftX = ((x - 0.5) * 28).toFixed(2);
        const shiftY = ((y - 0.5) * 22).toFixed(2);

        shellRef.current.style.setProperty('--future-rotate-x', `${rotateX}deg`);
        shellRef.current.style.setProperty('--future-rotate-y', `${rotateY}deg`);
        shellRef.current.style.setProperty('--future-shift-x', `${shiftX}px`);
        shellRef.current.style.setProperty('--future-shift-y', `${shiftY}px`);
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!activeService) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveService(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeService]);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const openRequest = () => {
    setActiveService(null);
    go('contact');
  };

  return (
    <div ref={shellRef} className="lp future-lp">
      <div className="future-lp__ambient" aria-hidden="true">
        <span className="future-lp__halo future-lp__halo--blue" />
        <span className="future-lp__halo future-lp__halo--aqua" />
        <span className="future-lp__halo future-lp__halo--violet" />
        <span className="future-lp__grid" />
      </div>
      <div ref={orbRef} className="future-cursor-glow" aria-hidden="true" />

      <header className="future-nav future-nav--static">
        <div className="future-shell future-nav__shell">
          <button type="button" className="future-brand" onClick={() => go('hero')}>
            <span className="future-brand__icon" aria-hidden="true">
              <span className="future-brand__dot" />
              <span className="future-brand__dot future-brand__dot--small" />
            </span>
            <span className="future-brand__copy">
              <strong>Сантех строй</strong>
              <span>Платформа сантехнических услуг</span>
            </span>
          </button>

          <nav className={`future-nav__links ${menuOpen ? 'future-nav__links--open' : ''}`}>
            {NAV_ITEMS.map(([label, id]) => (
              <button key={id} type="button" onClick={() => go(id)}>
                {label}
              </button>
            ))}
            <div className="future-nav__mobile">
              <a href="tel:+77054477555" className="future-nav__phone future-nav__phone--mobile">8 705 447 7555</a>
              <button type="button" className="future-btn future-btn--ghost future-btn--sm" onClick={() => go('contact')}>
                Контакты
              </button>
              <button type="button" className="future-btn future-btn--primary future-btn--sm" onClick={() => openRequest()}>
                Отправить заявку
              </button>
            </div>
          </nav>

          <div className="future-nav__actions">
            <a href="tel:+77054477555" className="future-nav__phone">8 705 447 7555</a>
            <button type="button" className="future-btn future-btn--ghost future-btn--sm" onClick={() => go('contact')}>
              Контакты
            </button>
            <button type="button" className="future-btn future-btn--primary future-btn--sm" onClick={() => openRequest()}>
              Отправить заявку
            </button>
          </div>

          <button
            type="button"
            className={`future-burger ${menuOpen ? 'future-burger--open' : ''}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Открыть меню"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section id="hero" className="future-hero">
          <div className="future-shell future-hero__grid">
            <div className="future-hero__content">
              <div className="future-kicker fu">
                <span className="future-kicker__pulse" />
                Realtime dispatch для бытовой сантехники
              </div>

              <h1 className="fu">
                Заказывайте сантехника
                <br />
                <span>как современный tech-продукт</span>
              </h1>

              <p className="fu">
                Сантех строй делает заказ сантехника прозрачным: пользователь видит услугу,
                ближайшую доступность, ETA, статус выезда и итог работ в одном интерфейсе.
                Это не витрина объявлений, а цифровая платформа, где можно быстро заказать сантехника.
              </p>

              <div className="future-hero__actions fu">
                <button type="button" className="future-btn future-btn--primary future-btn--lg" onClick={() => openRequest()}>
                  Отправить заявку
                </button>
                <button type="button" className="future-btn future-btn--ghost future-btn--lg" onClick={() => go('services')}>
                  Смотреть услуги
                </button>
              </div>

              <div className="future-metrics fu">
                {HERO_METRICS.map(([value, label]) => (
                  <div key={label} className="future-metric">
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="future-chip-row fu">
                {[
                  'Live ETA',
                  'Прозрачная стоимость',
                  'Цифровая гарантия',
                  'История работ в кабинете',
                ].map((item) => (
                  <span key={item} className="future-chip">{item}</span>
                ))}
              </div>
            </div>

            <div className="future-hero__scene fu">
              <article className="glass-panel future-scene future-scene--mission">
                <div className="future-panel__eyebrow">
                  <span className="future-panel__signal future-panel__signal--green" />
                  Активная заявка
                </div>

                <div className="future-mission__head">
                  <div>
                    <strong>Протечка под раковиной</strong>
                    <span>Алматы · Центр · квартира 37</span>
                  </div>
                  <span className="future-pill future-pill--accent">ETA 14 мин</span>
                </div>

                <div className="future-map">
                  <span className="future-map__glow future-map__glow--a" />
                  <span className="future-map__glow future-map__glow--b" />
                  <span className="future-map__line" />
                  <span className="future-map__point future-map__point--start" />
                  <span className="future-map__point future-map__point--end" />
                  <div className="future-map__card">
                    <span>Мастер</span>
                    <strong>AL-14 · Арман С.</strong>
                  </div>
                </div>

                <div className="future-route">
                  {[
                    ['Сигнал получен', 'Клиент подтвердил адрес и фото проблемы'],
                    ['Подобран сантехник', 'Ближайшая свободная бригада назначена автоматически'],
                    ['Выезд активен', 'Маршрут и статус обновляются в реальном времени'],
                  ].map(([title, text], index) => (
                    <div key={title} className={`future-route__item ${index < 2 ? 'future-route__item--done' : 'future-route__item--live'}`}>
                      <span className="future-route__dot" />
                      <div>
                        <strong>{title}</strong>
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="future-mission__foot">
                  <div>
                    <span>Сценарий</span>
                    <strong>Аварийный выезд</strong>
                  </div>
                  <div>
                    <span>Следующий статус</span>
                    <strong>Прибытие и диагностика</strong>
                  </div>
                </div>
              </article>

              <article className="glass-panel future-scene future-scene--capacity">
                <div className="future-panel__eyebrow">
                  <span className="future-panel__signal" />
                  Доступность услуг
                </div>
                {[
                  ['Аварийные заявки', 88],
                  ['Засоры и прочистка', 72],
                  ['Монтаж и установка', 61],
                ].map(([label, value]) => (
                  <div key={label} className="future-meter">
                    <div className="future-meter__row">
                      <span>{label}</span>
                      <strong>{value}%</strong>
                    </div>
                    <div className="future-meter__track">
                      <span style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </article>

              <article className="glass-panel future-scene future-scene--pulse">
                <div className="future-panel__eyebrow">
                  <span className="future-panel__signal future-panel__signal--violet" />
                  Доступность по районам
                </div>
                <div className="future-pulse-grid">
                  {['Центр', 'Левый берег', 'Север', 'Юг'].map((item, index) => (
                    <div key={item} className="future-pulse-grid__item">
                      <span className={`future-pulse-grid__node future-pulse-grid__node--${index + 1}`} />
                      <strong>{item}</strong>
                      <span>{index % 2 === 0 ? 'Высокая доступность' : 'ETA до 25 мин'}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="services" className="future-section">
          <div className="future-shell">
            <div className="future-section__head fu">
              <div className="future-kicker">
                <span className="future-kicker__pulse" />
                Сервисные сценарии
              </div>
              <h2>Услуги оформлены как продуктовые карточки, а не как скучный прайс</h2>
              <p>
                Каждая карточка сразу показывает, что можно заказать, сколько это обычно стоит,
                как быстро приедет сантехник и есть ли свободная бригада сейчас.
              </p>
            </div>

            <div className="future-service-grid">
              {SERVICE_LINES.map((service, index) => (
                <article key={service.code} className="glass-panel future-service-card fu" style={{ transitionDelay: `${index * 70}ms` }}>
                  <div className="future-service-card__top">
                    <span className="future-service-card__code">{service.code}</span>
                    <span className="future-pill">{service.eta}</span>
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>

                  <div className="future-service-card__meta">
                    <span>{service.availability}</span>
                    <span>{service.zone}</span>
                  </div>

                  <div className="future-service-card__foot">
                    <strong>{service.price}</strong>
                    <button type="button" onClick={() => setActiveService(service)}>
                      Подробнее
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="audience" className="future-section future-section--audience">
          <div className="future-shell">
            <div className="future-section__head fu">
              <div className="future-kicker">
                <span className="future-kicker__pulse" />
                Кому подойдут услуги
              </div>
              <h2>Сантехнические работы для квартир, домов и бизнеса в Алматы</h2>
              <p>
                Мы закрываем как срочные вызовы, так и плановый монтаж: от протечки под раковиной
                до разводки сантехники на этапе ремонта.
              </p>
            </div>

            <div className="future-audience-grid">
              {AUDIENCE.map((item, index) => (
                <article key={item.code} className="glass-panel future-audience-card fu" style={{ transitionDelay: `${index * 80}ms` }}>
                  <div className="future-audience-card__code">{item.code}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="future-audience-card__tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="dispatch" className="future-section future-section--deep">
          <div className="future-shell future-dispatch">
            <div className="future-dispatch__copy">
              <div className="future-kicker fu">
                <span className="future-kicker__pulse" />
                Доступность в реальном времени
              </div>
              <h2 className="fu">Пользователь чувствует контроль над вызовом сантехника</h2>
              <p className="fu">
                Вместо абстрактного обещания “мы вам перезвоним” платформа показывает,
                какие услуги доступны прямо сейчас, в каком районе есть свободные сантехники
                и с каким ETA можно рассчитывать на выезд.
              </p>

              <div className="future-value-list fu">
                {[
                  'Показываем реальную доступность услуг, а не декоративные баннеры.',
                  'ETA, район и загруженность видны до отправки заявки.',
                  'После submit пользователь не теряет контекст и видит следующие шаги.',
                  'История и гарантия остаются в кабинете как часть продукта.',
                ].map((item) => (
                  <div key={item} className="future-value-list__item">
                    <span className="future-value-list__mark" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="future-dispatch__board">
              <article className="glass-panel future-presence fu">
                <div className="future-panel__eyebrow">
                  <span className="future-panel__signal future-panel__signal--green" />
                  Живая карта покрытия
                </div>
                <div className="future-presence__canvas">
                  <span className="future-presence__wave future-presence__wave--a" />
                  <span className="future-presence__wave future-presence__wave--b" />
                  <span className="future-presence__node future-presence__node--1" />
                  <span className="future-presence__node future-presence__node--2" />
                  <span className="future-presence__node future-presence__node--3" />
                  <span className="future-presence__node future-presence__node--4" />
                  <div className="future-presence__overlay">
                    <strong>3 района с высокой доступностью</strong>
                    <span>Центр, Левый берег, Север</span>
                  </div>
                </div>
              </article>

              <div className="future-feed">
                {LIVE_FEED.map((item, index) => (
                  <article key={item.code} className="glass-panel future-feed-card fu" style={{ transitionDelay: `${index * 80}ms` }}>
                    <div className="future-feed-card__top">
                      <span className="future-feed-card__code">{item.code}</span>
                      <span className={`future-pill future-pill--${item.tone}`}>{item.status}</span>
                    </div>

                    <strong>{item.service}</strong>
                    <p>{item.district}</p>

                    <div className="future-feed-card__meter">
                      <span style={{ width: `${item.load}%` }} />
                    </div>

                    <div className="future-feed-card__foot">
                      <span>{item.eta}</span>
                      <span>Нагрузка {item.load}%</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="future-section">
          <div className="future-shell">
            <div className="future-section__head fu">
              <div className="future-kicker">
                <span className="future-kicker__pulse" />
                Trust signals
              </div>
              <h2>Пользователи чувствуют контроль над сервисом, а не хаос вокруг ремонта</h2>
              <p>
                Отзывы подтверждают главный UX-сдвиг: платформа делает вызов сантехника
                понятным, управляемым и спокойным на каждом этапе.
              </p>
            </div>

            <div className="future-review-grid">
              {REVIEWS.map((review, index) => (
                <article key={review.name} className="glass-panel future-review-card fu" style={{ transitionDelay: `${index * 80}ms` }}>
                  <div className="future-review-card__stars">★★★★★</div>
                  <p>«{review.text}»</p>
                  <div className="future-review-card__author">
                    <div className="future-review-card__avatar">{review.name[0]}</div>
                    <div>
                      <strong>{review.name}</strong>
                      <span>{review.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="future-section future-section--contact">
          <div className="future-shell future-contact">
            <article className="glass-panel future-cta fu">
              <div className="future-panel__eyebrow">
                <span className="future-panel__signal future-panel__signal--green" />
                Быстрый контакт
              </div>

              <h2>Нужен надежный сантехник?</h2>
              <p>
                Напишите мастеру, расскажите что случилось, и мы подскажем ближайшее время выезда
                по Алматы и примерную стоимость работ.
              </p>

              <div className="future-cta__actions">
                <a
                  href="https://wa.me/77054477555?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D0%BD%D1%83%D0%B6%D0%B5%D0%BD%20%D1%81%D0%B0%D0%BD%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA"
                  className="future-btn future-btn--primary future-btn--lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Написать мастеру
                </a>
                <a href="tel:+77054477555" className="future-btn future-btn--ghost future-btn--lg">
                  Позвонить
                </a>
              </div>

              <div className="future-cta__meta">
                <span>Алматы</span>
                <span>Ответ в среднем за 7 минут</span>
                <span>Выезд 24/7</span>
              </div>
            </article>

            <div className="future-contact__stack">
              <article className="glass-panel future-contact-card fu">
                <div className="future-panel__eyebrow">
                  <span className="future-panel__signal" />
                  Как начать
                </div>
                <div className="future-contact-flow">
                  {[
                    ['01', 'Нажмите “Написать мастеру” и коротко опишите проблему.'],
                    ['02', 'Мастер уточнит адрес, фото и срочность работ.'],
                    ['03', 'После подтверждения согласуем время выезда по Алматы.'],
                  ].map(([num, text]) => (
                    <div key={num} className="future-contact-flow__item">
                      <span>{num}</span>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="glass-panel future-contact-card fu">
                <div className="future-panel__eyebrow">
                  <span className="future-panel__signal future-panel__signal--violet" />
                  Контакты
                </div>
                <div className="future-contact-links">
                  <a href="tel:+77054477555">
                    <strong>Телефон</strong>
                    <span>8 705 447 7555</span>
                  </a>
                  <a href="mailto:info@santehstroy.kz">
                    <strong>Email</strong>
                    <span>info@santehstroy.kz</span>
                  </a>
                  <div>
                    <strong>Покрытие</strong>
                    <span>Алматы и ближайший пригород</span>
                  </div>
                  <div>
                    <strong>Ответ</strong>
                    <span>Подтверждение в среднем за 7 минут</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      {activeService && (
        <div className="future-modal" onClick={() => setActiveService(null)} role="presentation">
          <div
            className="glass-panel future-modal__dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-dialog-title"
          >
            <button
              type="button"
              className="future-modal__close"
              onClick={() => setActiveService(null)}
              aria-label="Закрыть окно"
            >
              ×
            </button>

            <div className="future-panel__eyebrow">
              <span className="future-panel__signal" />
              Сценарий услуги
            </div>

            <div className="future-modal__head">
              <div className="future-service-card__code future-service-card__code--lg">{activeService.code}</div>
              <div>
                <h3 id="service-dialog-title">{activeService.title}</h3>
                <p>{activeService.summary}</p>
              </div>
            </div>

            <div className="future-modal__meta">
              <span className="future-pill">{activeService.eta}</span>
              <span className="future-pill future-pill--ready">{activeService.availability}</span>
              <span className="future-pill">{activeService.price}</span>
            </div>

            <div className="future-modal__list">
              {activeService.bullets.map((item) => (
                <div key={item} className="future-value-list__item">
                  <span className="future-value-list__mark" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="future-modal__actions">
              <button type="button" className="future-btn future-btn--primary" onClick={() => openRequest(activeService.title)}>
                Написать мастеру
              </button>
              <button type="button" className="future-btn future-btn--ghost" onClick={() => setActiveService(null)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="future-footer">
        <div className="future-shell future-footer__inner">
          <button type="button" className="future-brand future-brand--footer" onClick={() => go('hero')}>
            <span className="future-brand__icon" aria-hidden="true">
              <span className="future-brand__dot" />
              <span className="future-brand__dot future-brand__dot--small" />
            </span>
            <span className="future-brand__copy">
              <strong>Сантех строй</strong>
              <span>Платформа заказа сантехников</span>
            </span>
          </button>

          <p>© 2026 Сантех строй. Цифровая платформа, где можно быстро заказать сантехника и отслеживать весь процесс.</p>

          <div className="future-footer__nav">
            {NAV_ITEMS.map(([label, id]) => (
              <button key={id} type="button" onClick={() => go(id)}>{label}</button>
            ))}
          </div>
        </div>
      </footer>

      <button type="button" className="future-fab" onClick={() => openRequest('Устранение протечек')}>
        <span className="future-fab__dot" />
        <span className="future-fab__label">Срочно</span>
        <strong>Написать мастеру</strong>
      </button>
    </div>
  );
};

export default Landing;
