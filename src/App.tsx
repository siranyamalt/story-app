import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════
   ICE CREAM THEMES
══════════════════════════════════════════ */
type IceCreamTheme = {
  id: string;
  name: string;
  emoji: string;
  bgFrom: string;
  bgMid: string;
  bgTo: string;
  primary: string;
  primaryLight: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  ink: string;
  inkSoft: string;
  glass: string;
  glassBorder: string;
  tabActive: string;
  palette: string[];
  blob1: string;
  blob2: string;
  blob3: string;
  shimmerFrom: string;
  shimmerTo: string;
  isRainbow?: boolean;
};

const THEMES: IceCreamTheme[] = [
  {
    id: "strawberry",
    name: "Strawberry",
    emoji: "🍓",
    bgFrom: "#FFD8D0", bgMid: "#FFB3BA", bgTo: "#FF9AA2",
    primary: "#E91E63", primaryLight: "#FF6B81", primarySoft: "rgba(233,30,99,0.13)",
    accent: "#FF9800", accentSoft: "rgba(255,152,0,0.15)",
    ink: "#4E342E", inkSoft: "#8D6E63",
    glass: "rgba(255,255,255,0.68)", glassBorder: "rgba(255,255,255,0.6)",
    tabActive: "rgba(255,255,255,0.85)",
    palette: ["#E91E63","#FF9800","#AB47BC","#66BB6A","#FFD54F","#FF6B81","#26C6DA","#FF7043"],
    blob1: "rgba(255,155,170,0.45)", blob2: "rgba(255,200,150,0.4)", blob3: "rgba(233,30,99,0.2)",
    shimmerFrom: "#E91E63", shimmerTo: "#FF9800",
  },
  {
    id: "mintchoc",
    name: "Mint Choc",
    emoji: "🍫",
    bgFrom: "#B2EBB2", bgMid: "#80CBC4", bgTo: "#4DB6AC",
    primary: "#00897B", primaryLight: "#26A69A", primarySoft: "rgba(0,137,123,0.13)",
    accent: "#5D4037", accentSoft: "rgba(93,64,55,0.12)",
    ink: "#1B2E2A", inkSoft: "#546E7A",
    glass: "rgba(255,255,255,0.65)", glassBorder: "rgba(200,255,240,0.6)",
    tabActive: "rgba(255,255,255,0.88)",
    palette: ["#00897B","#26C6DA","#5D4037","#66BB6A","#AED581","#4DB6AC","#80CBC4","#A5D6A7"],
    blob1: "rgba(128,203,196,0.5)", blob2: "rgba(93,64,55,0.25)", blob3: "rgba(0,137,123,0.22)",
    shimmerFrom: "#00897B", shimmerTo: "#26C6DA",
  },
  {
    id: "rainbow",
    name: "Rainbow",
    emoji: "🌈",
    bgFrom: "#FFD6E7", bgMid: "#C9F0FF", bgTo: "#D4FFD4",
    primary: "#E91E63", primaryLight: "#FF9800", primarySoft: "rgba(233,30,99,0.1)",
    accent: "#7C4DFF", accentSoft: "rgba(124,77,255,0.12)",
    ink: "#2D2058", inkSoft: "#6B5B95",
    glass: "rgba(255,255,255,0.72)", glassBorder: "rgba(255,255,255,0.65)",
    tabActive: "rgba(255,255,255,0.9)",
    palette: ["#E91E63","#FF9800","#FFD740","#66BB6A","#26C6DA","#7C4DFF","#AB47BC","#FF6B81"],
    blob1: "rgba(255,168,200,0.45)", blob2: "rgba(168,220,255,0.45)", blob3: "rgba(168,255,168,0.4)",
    shimmerFrom: "#E91E63", shimmerTo: "#7C4DFF",
    isRainbow: true,
  },
  {
    id: "vanillachip",
    name: "Vanilla Chip",
    emoji: "🍪",
    bgFrom: "#FFF8E1", bgMid: "#FFECB3", bgTo: "#FFE082",
    primary: "#795548", primaryLight: "#A1887F", primarySoft: "rgba(121,85,72,0.12)",
    accent: "#F9A825", accentSoft: "rgba(249,168,37,0.15)",
    ink: "#3E2723", inkSoft: "#795548",
    glass: "rgba(255,255,255,0.72)", glassBorder: "rgba(255,245,200,0.65)",
    tabActive: "rgba(255,255,255,0.9)",
    palette: ["#795548","#F9A825","#8D6E63","#A1887F","#FFCA28","#FF8F00","#6D4C41","#D7CCC8"],
    blob1: "rgba(255,220,120,0.5)", blob2: "rgba(210,170,110,0.4)", blob3: "rgba(255,200,80,0.3)",
    shimmerFrom: "#795548", shimmerTo: "#F9A825",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    emoji: "🫐",
    bgFrom: "#D1C4E9", bgMid: "#B39DDB", bgTo: "#9575CD",
    primary: "#5E35B1", primaryLight: "#7E57C2", primarySoft: "rgba(94,53,177,0.13)",
    accent: "#E91E63", accentSoft: "rgba(233,30,99,0.12)",
    ink: "#1A0533", inkSoft: "#6746A8",
    glass: "rgba(255,255,255,0.65)", glassBorder: "rgba(230,220,255,0.6)",
    tabActive: "rgba(255,255,255,0.88)",
    palette: ["#5E35B1","#7E57C2","#AB47BC","#E91E63","#9575CD","#26C6DA","#3949AB","#7986CB"],
    blob1: "rgba(180,140,240,0.5)", blob2: "rgba(233,30,99,0.2)", blob3: "rgba(94,53,177,0.25)",
    shimmerFrom: "#5E35B1", shimmerTo: "#E91E63",
  },
];

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const TABS = [
  { id: "characters", label: "ตัวละคร", emoji: "☺" },
  { id: "plan",       label: "แพลน",    emoji: "✎" },
  { id: "calendar",   label: "ปฏิทิน",  emoji: "◈" },
  { id: "plot",       label: "พล็อต",   emoji: "◇" },
  { id: "episodes",   label: "ตอน",     emoji: "▤" },
];

const STATUS = [
  { id: "draft",   label: "ฉบับร่าง", color: "#FF9800" },
  { id: "editing", label: "กำลังแก้",  color: "#E91E63" },
  { id: "done",    label: "เสร็จแล้ว", color: "#66BB6A" },
];

