
import { GameState } from "../types";

// Usamos una API pública de KV storage para prototipado rápido de multijugador
const API_BASE = "https://api.keyvalue.xyz";
const APP_PREFIX = "f1_tycoon_v4_";

export async function createRoom(): Promise<string> {
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const initialData = { status: 'waiting', players: 1 };
  
  // En un entorno real, usaríamos WebSockets, aquí simulamos con un endpoint único
  await fetch(`${API_BASE}/new`, {
    method: 'POST',
    body: JSON.stringify(initialData)
  });
  
  // Retornamos un código que el usuario usará. 
  // Para simplificar esta demo, usaremos el código como parte del ID de la clave.
  return roomCode;
}

export async function syncGameState(roomCode: string, state: any) {
  try {
    const key = `${APP_PREFIX}${roomCode}`;
    await fetch(`${API_BASE}/${key}`, {
      method: 'POST',
      body: JSON.stringify(state)
    });
  } catch (e) {
    console.error("Sync error", e);
  }
}

export async function fetchGameState(roomCode: string): Promise<any> {
  try {
    const key = `${APP_PREFIX}${roomCode}`;
    const res = await fetch(`${API_BASE}/${key}`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (e) {
    return null;
  }
}
