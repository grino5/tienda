'use client'

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

// Interfaz para los datos de usuario obtenidos desde Telegram WebApp
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

// Componente principal
export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [creditos, setCreditos] = useState<number>(0);
  const [invitaciones, setInvitaciones] = useState<number>(0);
  const [linkCopiado, setLinkCopiado] = useState<boolean>(false);

  useEffect(() => {
    WebApp.ready();

    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);

      // Simular la obtención de créditos e invitaciones
      // Aquí llamas a tu API para obtener créditos e invitaciones del usuario
      fetch(`/api/obtener-datos?user_id=${WebApp.initDataUnsafe.user.id}`)
        .then(res => res.json())
        .then(data => {
          setCreditos(data.creditos);
          setInvitaciones(data.invitaciones);
        });
    }
  }, []);

  // Manejar copia de enlace de invitación
  const copiarLink = () => {
    if (userData) {
      const link = `https://t.me/VanneChatBot?start=${userData.id}`;
      navigator.clipboard.writeText(link).then(() => {
        setLinkCopiado(true);
        alert("Link copiado al portapapeles...");
      }).catch(() => {
        alert("Error al copiar el link...");
      });
    }
  };

  return (
    <main className="p-4">
      <div className="header">
        <h1 style={{ fontSize: '1.2em' }}>Tienda</h1>
        <div className="currency">
          💬 {creditos} mensajes disponibles
        </div>
      </div>

      <div className="message-box">
        <img src="/static/logo-gratis.png" alt="Mensajes gratis" className="premium-image" />
        <div className="message-content">
          <div className="message-title">Mensajes gratis</div>
          <div className="message-description">
            Agrega 3 amigos y obtén 10 mensajes gratis.
            <div className="divider"></div>
            Has invitado a {invitaciones}.
          </div>
          {invitaciones < 3 ? (
            <button className="premium-button" onClick={copiarLink}>
              {linkCopiado ? "Link copiado" : "Copiar link de invitación"}
            </button>
          ) : (
            <button className="premium-button" disabled>
              Ya has reclamado esta recompensa
            </button>
          )}
        </div>
      </div>

      <div className="message-grid">
        {/* Planes de pago */}
        <form action="/create-checkout-session" method="POST">
          <input type="hidden" name="plan" value="basico" />
          <div className="message-item basico-package" onClick={() => handleCheckout("basico")}>
            <span className="label">Básico</span>
            <img src="/static/paquete-115-mensajes.png" alt="Paquete de 20 mensajes" />
            <div className="message-amount">20 Mensajes<br />+<br />fotos sexys</div>
            <div className="message-price basico">3.00<br />USD</div>
          </div>
        </form>
        <form action="/create-checkout-session" method="POST">
          <input type="hidden" name="plan" value="premium" />
          <div className="message-item premium-package" onClick={() => handleCheckout("premium")}>
            <span className="label">Premium</span>
            <img src="/static/premium.png" alt="Mensajes infinitos" />
            <div className="message-amount">Mensajes infinitos<br />+<br />fotos xxx</div>
            <div className="message-price premium">52.00<br />USD/mes</div>
          </div>
        </form>
        <form action="/create-checkout-session" method="POST">
          <input type="hidden" name="plan" value="popular" />
          <div className="message-item popular-package" onClick={() => handleCheckout("popular")}>
            <span className="label">Popular</span>
            <img src="/static/paquete-115-mensajes.png" alt="Paquete de 100 mensajes" />
            <div className="message-amount">100 Mensajes<br />+<br />fotos sexys</div>
            <div className="message-price popular">12.00<br />USD</div>
          </div>
        </form>
      </div>

      <div className="info-message">
        Ⓘ Todos los pagos son anónimos y seguros.
      </div>
    </main>
  );

  function handleCheckout(plan: string) {
    fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, user_id: userData?.id })
    })
      .then(res => res.json())
      .then(data => {
        window.location.href = data.url;
      });
  }
}