const MONTH_TH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const WEEKDAY_TH = ["อา","จ","อ","พ","พฤ","ศ","ส"];

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }

function makeDefaultProject(id: string, name?: string, color?: string) {
  return {
    id, name: name || "โปรเจกต์ใหม่", color: color || "#E91E63",
    createdAt: Date.now(),
    plan: { logline: "", genre: "", audience: "", notes: "" },
    characters: [] as { id: string; name: string; role: string; desc: string }[],
    plot: [] as { id: string; title: string; desc: string }[],
    episodes: [] as { id: string; title: string; status: string; notes: string }[],
    calendar: { events: {} as Record<string, { id: string; label: string }[]> },
  };
}
type Project = ReturnType<typeof makeDefaultProject>;

function buildMonthGrid(year: number, month: number) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function move<T>(arr: T[], idx: number, dir: number) {
  const t = idx + dir;
  if (t < 0 || t >= arr.length) return arr;
  const n = [...arr];
  [n[idx], n[t]] = [n[t], n[idx]];
  return n;
}

/* ══════════════════════════════════════════
   STORAGE — local IndexedDB database, fully offline
   (falls back to window.storage only if a host environment injects it)
══════════════════════════════════════════ */
declare global { interface Window { storage?: { get(k: string, b: boolean): Promise<{ value: string } | null>; set(k: string, v: string, b: boolean): Promise<void>; delete(k: string, b: boolean): Promise<void> } } }

const DB_NAME = "sweet_story_db";
const DB_VERSION = 1;
const STORE_NAME = "kv";

let dbPromise: Promise<IDBDatabase> | null = null;
function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") { reject(new Error("no indexedDB")); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}
function idbGet(key: string): Promise<string | null> {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result === undefined ? null : req.result);
    req.onerror = () => reject(req.error);
  })).catch(() => null);
}
function idbSet(key: string, value: string): Promise<void> {
  return openDB().then((db) => new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  })).catch((e) => console.error(e));
}
function idbDelete(key: string): Promise<void> {
  return openDB().then((db) => new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  })).catch((e) => console.error(e));
}

/* unified accessors: use a host-provided window.storage if present, otherwise the local IndexedDB */
async function storageGet(key: string): Promise<string | null> {
  if (window.storage) {
    try { const r = await window.storage.get(key, false); return r ? r.value : null; } catch { /* fall through */ }
  }
  return idbGet(key);
}
async function storageSet(key: string, value: string): Promise<void> {
  if (window.storage) {
    try { await window.storage.set(key, value, false); return; } catch { /* fall through */ }
  }
  await idbSet(key, value);
}
async function storageDelete(key: string): Promise<void> {
  if (window.storage) {
    try { await window.storage.delete(key, false); return; } catch { /* fall through */ }
  }
  await idbDelete(key);
}

async function loadIndex() {
  try { const v = await storageGet("pi2"); return v ? JSON.parse(v) : []; } catch { return []; }
}
async function saveIndex(list: unknown[]) {
  try { await storageSet("pi2", JSON.stringify(list)); } catch(e) { console.error(e); }
}
async function loadProjectData(id: string): Promise<Project | null> {
  try { const v = await storageGet(`p2:${id}`); return v ? JSON.parse(v) : null; } catch { return null; }
}
async function saveProjectData(data: Project) {
  try { await storageSet(`p2:${data.id}`, JSON.stringify(data)); } catch(e) { console.error(e); }
}
async function deleteProjectData(id: string) {
  try { await storageDelete(`p2:${id}`); } catch(e) { console.error(e); }
}
async function loadThemeId(): Promise<string | null> {
  try { const v = await storageGet("themeId"); return v ? JSON.parse(v) : null; } catch { return null; }
}
async function saveThemeId(id: string) {
  try { await storageSet("themeId", JSON.stringify(id)); } catch(e) { console.error(e); }
}

