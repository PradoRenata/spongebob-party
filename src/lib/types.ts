export interface Guest {
  id: string
  name: string
  charId: string | null
  imageUrl: string | null
}

export interface PartyInfo {
  fecha: string
  hora: string
  lugar: string
  mensaje: string
}

export interface AppData {
  party: PartyInfo
  guests: Guest[]
}

export const CHARACTERS = [
  { id: 'spongebob', emoji: '🧽', name: 'Bob Esponja' },
  { id: 'patrick', emoji: '⭐', name: 'Patricio Estrella' },
  { id: 'squidward', emoji: '🎨', name: 'Calamardo Tentáculos' },
  { id: 'sandy', emoji: '🐿️', name: 'Sandy Mejillas' },
  { id: 'gary', emoji: '🐌', name: 'Gary el Caracol' },
  { id: 'krabs', emoji: '🦀', name: 'Sr. Cangrejo' },
  { id: 'plankton', emoji: '🦠', name: 'Plankton' },
  { id: 'pearl', emoji: '🐋', name: 'Perla' },
  { id: 'larry', emoji: '💪', name: 'Larry la Langosta' },
  { id: 'mrs_puff', emoji: '🐡', name: 'Sra. Puff' },
  { id: 'mermaid', emoji: '🦸', name: 'Hombre Mermaid' },
  { id: 'barnacle', emoji: '👴', name: 'Chico Percebe' },
  { id: 'dutchman', emoji: '👻', name: 'Holandés Errante' },
  { id: 'squilliam', emoji: '🎭', name: 'Squilliam' },
  { id: 'neptune', emoji: '🔱', name: 'Rey Neptuno' },
  { id: 'bubble', emoji: '🫧', name: 'La Burbuja' },
  { id: 'jelly', emoji: '🪼', name: 'Medusa' },
  { id: 'doodle', emoji: '✏️', name: 'Bobesponja Garabato' },
  { id: 'anchor', emoji: '⚓', name: 'Capitán de Ancla' },
  { id: 'narrator', emoji: '🔊', name: 'El Narrador' },
  { id: 'fish1', emoji: '🐟', name: 'Habitante de Bikini' },
  { id: 'krabby', emoji: '🍔', name: 'Hamburguesa Cangrejo' },
  { id: 'robot', emoji: '🤖', name: 'Sandy Científica' },
  { id: 'mailman', emoji: '📬', name: 'Cartero de Bikini' },
  { id: 'chip', emoji: '🖌️', name: 'Artista del Fondo' },
]
