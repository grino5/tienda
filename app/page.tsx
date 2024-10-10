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
    <main style={{ padding: '15px', fontFamily: 'Arial, sans-serif', color: '#ffffff', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h1 style={{ fontSize: '1.5em' }}>Tienda</h1>
        <div style={{ backgroundColor: '#2a2a2a', padding: '10px', borderRadius: '10px' }}>
          💬 {creditos} mensajes disponibles
        </div>
      </div>

      <div style={{ backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
        <img src="/static/logo-gratis.png" alt="Mensajes gratis" style={{ width: '50px', marginRight: '10px', float: 'left' }} />
        <div>
          <strong>Mensajes gratis</strong>
          <p>Agrega 3 amigos y obtén 10 mensajes gratis.</p>
          <p>Has invitado a {invitaciones}.</p>
          {invitaciones < 3 ? (
            <button onClick={copiarLink} style={{ padding: '10px', backgroundColor: '#5183c8', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
              {linkCopiado ? "Link copiado" : "Copiar link de invitación"}
            </button>
          ) : (
            <button style={{ padding: '10px', backgroundColor: '#888', color: '#fff', border: 'none', borderRadius: '5px', width: '100%' }} disabled>
              Ya has reclamado esta recompensa
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '15px', marginBottom: '15px' }}>
        <form action="/create-checkout-session" method="POST" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '10px' }}>
          <input type="hidden" name="plan" value="basico" />
          <img src="/static/paquete-115-mensajes.png" alt="Paquete de 20 mensajes" style={{ maxWidth: '100px', marginBottom: '10px' }} />
          <div><strong>20 Mensajes</strong> + fotos sexys</div>
          <div style={{ color: '#fff', marginTop: '5px' }}>3.00 USD</div>
        </form>

        <form action="/create-checkout-session" method="POST" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '10px' }}>
          <input type="hidden" name="plan" value="premium" />
          <img src="/static/premium.png" alt="Mensajes infinitos" style={{ maxWidth: '100px', marginBottom: '10px' }} />
          <div><strong>Mensajes infinitos</strong> + fotos xxx</div>
          <div style={{ color: '#fff', marginTop: '5px' }}>52.00 USD/mes</div>
        </form>

        <form action="/create-checkout-session" method="POST" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '10px' }}>
          <input type="hidden" name="plan" value="popular" />
          <img src="/static/paquete-115-mensajes.png" alt="Paquete de 100 mensajes" style={{ maxWidth: '100px', marginBottom: '10px' }} />
          <div><strong>100 Mensajes</strong> + fotos sexys</div>
          <div style={{ color: '#fff', marginTop: '5px' }}>12.00 USD</div>
        </form>
      </div>

      <div style={{ textAlign: 'center', color: '#888' }}>Ⓘ Todos los pagos son anónimos y seguros.</div>
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