/* ══════════════════════════════════════════
   PARTICLE BURST
══════════════════════════════════════════ */
function ParticleBurst({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div style={{ position: "fixed", left: x, top: y, pointerEvents: "none", zIndex: 9999 }}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="float-particle"
          style={{
            position: "absolute",
            width: 8, height: 8,
            borderRadius: "50%",
            background: color,
            left: (Math.cos((i / 6) * Math.PI * 2) * 20) - 4,
            top: (Math.sin((i / 6) * Math.PI * 2) * 20) - 4,
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   ANIMATED BG
══════════════════════════════════════════ */
function AnimatedBackground({ theme }: { theme: IceCreamTheme }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* gradient base */}
      <div style={{
        position: "absolute", inset: 0,
        background: theme.isRainbow
          ? `linear-gradient(135deg, ${theme.bgFrom} 0%, ${theme.bgMid} 35%, ${theme.bgTo} 65%, ${theme.bgFrom} 100%)`
          : `linear-gradient(135deg, ${theme.bgFrom} 0%, ${theme.bgMid} 50%, ${theme.bgTo} 100%)`,
        transition: "background 0.8s ease",
      }} />
      {/* blobs */}
      <div className={`blob1${theme.isRainbow ? " rainbow-blob" : ""}`} style={{
        position: "absolute", top: "-10%", left: "-8%",
        width: "55vw", height: "55vw", maxWidth: 520, maxHeight: 520,
        borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
        background: theme.blob1,
        filter: "blur(48px)",
        transition: "background 0.8s ease",
      }} />
      <div className={`blob2${theme.isRainbow ? " rainbow-blob" : ""}`} style={{
        position: "absolute", bottom: "-15%", right: "-10%",
        width: "60vw", height: "60vw", maxWidth: 560, maxHeight: 560,
        borderRadius: "40% 60% 45% 55% / 55% 45% 60% 40%",
        background: theme.blob2,
        filter: "blur(56px)",
        transition: "background 0.8s ease",
      }} />
      <div className={`blob3${theme.isRainbow ? " rainbow-blob" : ""}`} style={{
        position: "absolute", top: "35%", left: "30%",
        width: "40vw", height: "40vw", maxWidth: 400, maxHeight: 400,
        borderRadius: "50%",
        background: theme.blob3,
        filter: "blur(64px)",
        transition: "background 0.8s ease",
      }} />
      {/* sparkle dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={theme.isRainbow ? "rainbow-blob" : ""}
          style={{
            position: "absolute",
            width: `${6 + (i % 4) * 4}px`,
            height: `${6 + (i % 4) * 4}px`,
            borderRadius: "50%",
            background: theme.palette[i % theme.palette.length],
            opacity: 0.35,
            top: `${(i * 73 + 10) % 90}%`,
            left: `${(i * 137 + 5) % 92}%`,
            animation: `sparkle ${2.5 + (i % 5) * 0.7}s ease-in-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   THEME SWITCHER
══════════════════════════════════════════ */
function ThemeSwitcher({ current, onChange }: { current: IceCreamTheme; onChange: (t: IceCreamTheme) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <IceBtn onClick={() => setOpen(!open)} theme={current} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20, gap: 5 }}>
        {current.emoji} {current.name} ▾
      </IceBtn>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: current.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: `1.5px solid ${current.glassBorder}`,
          borderRadius: 16, padding: 10, display: "flex", flexDirection: "column", gap: 5,
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)", zIndex: 200, minWidth: 160,
          animation: "fadeSlideIn 0.18s ease",
        }}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              className="btn-pop"
              onClick={() => { onChange(t); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: t.id === current.id ? t.primarySoft : "transparent",
                color: current.ink, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13,
                transition: "background 0.15s",
              }}
            >
              <span style={{ fontSize: 18 }}>{t.emoji}</span>
              <span>{t.name}</span>
              {t.id === current.id && <span style={{ marginLeft: "auto", color: t.primary }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SHARED BUTTON with ripple
══════════════════════════════════════════ */
function IceBtn({
  children, onClick, theme, style, variant = "ghost", disabled,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  theme: IceCreamTheme;
  style?: React.CSSProperties;
  variant?: "primary" | "ghost" | "outline";
  disabled?: boolean;
}) {
  const [particles, setParticles] = useState<{ id: string; x: number; y: number }[]>([]);

  function handleClick(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const p = { id: uid(), x: rect.left + rect.width / 2, y: rect.top };
    setParticles((ps) => [...ps, p]);
    setTimeout(() => setParticles((ps) => ps.filter((x) => x.id !== p.id)), 1900);
    onClick?.(e);
  }

  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontFamily: "'Space Mono',monospace", fontWeight: 700,
    fontSize: 12.5, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", transition: "transform 0.12s, box-shadow 0.12s, background 0.2s",
    opacity: disabled ? 0.5 : 1, position: "relative", overflow: "hidden",
    borderRadius: 12,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
      color: "#fff",
      padding: "10px 20px",
      boxShadow: `0 4px 16px ${theme.primary}44`,
    },
    ghost: {
      background: theme.primarySoft,
      color: theme.primary,
      padding: "8px 16px",
      border: `1.5px solid ${theme.primary}30`,
    },
    outline: {
      background: "transparent",
      color: theme.inkSoft,
      padding: "7px 14px",
      border: `1.5px solid ${theme.inkSoft}30`,
    },
  };

  return (
    <>
      {particles.map((p) => <ParticleBurst key={p.id} x={p.x} y={p.y} color={theme.primary} />)}
      <button
        className="btn-pop"
        disabled={disabled}
        onClick={handleClick}
        style={{ ...base, ...variants[variant], ...style }}
        onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.transform = "scale(1.04) translateY(-1px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        {children}
      </button>
    </>
  );
}

/* ══════════════════════════════════════════
   GLASS CARD
══════════════════════════════════════════ */
function GlassCard({ children, theme, style }: { children: React.ReactNode; theme: IceCreamTheme; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: theme.glass,
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      border: `1.5px solid ${theme.glassBorder}`,
      borderRadius: 20, padding: 22,
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      transition: "background 0.5s, border-color 0.5s",
      ...style,
    }}>
      {children}
    </div>
  );
}

function FLabel({ children, theme }: { children: React.ReactNode; theme: IceCreamTheme }) {
  return <div style={{ fontSize: 10.5, color: theme.inkSoft, fontFamily: "'Space Mono',monospace", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{children}</div>;
}

function FInput({ value, onChange, placeholder, theme, style }: {
  value: string; onChange: (v: string) => void; placeholder?: string; theme: IceCreamTheme; style?: React.CSSProperties;
}) {
  return (
    <input
      value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", fontSize: 13.5, color: theme.ink, padding: "9px 12px",
        borderRadius: 10, border: `1.5px solid ${theme.primary}25`,
        background: "rgba(255,255,255,0.75)", outline: "none",
        fontFamily: "'Nunito',sans-serif",
        transition: "border-color 0.15s, box-shadow 0.15s", ...style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}20`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = `${theme.primary}25`; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

function FTextarea({ value, onChange, placeholder, rows, theme }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; theme: IceCreamTheme;
}) {
  return (
    <textarea
      value={value} placeholder={placeholder} rows={rows || 3}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", fontSize: 13.5, color: theme.ink, padding: "10px 12px",
        borderRadius: 10, border: `1.5px solid ${theme.primary}25`,
        background: "rgba(255,255,255,0.75)", outline: "none",
        lineHeight: 1.7, resize: "vertical", fontFamily: "'Nunito',sans-serif",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}20`; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = `${theme.primary}25`; e.currentTarget.style.boxShadow = "none"; }}
    />
  );
}

