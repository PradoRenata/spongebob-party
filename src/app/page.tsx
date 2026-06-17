'use client'
import { useEffect, useState, useCallback } from 'react'
import { AppData, Guest } from '@/lib/types'
import { CHARACTERS } from '@/lib/types'
import styles from './page.module.css'

export default function Home() {
  const [data, setData] = useState<AppData | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Guest[]>([])
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    fetch('/api/party').then(r => r.json()).then(setData)
  }, [])

  const search = useCallback(() => {
    if (!data || !query.trim()) return
    const q = query.trim().toLowerCase()
    const found = data.guests.filter(g => g.name.toLowerCase().includes(q))
    setResults(found)
    setSearched(true)
  }, [data, query])

  useEffect(() => {
    if (query.trim()) search()
    else { setResults([]); setSearched(false) }
  }, [query, search])

  const party = data?.party

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.bubbles}>
          {['🧽','⭐','🦀','🐌','🐿️','🎨'].map((e,i) => (
            <span key={i} className={styles.bubble} style={{ '--i': i } as React.CSSProperties}>{e}</span>
          ))}
        </div>
        <h1 className={styles.title}>¿Cuál es tu personaje?</h1>
        {party && (party.fecha || party.lugar) && (
          <div className={styles.partyInfo}>
            {party.fecha && <span>📅 {party.fecha}{party.hora ? ` · ${party.hora}` : ''}</span>}
            {party.lugar && <span>📍 {party.lugar}</span>}
          </div>
        )}
        {party?.mensaje && <p className={styles.mensaje}>{party.mensaje}</p>}
      </div>

      <div className={styles.searchWrap}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Escribe tu nombre..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </div>

      <div className={styles.container}>
        {!searched && !query && (
          <p className={styles.hint}>Busca tu nombre para descubrir a qué personaje vas a representar</p>
        )}

        {searched && results.length === 0 && (
          <div className={styles.empty}>
            <span>🤔</span>
            <p>No encontramos a <strong>{query}</strong> en la lista</p>
            <p className={styles.emptyHint}>Intenta con otro nombre o consulta con quien organiza la fiesta</p>
          </div>
        )}

        <div className={styles.resultsGrid}>
          {results.map(g => {
            const char = CHARACTERS.find(c => c.id === g.charId)
            return (
              <div key={g.id} className={styles.resultCard}>
                <div className={styles.cardImg}>
                  {g.imageUrl
                    ? <img src={g.imageUrl} alt={char?.name ?? 'personaje'} />
                    : <span className={styles.fallbackEmoji}>{char?.emoji ?? '🎭'}</span>
                  }
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.guestName}>{g.name}</p>
                  <p className={styles.charName}>
                    {char ? `${char.emoji} ${char.name}` : 'Personaje por confirmar'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
