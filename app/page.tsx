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

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Inicializa WebApp
    WebApp.ready();

    // Verifica si hay datos de usuario disponibles
    if (WebApp.initDataUnsafe.user) {
      const user = WebApp.initDataUnsafe.user as UserData;
      setUserData(user);

      // Redireccionar con el ID del usuario en la URL
      const newUrl = `https://conectachicas.store/?user_id=${user.id}`;
      window.location.href = newUrl;
    }
  }, []);

  return (
    <main className="p-4">
      <div></div>
    </main>
  );
}