/* ══════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════ */
export default function App() {
  const [theme, setTheme] = useState<IceCreamTheme>(THEMES[0]);
  const [projects, setProjects] = useState<{ id: string; name: string; color: string; createdAt: number }[]>([]);
  const [indexLoading, setIndexLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("characters");
  const [showCreate, setShowCreate] = useState(false);
  const [savingState, setSavingState] = useState<"idle" | "saving" | "saved">("idle");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const idx = await loadIndex();
      setProjects(idx);
      if (idx.length) setSelectedId(idx[0].id);
      setIndexLoading(false);
    })();
    (async () => {
      const savedThemeId = await loadThemeId();
      if (savedThemeId) {
        const found = THEMES.find((t) => t.id === savedThemeId);
        if (found) setTheme(found);
      }
    })();
  }, []);

  function changeTheme(t: IceCreamTheme) {
    setTheme(t);
    saveThemeId(t.id);
  }

  useEffect(() => {
    if (!selectedId) { setProjectData(null); return; }
    (async () => {
      setProjectLoading(true);
      const data = await loadProjectData(selectedId);
      setProjectData(data || makeDefaultProject(selectedId));
      setProjectLoading(false);
    })();
  }, [selectedId]);

  function scheduleSave(data: Project) {
    setSavingState("saving");
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await saveProjectData(data);
      setSavingState("saved");
      setTimeout(() => setSavingState((s) => s === "saved" ? "idle" : s), 1400);
    }, 450);
  }

  function updateProjectData(updater: (prev: Project) => Project) {
    setProjectData((prev) => { if (!prev) return prev; const next = updater(prev); scheduleSave(next); return next; });
  }

  async function createProject(name: string, color: string) {
    const id = uid();
    const item = { id, name: name || "โปรเจกต์ใหม่", color, createdAt: Date.now() };
    const next = [...projects, item];
    setProjects(next); saveIndex(next);
    const data = makeDefaultProject(id, item.name, color);
    setSelectedId(id); setProjectData(data); saveProjectData(data);
    setShowCreate(false); setActiveTab("characters");
  }

  function renameProject(name: string) {
    if (!projectData) return;
    updateProjectData((prev) => ({ ...prev, name }));
    const next = projects.map((p) => p.id === selectedId ? { ...p, name } : p);
    setProjects(next); saveIndex(next);
  }

  function deleteProject(id: string) {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next); saveIndex(next); deleteProjectData(id);
    setConfirmDelete(null);
    if (selectedId === id) setSelectedId(next[0]?.id || null);
  }

  const selectProject = useCallback((id: string) => {
    setSelectedId(id); setActiveTab("characters"); setSidebarOpen(false);
  }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'Nunito',sans-serif" }}>
      <AnimatedBackground theme={theme} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 49, backdropFilter: "blur(2px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* ── top bar (browser chrome on desktop, app bar on mobile) ── */}
        <div style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1.5px solid ${theme.primary}22`,
          padding: "0 16px",
          height: 52,
          display: "flex", alignItems: "center", gap: 12,
          flexShrink: 0,
          position: "relative", zIndex: 10,
          transition: "border-color 0.5s",
        }}>
          {/* Traffic lights — desktop only */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }} className="hidden-mobile">
            {["#FF5F57","#FEBC2E","#28C840"].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, boxShadow: `0 1px 4px ${c}88` }} />
            ))}
          </div>
          {/* Hamburger — mobile only */}
          <button
            className="show-mobile btn-pop"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: theme.primarySoft, border: "none", borderRadius: 9, width: 36, height: 36, fontSize: 16, cursor: "pointer", color: theme.primary, display: "none" }}
          >☰</button>

          {/* Address bar */}
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.6)", border: `1.5px solid ${theme.primary}22`,
            borderRadius: 8, padding: "5px 14px", display: "flex", alignItems: "center", gap: 8,
            fontSize: 11.5, color: theme.inkSoft, fontFamily: "'Space Mono',monospace",
            transition: "border-color 0.5s",
            overflow: "hidden",
          }}>
            <span style={{ color: "#66BB6A", flexShrink: 0 }}>🔒</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>sweetstory.app / {projects.find(p => p.id === selectedId)?.name || "ชั้นหนังสือ"}</span>
          </div>

          {/* Theme switcher */}
          <ThemeSwitcher current={theme} onChange={changeTheme} />
        </div>

        {/* ── main layout ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
          {/* Sidebar */}
          <Sidebar
            theme={theme}
            projects={projects}
            selectedId={selectedId}
            onSelect={selectProject}
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            onCreate={createProject}
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
            onDelete={deleteProject}
            mobileOpen={sidebarOpen}
          />

          {/* Main content */}
          <main style={{
            flex: 1, overflowY: "auto", padding: "24px 20px 60px",
            maxWidth: "100%",
          }}>
            {indexLoading ? (
              <CenterMsg theme={theme}>🍬 กำลังโหลด…</CenterMsg>
            ) : !selectedId ? (
              <EmptyState theme={theme} onCreateClick={() => setShowCreate(true)} />
            ) : projectLoading || !projectData ? (
              <CenterMsg theme={theme}>{theme.emoji} กำลังเปิดแฟ้ม…</CenterMsg>
            ) : (
              <ProjectView
                theme={theme}
                data={projectData}
                update={updateProjectData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                savingState={savingState}
                onRename={renameProject}
              />
            )}
          </main>
        </div>
      </div>

      {/* Responsive style injection */}
      <style>{`
        @media (max-width: 680px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar-visible { display: flex !important; }
        }
        @media (min-width: 681px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-sidebar-visible { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        input::placeholder, textarea::placeholder { color: ${theme.inkSoft}88; }
      `}</style>
    </div>
  );
}

function CenterMsg({ children, theme }: { children: React.ReactNode; theme: IceCreamTheme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: theme.inkSoft, fontFamily: "'Space Mono',monospace", fontSize: 14 }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */
function Sidebar({ theme, projects, selectedId, onSelect, showCreate, setShowCreate, onCreate, confirmDelete, setConfirmDelete, onDelete, mobileOpen }: {
  theme: IceCreamTheme;
  projects: { id: string; name: string; color: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showCreate: boolean; setShowCreate: (v: boolean) => void;
  onCreate: (n: string, c: string) => void;
  confirmDelete: string | null; setConfirmDelete: (v: string | null) => void;
  onDelete: (id: string) => void;
  mobileOpen: boolean;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(theme.palette[0]);

  useEffect(() => { setColor(theme.palette[0]); }, [theme.id]);

  function submit() {
    if (!name.trim()) return;
    onCreate(name.trim(), color);
    setName(""); setColor(theme.palette[(projects.length + 1) % theme.palette.length]);
  }

  const sidebarStyle: React.CSSProperties = {
    width: 230, flexShrink: 0,
    background: "rgba(255,255,255,0.58)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderRight: `1.5px solid ${theme.primary}20`,
    padding: "16px 12px",
    display: "flex", flexDirection: "column", gap: 12,
    transition: "background 0.5s, border-color 0.5s",
    overflowY: "auto",
  };

  /* mobile: fixed overlay */
  const mobileSidebarStyle: React.CSSProperties = {
    ...sidebarStyle,
    position: "fixed", left: 0, top: 52, bottom: 0,
    zIndex: 50, width: 260,
    boxShadow: "4px 0 32px rgba(0,0,0,0.18)",
    borderRadius: "0 20px 20px 0",
    display: mobileOpen ? "flex" : "none",
  };

  const content = (
    <>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px 12px", borderBottom: `1.5px solid ${theme.primary}18` }}>
        <div style={{
          width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
          borderRadius: "6px 16px 6px 16px", fontSize: 20,
          boxShadow: `0 4px 14px ${theme.primary}44`,
        }}>{theme.emoji}</div>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12.5, color: theme.ink, fontWeight: 700, lineHeight: 1.2 }}>ชั้นหนังสือ</div>
          <div style={{ fontSize: 9.5, color: theme.inkSoft, marginTop: 1 }}>Sweet Story</div>
        </div>
      </div>

      {/* Project list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, overflowY: "auto", minHeight: 30 }}>
        {projects.map((p) => (
          <div key={p.id} style={{ position: "relative" }}>
            <button
              className="btn-pop"
              onClick={() => onSelect(p.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "8px 32px 8px 8px", borderRadius: "6px 14px 14px 6px",
                background: p.id === selectedId ? "rgba(255,255,255,0.85)" : "transparent",
                border: `1.5px solid ${p.id === selectedId ? p.color + "50" : "transparent"}`,
                boxShadow: p.id === selectedId ? `0 3px 12px ${p.color}22` : "none",
                transform: p.id === selectedId ? "translateX(4px)" : "none",
                transition: "all 0.18s ease", cursor: "pointer",
              }}
            >
              <span style={{ width: 5, height: 22, borderRadius: 3, background: p.color, flexShrink: 0 }} />
              <span style={{
                fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                color: p.id === selectedId ? theme.ink : theme.inkSoft,
                fontWeight: p.id === selectedId ? 700 : 500,
              }}>{p.name}</span>
            </button>
            {confirmDelete === p.id ? (
              <div style={{
                position: "absolute", right: 2, top: "50%", transform: "translateY(-50%)",
                display: "flex", alignItems: "center", gap: 4, fontSize: 10,
                background: "rgba(255,255,255,0.95)", padding: "4px 7px", borderRadius: 10,
                border: `1.5px solid ${theme.primary}25`, zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}>
                <button onClick={() => onDelete(p.id)} className="btn-pop" style={{ background: "#E91E63", color: "#fff", fontSize: 9.5, padding: "2px 7px", borderRadius: 5, border: "none", cursor: "pointer" }}>ลบ</button>
                <button onClick={() => setConfirmDelete(null)} style={{ background: "transparent", color: theme.inkSoft, fontSize: 9.5, padding: "2px 4px", border: "none", cursor: "pointer" }}>ยกเลิก</button>
              </div>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
                style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: theme.inkSoft, fontSize: 11, padding: 4, opacity: 0.4, cursor: "pointer" }}>✕</button>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ fontSize: 11.5, color: theme.inkSoft, padding: "10px 8px" }}>ยังไม่มีแพลนโปรเจกต์</div>
        )}
      </div>

      {!showCreate ? (
        <IceBtn variant="primary" theme={theme} onClick={() => setShowCreate(true)} style={{ width: "100%", justifyContent: "center" }}>
          {theme.emoji} + สร้างแพลนใหม่
        </IceBtn>
      ) : (
        <div style={{
          background: "rgba(255,255,255,0.88)", border: `1.5px solid ${theme.primary}25`,
          borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 9,
          boxShadow: `0 4px 16px ${theme.primary}15`, animation: "fadeSlideIn 0.18s ease",
        }}>
          <input
            autoFocus placeholder="ชื่อโปรเจกต์…" value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={{
              fontSize: 12.5, padding: "7px 10px", borderRadius: 8,
              border: `1.5px solid ${theme.primary}30`, background: "#FFF", color: theme.ink,
              outline: "none", fontFamily: "'Nunito',sans-serif",
            }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {theme.palette.map((c) => (
              <button key={c} className="btn-pop" onClick={() => setColor(c)} style={{
                width: 18, height: 18, borderRadius: "50%", background: c, border: "none", cursor: "pointer",
                outline: color === c ? `3px solid ${c}` : "none", outlineOffset: 2,
                boxShadow: color === c ? "0 0 0 1.5px white" : "none",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <IceBtn variant="primary" theme={theme} onClick={submit} style={{ flex: 1, justifyContent: "center", padding: "7px 0" }}>สร้าง</IceBtn>
            <IceBtn variant="outline" theme={theme} onClick={() => setShowCreate(false)} style={{ flex: 1, justifyContent: "center", padding: "7px 0" }}>ยกเลิก</IceBtn>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* desktop sidebar */}
      <aside className="desktop-sidebar" style={sidebarStyle}>{content}</aside>
      {/* mobile sidebar overlay */}
      <aside style={mobileSidebarStyle} className="sidebar-mobile-open">{content}</aside>
    </>
  );
}

/* ══════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════ */
function EmptyState({ theme, onCreateClick }: { theme: IceCreamTheme; onCreateClick: () => void }) {
  return (
    <div style={{ maxWidth: 440, margin: "8vh auto 0", textAlign: "center", padding: "0 16px", animation: "fadeSlideIn 0.3s ease" }}>
      <div style={{ fontSize: 64, marginBottom: 10, filter: `drop-shadow(0 4px 16px ${theme.primary}44)` }}>{theme.emoji}</div>
      <div style={{
        fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, marginBottom: 12,
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>เริ่มเรื่องแรกของคุณ</div>
      <p style={{ fontSize: 14, color: theme.inkSoft, lineHeight: 1.8, marginBottom: 24 }}>
        สร้างแพลนโปรเจกต์เพื่อเก็บตัวละคร โครงเรื่อง พล็อต ตอน และตารางงานเขียนไว้ในที่เดียวกัน
      </p>
      <IceBtn variant="primary" theme={theme} onClick={onCreateClick} style={{ fontSize: 14, padding: "12px 28px" }}>
        {theme.emoji} สร้างแพลนใหม่
      </IceBtn>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROJECT VIEW
══════════════════════════════════════════ */
function ProjectView({ theme, data, update, activeTab, setActiveTab, savingState, onRename }: {
  theme: IceCreamTheme; data: Project;
  update: (u: (p: Project) => Project) => void;
  activeTab: string; setActiveTab: (t: string) => void;
  savingState: string; onRename: (n: string) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(data.name);
  useEffect(() => { setDraftName(data.name); }, [data.id]);

  function commitName() {
    setEditingName(false);
    if (draftName.trim() && draftName !== data.name) onRename(draftName.trim());
    else setDraftName(data.name);
  }

  return (
    <div style={{ animation: "fadeSlideIn 0.22s ease" }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{ width: 8, height: 34, borderRadius: 4, background: data.color, flexShrink: 0, boxShadow: `0 2px 10px ${data.color}55` }} />
        {!editingName ? (
          <h1 onClick={() => setEditingName(true)}
            style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(16px,4vw,22px)", color: theme.ink, fontWeight: 700, cursor: "pointer", margin: 0 }}>
            {data.name}
          </h1>
        ) : (
          <input autoFocus value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => e.key === "Enter" && commitName()}
            style={{
              fontFamily: "'Space Mono',monospace", fontSize: "clamp(16px,4vw,22px)", color: theme.ink, fontWeight: 700,
              border: "none", borderBottom: `2.5px solid ${data.color}`, background: "transparent", outline: "none",
            }}
          />
        )}
        <span style={{ marginLeft: "auto", fontSize: 11, color: theme.inkSoft, fontFamily: "'Space Mono',monospace", whiteSpace: "nowrap" }}>
          {savingState === "saving" && "🍬 กำลังบันทึก…"}
          {savingState === "saved" && "✅ บันทึกแล้ว"}
        </span>
      </header>

      {/* Tabs — scrollable on mobile */}
      <nav style={{ display: "flex", gap: 3, borderBottom: `2px solid ${theme.primary}18`, margin: "16px 0 20px", overflowX: "auto", paddingBottom: 1 }}>
        {TABS.map((t) => (
          <button key={t.id} className="btn-pop" onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? theme.tabActive : "transparent",
              border: activeTab === t.id ? `1.5px solid ${data.color}40` : "1.5px solid transparent",
              borderBottom: activeTab === t.id ? `2.5px solid ${data.color}` : "2.5px solid transparent",
              borderRadius: "10px 10px 0 0", padding: "8px 14px",
              fontSize: "clamp(11px,2.5vw,13px)", fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? theme.ink : theme.inkSoft,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
              boxShadow: activeTab === t.id ? "0 -2px 8px rgba(0,0,0,0.05)" : "none",
              fontFamily: "'Nunito',sans-serif",
            }}
          ><span style={{ marginRight: 4 }}>{t.emoji}</span>{t.label}</button>
        ))}
      </nav>

      <div key={activeTab} className="panel-enter">
        {activeTab === "characters" && <CharactersPanel theme={theme} data={data} update={update} />}
        {activeTab === "plan"       && <PlanPanel       theme={theme} data={data} update={update} />}
        {activeTab === "calendar"   && <CalendarPanel   theme={theme} data={data} update={update} />}
        {activeTab === "plot"       && <PlotPanel       theme={theme} data={data} update={update} />}
        {activeTab === "episodes"   && <EpisodesPanel   theme={theme} data={data} update={update} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: PLAN
══════════════════════════════════════════ */
function PlanPanel({ theme, data, update }: { theme: IceCreamTheme; data: Project; update: (u: (p: Project) => Project) => void }) {
  function set(field: string, value: string) {
    update((prev) => ({ ...prev, plan: { ...prev.plan, [field]: value } }));
  }
  return (
    <GlassCard theme={theme}>
      <div style={{ marginBottom: 18 }}>
        <FLabel theme={theme}>โลจไลน์</FLabel>
        <FTextarea theme={theme} rows={2} value={data.plan.logline} onChange={(v) => set("logline", v)}
          placeholder="เด็กสาวผู้สืบทอดร้านหนังสือเก่าค้นพบว่าหนังสือทุกเล่มในร้านคือประตูสู่ความทรงจำ…" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 18 }}>
        <div>
          <FLabel theme={theme}>แนวเรื่อง</FLabel>
          <FInput theme={theme} value={data.plan.genre} onChange={(v) => set("genre", v)} placeholder="แฟนตาซี, ดราม่า…" />
        </div>
        <div>
          <FLabel theme={theme}>กลุ่มผู้อ่าน</FLabel>
          <FInput theme={theme} value={data.plan.audience} onChange={(v) => set("audience", v)} placeholder="วัยรุ่น, ผู้ใหญ่…" />
        </div>
      </div>
      <div>
        <FLabel theme={theme}>บันทึกแพลนโดยรวม</FLabel>
        <FTextarea theme={theme} rows={9} value={data.plan.notes} onChange={(v) => set("notes", v)}
          placeholder="เขียนแผนการเล่าเรื่อง โทนของงาน…" />
      </div>
    </GlassCard>
  );
}

/* ══════════════════════════════════════════
   PANEL: CHARACTERS
══════════════════════════════════════════ */
function CharactersPanel({ theme, data, update }: { theme: IceCreamTheme; data: Project; update: (u: (p: Project) => Project) => void }) {
  function add() { update((prev) => ({ ...prev, characters: [...prev.characters, { id: uid(), name: "ตัวละครใหม่", role: "", desc: "" }] })); }
  function edit(id: string, field: string, value: string) { update((prev) => ({ ...prev, characters: prev.characters.map((c) => c.id === id ? { ...c, [field]: value } : c) })); }
  function remove(id: string) { update((prev) => ({ ...prev, characters: prev.characters.filter((c) => c.id !== id) })); }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12, marginBottom: 14 }}>
        {data.characters.map((c) => (
          <div key={c.id} style={{
            background: theme.glass, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            border: `1.5px solid ${theme.glassBorder}`,
            borderLeft: `5px solid ${data.color}`,
            borderRadius: 16, padding: "12px 12px 12px 10px",
            display: "flex", gap: 8, position: "relative",
            boxShadow: `0 4px 14px ${data.color}18`,
            animation: "fadeSlideIn 0.2s ease",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <input value={c.name} onChange={(e) => edit(c.id, "name", e.target.value)}
                style={{ width: "100%", fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: theme.ink, background: "transparent", border: "none", outline: "none", marginBottom: 3 }} />
              <input value={c.role} onChange={(e) => edit(c.id, "role", e.target.value)}
                placeholder="บทบาท เช่น ตัวเอก"
                style={{ width: "100%", fontSize: 11.5, color: data.color, background: "transparent", border: "none", outline: "none", marginBottom: 6, fontFamily: "'Nunito',sans-serif", fontWeight: 700 }} />
              <textarea value={c.desc} onChange={(e) => edit(c.id, "desc", e.target.value)}
                placeholder="ลักษณะนิสัย ภูมิหลัง…" rows={3}
                style={{ width: "100%", fontSize: 12.5, color: theme.inkSoft, background: "transparent", border: "none", outline: "none", lineHeight: 1.6, resize: "vertical", fontFamily: "'Nunito',sans-serif" }} />
            </div>
            <button onClick={() => remove(c.id)} className="btn-pop"
              style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "#ccc", fontSize: 12, padding: 5, cursor: "pointer", borderRadius: 6 }}>✕</button>
          </div>
        ))}
      </div>
      {data.characters.length === 0 && <p style={{ fontSize: 13, color: theme.inkSoft, padding: "16px 4px" }}>ยังไม่มีตัวละคร เริ่มเพิ่มตัวเอกของเรื่องได้เลย</p>}
      <IceBtn variant="ghost" theme={theme} onClick={add}>☺ + เพิ่มตัวละคร</IceBtn>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: PLOT
══════════════════════════════════════════ */
function PlotPanel({ theme, data, update }: { theme: IceCreamTheme; data: Project; update: (u: (p: Project) => Project) => void }) {
  function add() { update((prev) => ({ ...prev, plot: [...prev.plot, { id: uid(), title: "จุดสำคัญใหม่", desc: "" }] })); }
  function edit(id: string, field: string, value: string) { update((prev) => ({ ...prev, plot: prev.plot.map((p) => p.id === id ? { ...p, [field]: value } : p) })); }
  function remove(id: string) { update((prev) => ({ ...prev, plot: prev.plot.filter((p) => p.id !== id) })); }
  function reorder(idx: number, dir: number) { update((prev) => ({ ...prev, plot: move(prev.plot, idx, dir) })); }

  return (
    <div>
      {data.plot.map((p, idx) => (
        <div key={p.id} style={{
          display: "flex", gap: 10, padding: "14px 0",
          borderBottom: `1.5px solid ${theme.primary}12`,
          animation: "fadeSlideIn 0.2s ease",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: 26, flexShrink: 0 }}>
            <button onClick={() => reorder(idx, -1)} disabled={idx === 0} className="btn-pop"
              style={{ background: "transparent", border: "none", color: theme.inkSoft, fontSize: 10, padding: 3, cursor: "pointer", opacity: idx === 0 ? 0.3 : 1 }}>▲</button>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, fontWeight: 700, color: data.color }}>{idx + 1}</span>
            <button onClick={() => reorder(idx, 1)} disabled={idx === data.plot.length - 1} className="btn-pop"
              style={{ background: "transparent", border: "none", color: theme.inkSoft, fontSize: 10, padding: 3, cursor: "pointer", opacity: idx === data.plot.length - 1 ? 0.3 : 1 }}>▼</button>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <input value={p.title} onChange={(e) => edit(p.id, "title", e.target.value)}
              style={{ width: "100%", fontFamily: "'Space Mono',monospace", fontSize: 13.5, fontWeight: 700, color: theme.ink, background: "transparent", border: "none", outline: "none", marginBottom: 4 }} />
            <textarea value={p.desc} onChange={(e) => edit(p.id, "desc", e.target.value)}
              placeholder="อธิบายเหตุการณ์ หรือจุดหักมุม…" rows={2}
              style={{ width: "100%", fontSize: 12.5, color: theme.inkSoft, background: "transparent", border: "none", outline: "none", lineHeight: 1.6, resize: "vertical", fontFamily: "'Nunito',sans-serif" }} />
          </div>
          <button onClick={() => remove(p.id)} className="btn-pop"
            style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "#ccc", fontSize: 12, padding: 5, cursor: "pointer" }}>✕</button>
        </div>
      ))}
      {data.plot.length === 0 && <p style={{ fontSize: 13, color: theme.inkSoft, padding: "16px 4px" }}>ยังไม่มีจุดพล็อต เริ่มจาก "จุดเริ่มเรื่อง" ได้เลย</p>}
      <IceBtn variant="ghost" theme={theme} onClick={add} style={{ marginTop: 14 }}>◇ + เพิ่มจุดพล็อต</IceBtn>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: EPISODES
══════════════════════════════════════════ */
function EpisodesPanel({ theme, data, update }: { theme: IceCreamTheme; data: Project; update: (u: (p: Project) => Project) => void }) {
  function add() { update((prev) => ({ ...prev, episodes: [...prev.episodes, { id: uid(), title: `ตอนที่ ${prev.episodes.length + 1}`, status: "draft", notes: "" }] })); }
  function edit(id: string, field: string, value: string) { update((prev) => ({ ...prev, episodes: prev.episodes.map((ep) => ep.id === id ? { ...ep, [field]: value } : ep) })); }
  function remove(id: string) { update((prev) => ({ ...prev, episodes: prev.episodes.filter((ep) => ep.id !== id) })); }
  function reorder(idx: number, dir: number) { update((prev) => ({ ...prev, episodes: move(prev.episodes, idx, dir) })); }

  return (
    <div>
      {data.episodes.map((ep, idx) => (
        <div key={ep.id} style={{
          display: "flex", gap: 10, padding: "14px 0",
          borderBottom: `1.5px solid ${theme.primary}12`,
          animation: "fadeSlideIn 0.2s ease",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: 22, flexShrink: 0 }}>
            <button onClick={() => reorder(idx, -1)} disabled={idx === 0} className="btn-pop"
              style={{ background: "transparent", border: "none", color: theme.inkSoft, fontSize: 10, padding: 2, cursor: "pointer", opacity: idx === 0 ? 0.3 : 1 }}>▲</button>
            <button onClick={() => reorder(idx, 1)} disabled={idx === data.episodes.length - 1} className="btn-pop"
              style={{ background: "transparent", border: "none", color: theme.inkSoft, fontSize: 10, padding: 2, cursor: "pointer", opacity: idx === data.episodes.length - 1 ? 0.3 : 1 }}>▼</button>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
              <input value={ep.title} onChange={(e) => edit(ep.id, "title", e.target.value)}
                style={{ flex: 1, minWidth: 100, fontFamily: "'Space Mono',monospace", fontSize: 13.5, fontWeight: 700, color: theme.ink, background: "transparent", border: "none", outline: "none" }} />
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {STATUS.map((s) => (
                  <button key={s.id} className="btn-pop" onClick={() => edit(ep.id, "status", s.id)} style={{
                    fontSize: 10.5, padding: "4px 10px", borderRadius: 999,
                    background: ep.status === s.id ? s.color : "transparent",
                    color: ep.status === s.id ? "#fff" : theme.inkSoft,
                    border: `1.5px solid ${s.color}`,
                    fontWeight: ep.status === s.id ? 700 : 500,
                    cursor: "pointer", transition: "all 0.15s",
                    fontFamily: "'Nunito',sans-serif",
                  }}>{s.label}</button>
                ))}
              </div>
            </div>
            <textarea value={ep.notes} onChange={(e) => edit(ep.id, "notes", e.target.value)}
              placeholder="สรุปเนื้อหาตอนนี้…" rows={2}
              style={{ width: "100%", fontSize: 12.5, color: theme.inkSoft, background: "transparent", border: "none", outline: "none", lineHeight: 1.6, resize: "vertical", fontFamily: "'Nunito',sans-serif" }} />
          </div>
          <button onClick={() => remove(ep.id)} className="btn-pop"
            style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "#ccc", fontSize: 12, padding: 5, cursor: "pointer" }}>✕</button>
        </div>
      ))}
      {data.episodes.length === 0 && <p style={{ fontSize: 13, color: theme.inkSoft, padding: "16px 4px" }}>ยังไม่มีตอน เริ่มวางแผนตอนแรกได้เลย</p>}
      <IceBtn variant="ghost" theme={theme} onClick={add} style={{ marginTop: 14 }}>▤ + เพิ่มตอนใหม่</IceBtn>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: CALENDAR
══════════════════════════════════════════ */
function CalendarPanel({ theme, data, update }: { theme: IceCreamTheme; data: Project; update: (u: (p: Project) => Project) => void }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");

  const grid = buildMonthGrid(year, month);
  const events = data.calendar.events || {};

  function shiftMonth(delta: number) {
    let m = month + delta, y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m); setYear(y); setSelectedDay(null);
  }

  function addEvent() {
    if (!selectedDay || !newLabel.trim()) return;
    const key = dateKey(year, month, selectedDay);
    update((prev) => {
      const evs = { ...prev.calendar.events };
      evs[key] = [...(evs[key] || []), { id: uid(), label: newLabel.trim() }];
      return { ...prev, calendar: { ...prev.calendar, events: evs } };
    });
    setNewLabel("");
  }

  function removeEvent(key: string, id: string) {
    update((prev) => {
      const evs = { ...prev.calendar.events };
      evs[key] = (evs[key] || []).filter((e) => e.id !== id);
      if (evs[key].length === 0) delete evs[key];
      return { ...prev, calendar: { ...prev.calendar, events: evs } };
    });
  }

  const isToday = (d: number | null) => d && year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
  const selectedKey = selectedDay ? dateKey(year, month, selectedDay) : null;

  const upcoming = Object.entries(events)
    .flatMap(([key, list]) => list.map((e) => ({ key, ...e })))
    .filter((e) => e.key >= dateKey(today.getFullYear(), today.getMonth(), today.getDate()))
    .sort((a, b) => a.key.localeCompare(b.key)).slice(0, 6);

  return (
    <GlassCard theme={theme}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <IceBtn theme={theme} variant="ghost" onClick={() => shiftMonth(-1)} style={{ padding: "6px 12px", fontSize: 16 }}>‹</IceBtn>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, color: theme.ink, fontWeight: 700 }}>
          {MONTH_TH[month]} {year + 543}
        </div>
        <IceBtn theme={theme} variant="ghost" onClick={() => shiftMonth(1)} style={{ padding: "6px 12px", fontSize: 16 }}>›</IceBtn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
        {WEEKDAY_TH.map((w) => (
          <div key={w} style={{ textAlign: "center", fontSize: 10.5, color: theme.inkSoft, fontFamily: "'Space Mono',monospace", padding: "4px 0" }}>{w}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {grid.map((d, i) => {
          const key = d ? dateKey(year, month, d) : null;
          const hasEvent = key && events[key]?.length;
          const selected = key === selectedKey;
          return (
            <button key={i} disabled={!d} className={d ? "btn-pop" : ""} onClick={() => setSelectedDay(d)}
              style={{
                position: "relative", height: 36, borderRadius: 9, fontSize: 12.5,
                background: selected
                  ? `linear-gradient(135deg, ${data.color}, ${data.color}cc)`
                  : isToday(d) ? theme.primarySoft : "transparent",
                color: selected ? "#fff" : theme.ink,
                fontWeight: isToday(d) ? 700 : 400,
                border: "none", cursor: d ? "pointer" : "default",
                visibility: d ? "visible" : "hidden",
                transition: "all 0.12s",
                fontFamily: "'Nunito',sans-serif",
              }}>
              {d}
              {hasEvent && <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: selected ? "#fff" : data.color }} />}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1.5px solid ${theme.primary}15`, animation: "fadeSlideIn 0.2s ease" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12.5, color: theme.ink, fontWeight: 700, marginBottom: 10 }}>
            {selectedDay} {MONTH_TH[month]} — เหตุการณ์
          </div>
          {(events[selectedKey!] || []).map((e) => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: theme.ink, padding: "5px 0" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: data.color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{e.label}</span>
              <button onClick={() => removeEvent(selectedKey!, e.id)} className="btn-pop"
                style={{ background: "transparent", border: "none", color: "#ccc", fontSize: 11, padding: 4, cursor: "pointer" }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <FInput theme={theme} value={newLabel} onChange={setNewLabel} placeholder="เช่น ส่งต้นฉบับตอนที่ 5" />
            <IceBtn variant="primary" theme={theme} onClick={addEvent} style={{ flexShrink: 0, padding: "8px 14px" }}>เพิ่ม</IceBtn>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1.5px solid ${theme.primary}15` }}>
        <FLabel theme={theme}>กำหนดการที่ใกล้ถึง</FLabel>
        {upcoming.length === 0 && <p style={{ fontSize: 12.5, color: theme.inkSoft }}>ไม่มีกำหนดการที่จะถึง</p>}
        {upcoming.map((e) => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: theme.ink, padding: "5px 0" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: data.color, flexShrink: 0 }} />
            <span style={{ color: theme.inkSoft, fontSize: 10.5, width: 44, flexShrink: 0, fontFamily: "'Space Mono',monospace" }}>{e.key.slice(8, 10)}/{e.key.slice(5, 7)}</span>
            <span>{e.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
