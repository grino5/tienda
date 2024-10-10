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
      fetch(`/api/obtener-datos?user_id=${WebApp.initDataUnsafe.user.id}`)
        .then(res => res.json())
        .then(data => {
          setCreditos(data.creditos);
          setInvitaciones(data.invitaciones);
        });
    }

    // Deshabilitar el zoom
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', (e) => e.preventDefault());
      document.removeEventListener('dragstart', (e) => e.preventDefault());
    };
  }, []);

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
      e.preventDefault();
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

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
    <main style={styles.main}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tienda</h1>
        <div style={styles.creditos}>
          💬 {creditos} mensajes disponibles
        </div>
      </div>

      <div style={styles.messageBox}>
        <img src="/static/logo-gratis.png" alt="Mensajes gratis" style={styles.image} />
        <div>
          <strong>Mensajes gratis</strong>
          <p>Agrega 3 amigos y obtén 10 mensajes gratis.</p>
          <p>Has invitado a {invitaciones}.</p>
          {invitaciones < 3 ? (
            <button onClick={copiarLink} style={styles.button}>
              {linkCopiado ? "Link copiado" : "Copiar link de invitación"}
            </button>
          ) : (
            <button style={styles.buttonDisabled} disabled>
              Ya has reclamado esta recompensa
            </button>
          )}
        </div>
      </div>

      <div style={styles.gridContainer}>
        <form action="/create-checkout-session" method="POST" style={styles.card}>
          <input type="hidden" name="plan" value="basico" />
          <img src="/static/paquete-115-mensajes.png" alt="Paquete de 20 mensajes" style={styles.cardImage} />
          <div><strong>20 Mensajes</strong> + fotos sexys</div>
          <div style={styles.price}>3.00 USD</div>
        </form>

        <form action="/create-checkout-session" method="POST" style={styles.card}>
          <input type="hidden" name="plan" value="premium" />
          <img src="/static/premium.png" alt="Mensajes infinitos" style={styles.cardImage} />
          <div><strong>Mensajes infinitos</strong> + fotos xxx</div>
          <div style={styles.price}>52.00 USD/mes</div>
        </form>

        <form action="/create-checkout-session" method="POST" style={styles.card}>
          <input type="hidden" name="plan" value="popular" />
          <img src="/static/paquete-115-mensajes.png" alt="Paquete de 100 mensajes" style={styles.cardImage} />
          <div><strong>100 Mensajes</strong> + fotos sexys</div>
          <div style={styles.price}>12.00 USD</div>
        </form>
      </div>

      <div style={styles.footer}>Ⓘ Todos los pagos son anónimos y seguros.</div>
    </main>
  );
}

const styles = {
  main: {
    padding: '15px',
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff',
    backgroundColor: '#1a1a1a',
    height: '100vh',  // Mantener el tamaño del contenedor al 100% del viewport
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    touchAction: 'none',  // Prevenir zoom
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  title: {
    fontSize: '1.5em',
  },
  creditos: {
    backgroundColor: '#2a2a2a',
    padding: '10px',
    borderRadius: '10px',
  },
  messageBox: {
    backgroundColor: '#2a2a2a',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  image: {
    width: '50px',
    marginRight: '10px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#5183c8',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  buttonDisabled: {
    padding: '10px',
    backgroundColor: '#888',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    width: '100%',
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    marginBottom: '15px',
  },
  card: {
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#2a2a2a',
    borderRadius: '10px',
    flex: '1',
    minWidth: '0',  // Forzar tamaño proporcional
  },
  cardImage: {
    maxWidth: '100px',
    marginBottom: '10px',
  },
  price: {
    color: '#fff',
    marginTop: '5px',
  },
  footer: {
    textAlign: 'center',
    color: '#888',
    marginTop: '20px',
  }
};
