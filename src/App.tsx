import { useEffect, useState } from "react";
import {
  BarChart3,
  Bot,
  CreditCard,
  GitBranch,
  MessageSquare,
  Sparkles,
  Crown,
  ArrowRight,
  CheckCircle2,
  Wand2,
  Plus,
  Menu,
} from "lucide-react";

type Page = "generator" | "analyzer" | "funnel" | "consultant" | "tariffs" | "payment";

function App() {
  const [page, setPage] = useState<Page>("generator");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("Лидогенерация через Direct");
  const [style, setStyle] = useState("Премиальный");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, []);

  const generate = async (mode: "ad" | "offer" | "funnel" | "consultant" = "ad") => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, audience, goal, style, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ошибка");
      setResult(data.text);
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Не удалось получить ответ");
    } finally {
      setLoading(false);
    }
  };

  const nav = [
    { id: "generator" as Page, label: "Генератор Связок", icon: Wand2 },
    { id: "analyzer" as Page, label: "Анализатор Офферов", icon: BarChart3 },
    { id: "funnel" as Page, label: "Шаблоны Воронок", icon: GitBranch },
    { id: "consultant" as Page, label: "AI Таргетолог Консультант", icon: MessageSquare },
    { id: "tariffs" as Page, label: "Тарифы", icon: Crown },
    { id: "payment" as Page, label: "Оплата", icon: CreditCard },
  ];

  return (
    <div className="shell">
      <header className="top">
        <div className="brandWrap">
          <div className="logo"><Bot size={25} /></div>
          <div>
            <div className="brand">AI Targetologist <span>PRO v2.5</span></div>
            <div className="subbrand">Платформа генерации высококонверсионных связок</div>
          </div>
        </div>

        <div className="statusBar">
          <div><Crown size={15}/> ТАРИФ: <strong>FREE TRIAL</strong></div>
          <i/>
          <div>✦ 3/3</div><div>▥ 3/3</div><div>⚯ 3/3</div><div>▱ 3/3</div>
          <button onClick={() => setPage("tariffs")}>Up</button>
        </div>

        <button className="menuBtn" onClick={() => setMobileOpen(!mobileOpen)}><Menu/></button>
      </header>

      <div className={`nav ${mobileOpen ? "open" : ""}`}>
        {nav.map(({id,label,icon:Icon}) => (
          <button key={id} className={page === id ? "active" : ""} onClick={() => { setPage(id); setMobileOpen(false); }}>
            <Icon size={16}/>{label}
          </button>
        ))}
      </div>

      {page === "generator" && (
        <main className="twoCol">
          <section className="panel formPanel">
            <div className="titleRow"><Sparkles/><div><h2>Параметры Связки</h2><p>Соберите кампанию под конкретную нишу и цель.</p></div></div>

            <label>Быстрые Пресеты Ниш:</label>
            <div className="chips">
              {["🍕 Еда / Общепит","💅 Бьюти Сфера","🎓 Обучение / Онлайн","🏢 Недвижимость"].map((x) =>
                <button key={x} onClick={() => setProduct(x.replace(/^.\s/,""))}>{x}</button>
              )}
            </div>

            <label>Ниша / Бизнес *</label>
            <input value={product} onChange={e=>setProduct(e.target.value)} placeholder="Например: Студия йоги"/>

            <label>Целевая Аудитория</label>
            <input value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Девушки 25-40, офисные сотрудники..."/>

            <label>Продукт / Оффер *</label>
            <input placeholder="Пробное занятие за 1000 ₸"/>

            <label>Цель</label>
            <select value={goal} onChange={e=>setGoal(e.target.value)}>
              <option>Лидогенерация через Direct</option>
              <option>Продажа продукта</option>
              <option>Подписчики</option>
              <option>Узнаваемость</option>
            </select>

            <label>Стиль</label>
            <select value={style} onChange={e=>setStyle(e.target.value)}>
              <option>Премиальный</option><option>Экспертный</option><option>Дерзкий</option><option>Дружелюбный</option>
            </select>

            <button className="gradientBtn" onClick={() => generate("ad")} disabled={loading}>
              <Sparkles size={18}/>{loading ? "Генерируем..." : "Сгенерировать связку"}<ArrowRight size={18}/>
            </button>
          </section>

          <section className="panel resultPanel">
            {result ? (
              <div className="resultCard"><CheckCircle2/><h3>Готовый результат</h3><pre>{result}</pre></div>
            ) : (
              <div className="emptyState">
                <div className="emptyIcon"><Sparkles/></div>
                <h3>Связки ещё не сгенерированы</h3>
                <p>Заполните форму слева и нажмите «Сгенерировать», чтобы получить готовые креативы с хуками и текстами.</p>
              </div>
            )}
          </section>
        </main>
      )}

      {page === "analyzer" && (
        <main className="single panel centered">
          <div className="titleRow"><BarChart3/><div><h2>Анализатор Офферов</h2><p>Вставьте текущий оффер и получите разбор.</p></div></div>
          <textarea placeholder="Вставьте оффер, лендинг или рекламный текст..."/>
          <button className="gradientBtn" onClick={() => generate("offer")}><Sparkles size={18}/>Проанализировать оффер</button>
          {result && <div className="resultCard"><pre>{result}</pre></div>}
        </main>
      )}

      {page === "funnel" && (
        <main className="single panel centered">
          <div className="titleRow"><GitBranch/><div><h2>Генератор Автоворонок</h2><p>Создайте пошаговую архитектуру пути клиента от первого клика до оплаты.</p></div></div>
          <label>Ниша бизнеса *</label>
          <input value={product} onChange={e=>setProduct(e.target.value)} placeholder="Например: Фитнес-клуб / Онлайн-школа"/>
          <label>Цель воронки</label>
          <select value={goal} onChange={e=>setGoal(e.target.value)}>
            <option>Лидогенерация через Direct</option><option>Продажа продукта</option><option>Запись на консультацию</option>
          </select>
          <button className="gradientBtn" onClick={() => generate("funnel")}><GitBranch size={18}/>Сгенерировать архитектуру воронки</button>
          {result && <div className="resultCard"><pre>{result}</pre></div>}
        </main>
      )}

      {page === "consultant" && (
        <main className="single panel centered">
          <div className="titleRow"><MessageSquare/><div><h2>AI Таргетолог Консультант</h2><p>Практический план действий для вашей рекламы.</p></div></div>
          <input value={product} onChange={e=>setProduct(e.target.value)} placeholder="Ниша / бизнес"/>
          <input value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Целевая аудитория"/>
          <button className="gradientBtn" onClick={() => generate("consultant")}><MessageSquare size={18}/>Получить консультацию</button>
          {result && <div className="resultCard"><pre>{result}</pre></div>}
        </main>
      )}

      {page === "tariffs" && (
        <main className="pricing">
          <h1>Выберите тариф для вашего масштаба</h1>
          <p>Получите мгновенный доступ к генерации связок и прокачайте ваш ROI в рекламе</p>
          <div className="cards3">
            <Plan name="Free Trial" price="$0" tag="СТАРТ" items={["3 генерации связок","3 анализа офферов","3 генерации воронок","3 сообщения в чат ИИ"]} current />
            <Plan name="Standard Pro" price="$14.9" tag="ДЛЯ ТАРГЕТОЛОГОВ" items={["100 генераций связок / офферов / воронок","Безлимитный AI Таргетолог Консультант","Доступ ко всем пресетам ниш","Приоритетная скорость ИИ"]} hot onClick={()=>setPage("payment")} />
            <Plan name="Agency VIP" price="$39.9" tag="ДЛЯ КОМАНД И АГЕНТСТВ" items={["БЕЗЛИМИТНЫЕ генерации","Все инструменты и модули","VIP Поддержка и персональный менеджер","Ранний доступ к новым функциям"]} vip onClick={()=>setPage("payment")} />
          </div>
        </main>
      )}

      {page === "payment" && (
        <main className="single panel payment">
          <div className="titleRow"><CreditCard/><div><h2>Оформление Подписки</h2><p>Выберите удобный способ оплаты для вашего региона</p></div></div>
          <div className="priceRow"><div><small>Выбранный тариф:</small><strong>Standard Pro</strong></div><b>7 100 ₸</b></div>
          <div className="payBox"><h3>Kaspi Pay</h3><p>Оплата через официальную платежную ссылку Kaspi</p><a className="payBtn" href="https://pay.kaspi.kz/pay/6hpgsuja" target="_blank" rel="noopener noreferrer">Оплатить 7 100 ₸ в Kaspi Pay <ArrowRight size={16}/></a></div>
          <div className="payBox"><h3>Прямой перевод Kaspi Gold</h3><div className="details"><span>Номер телефона:</span><b>укажите реквизиты</b><span>Получатель:</span><b>ваша компания</b><span>Сумма к переводу:</span><b>7 100 ₸</b></div></div>
        </main>
      )}

      <footer>AI Targetologist Pro <span>•</span> Ваша рекламная команда на базе AI</footer>
    </div>
  );
}

function Plan({name, price, tag, items, current, hot, vip, onClick}:{name:string;price:string;tag:string;items:string[];current?:boolean;hot?:boolean;vip?:boolean;onClick?:()=>void}) {
  return <div className={`plan ${hot ? "hot":""} ${vip ? "vip":""}`}>
    {hot && <div className="badge">ХИТ ПРОДАЖ</div>}
    <div className="planTag">{tag}</div>
    <h3>{name}</h3>
    <div className="price">{price} <small>{price==="$0" ? "навсегда" : "/ месяц"}</small></div>
    <ul>{items.map(x=><li key={x}><CheckCircle2 size={16}/>{x}</li>)}</ul>
    <button disabled={current} onClick={onClick}>{current ? "Ваш текущий тариф":"Выбрать "+name}</button>
  </div>
}

export default App;
