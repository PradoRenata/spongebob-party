'use client'
import { useEffect, useState, useRef } from 'react'
import { AppData, Guest, PartyInfo, CHARACTERS } from '@/lib/types'
import styles from './admin.module.css'

function genId() { return 'g' + Date.now() + Math.random().toString(36).slice(2, 6) }

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [data, setData] = useState<AppData>({ party: { fecha: '', hora: '', lugar: '', mensaje: '' }, guests: [] })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [charModalGuest, setCharModalGuest] = useState<string | null>(null)
  const [localImages, setLocalImages] = useState<Record<string, string>>({})
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const tryLogin = async () => {
    const res = await fetch('/api/party', { headers: { 'x-admin-password': password } })
    if (res.status === 401) { setAuthError('Contraseña incorrecta'); return }
    const json = await res.json()
    setData(json)
    setAuthed(true)
  }

  const save = async () => {
    setSaving(true)
    const uploadedUrls: Record<string, string> = {}
    for (const [guestId, b64] of Object.entries(localImages)) {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ guestId, imageBase64: b64 }),
      })
      const json = await res.json()
      if (json.url) uploadedUrls[guestId] = json.url
    }
    const updatedGuests = data.guests.map(g => ({
      ...g,
      imageUrl: uploadedUrls[g.id] ?? g.imageUrl,
    }))
    const payload: AppData = { ...data, guests: updatedGuests }
    await fetch('/api/party', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(payload),
    })
    setData(payload)
    setLocalImages({})
    setSaving(false)
    showToast('Guardado correctamente')
  }

  const updateParty = (field: keyof PartyInfo, val: string) =>
    setData(d => ({ ...d, party: { ...d.party, [field]: val } }))

  const addGuest = () =>
    setData(d => ({ ...d, guests: [...d.guests, { id: genId(), name: '', charId: null, imageUrl: null }] }))

  const removeGuest = (id: string) =>
    setData(d => ({ ...d, guests: d.guests.filter(g => g.id !== id) }))

  const updateGuest = (id: string, patch: Partial<Guest>) =>
    setData(d => ({ ...d, guests: d.guests.map(g => g.id === id ? { ...g, ...patch } : g) }))

  const handleImg = (guestId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = ev => {
      const b64 = ev.target?.result as string
      setLocalImages(prev => ({ ...prev, [guestId]: b64 }))
    }
    reader.readAsDataURL(f)
  }

  const assignedChars = data.guests.map(g => g.charId).filter(Boolean) as string[]

  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <h1>Panel de administración</h1>
          <p className={styles.loginSub}>Ingresa la contraseña de admin para continuar</p>
          <div className={styles.field}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && tryLogin()}
              autoFocus
            />
          </div>
          {authError && <p className={styles.error}>{authError}</p>}
          <button className="primary" style={{ width: '100%' }} onClick={tryLogin}>Entrar</button>
          <a href="/" className={styles.backLink}>← Ver página de invitados</a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="container">
        <div className="page-header">
          <h1>Panel de admin</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="/" target="_blank" className={styles.viewLink}>ver página pública ↗</a>
            <button className="primary" onClick={save} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <p className="section-label">Datos de la fiesta</p>
          <div className="grid-2">
            <div className="field">
              <label>Fecha</label>
              <input value={data.party.fecha} onChange={e => updateParty('fecha', e.target.value)} placeholder="ej. Sábado 12 de julio" />
            </div>
            <div className="field">
              <label>Hora</label>
              <input value={data.party.hora} onChange={e => updateParty('hora', e.target.value)} placeholder="ej. 19:00 hrs" />
            </div>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label>Lugar</label>
              <input value={data.party.lugar} onChange={e => updateParty('lugar', e.target.value)} placeholder="ej. Av. Costanera 123, Santiago" />
            </div>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label>Mensaje para los invitados</label>
              <input value={data.party.mensaje} onChange={e => updateParty('mensaje', e.target.value)} placeholder="ej. ¡Ven disfrazado/a de tu personaje!" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
          <p className="section-label" style={{ margin: 0 }}>Invitados ({data.guests.length})</p>
          <button onClick={addGuest}>+ agregar invitado</button>
        </div>

        <div className={styles.guestGrid}>
          {data.guests.map(g => {
            const char = CHARACTERS.find(c => c.id === g.charId)
            const previewImg = localImages[g.id] ?? g.imageUrl
            return (
              <div key={g.id} className={styles.guestCard}>
                <div className={styles.imgArea} onClick={() => fileRefs.current[g.id]?.click()}>
                  {previewImg
                    ? <img src={previewImg} alt="personaje" />
                    : <div className={styles.uploadHint}><span>📷</span><span>subir foto</span></div>
                  }
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={el => { fileRefs.current[g.id] = el }}
                    onChange={e => handleImg(g.id, e)}
                  />
                </div>
                <div className={styles.cardBody}>
                  <input
                    placeholder="Nombre del invitado"
                    value={g.name}
                    onChange={e => updateGuest(g.id, { name: e.target.value })}
                    className={styles.nameInput}
                  />
                  <button className={styles.charBtn} onClick={() => setCharModalGuest(g.id)}>
                    {char ? `${char.emoji} ${char.name}` : '+ asignar personaje'}
                  </button>
                  <button className={`${styles.delBtn} danger`} onClick={() => removeGuest(g.id)}>✕</button>
                </div>
              </div>
            )
          })}
          <div className={styles.addCard} onClick={addGuest}>
            <span>+</span>
            <span>agregar invitado</span>
          </div>
        </div>
      </div>

      {charModalGuest && (
        <div className={styles.modalOverlay} onClick={() => setCharModalGuest(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Elige un personaje</h2>
              <button onClick={() => setCharModalGuest(null)}>✕</button>
            </div>
            <div className={styles.charList}>
              {CHARACTERS.map(c => {
                const taken = assignedChars.includes(c.id) && data.guests.find(g => g.id === charModalGuest)?.charId !== c.id
                const selected = data.guests.find(g => g.id === charModalGuest)?.charId === c.id
                return (
                  <button
                    key={c.id}
                    className={`${styles.charOpt} ${selected ? styles.charSelected : ''} ${taken ? styles.charTaken : ''}`}
                    disabled={taken}
                    onClick={() => { updateGuest(charModalGuest, { charId: c.id }); setCharModalGuest(null) }}
                  >
                    <span className={styles.charEmoji}>{c.emoji}</span>
                    <span>{c.name}</span>
                    {taken && <span className={styles.takenBadge}>asignado</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
