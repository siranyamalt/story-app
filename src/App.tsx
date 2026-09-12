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
  { id: "dashboard", label: "Dashboard", emoji: "⌂" },
  { id: "plan", label: "ตั้งค่านิยาย", emoji: "✎" },
  { id: "characters", label: "ตัวละคร", emoji: "☺" },
  { id: "world", label: "สถานที่", emoji: "🌍" },
  { id: "30day", label: "30-Day Plan", emoji: "▦" },
  { id: "calendar", label: "ปฏิทิน", emoji: "◈" },
  { id: "plot", label: "พล็อต", emoji: "◇" },
  { id: "episodes", label: "Episodes", emoji: "▤" },
  { id: "editor", label: "Writing Editor", emoji: "✎" },
  { id: "todo", label: "To-Do", emoji: "☑" },
];

const EPISODE_STATUS = [
  { id: "not-started", label: "ยังไม่เริ่ม", color: "#9E9E9E" },
  { id: "plot", label: "Plot", color: "#7E57C2" },
  { id: "treatment", label: "Treatment", color: "#26A69A" },
  { id: "writing", label: "กำลังเขียน", color: "#FF9800" },
  { id: "proof", label: "พรูฟ", color: "#E91E63" },
  { id: "done", label: "เสร็จแล้ว", color: "#66BB6A" },
];
const STATUS = EPISODE_STATUS;

const MONTH_TH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const WEEKDAY_TH = ["อา","จ","อ","พ","พฤ","ศ","ส"];

/* ══════════════════════════════════════════
   CHARACTER / PLOT OPTION LISTS
══════════════════════════════════════════ */
const EYE_COLORS = ["ดำ","น้ำตาลเข้ม","น้ำตาลอ่อน","เขียว","ฟ้า","เทา","อำพัน","ม่วง (แฟนตาซี)","แดง (แฟนตาซี)","ทอง (แฟนตาซี)","อื่นๆ"];
const HAIR_COLORS = ["ดำ","น้ำตาลเข้ม","น้ำตาลอ่อน","บลอนด์","แดง/ส้ม","เทา/ขาว","ฟ้า (แฟนตาซี)","ชมพู (แฟนตาซี)","ม่วง (แฟนตาซี)","เงิน (แฟนตาซี)","อื่นๆ"];
const WEAPON_OPTIONS = ["ไม่มี / พลเรือน","ดาบ","มีด/กริช","ธนู","หอก","ปืน","ไม้เท้า/คทา","เวทมนตร์/คาถา","หมัดเปล่า/ศิลปะการต่อสู้","แส้","ขวาน","อาวุธพิเศษ/เฉพาะตัว","อื่นๆ"];
const PLOT_STAGES = ["ปูเรื่อง (Setup)","จุดเปลี่ยนเข้าเรื่อง (Inciting Incident)","ปมขัดแย้งทวีขึ้น (Rising Action)","จุดกึ่งกลางเรื่อง (Midpoint)","จุดพลิกผัน (Plot Twist)","วิกฤตหนักสุด (Dark Moment)","ไคลแมกซ์ (Climax)","คลี่คลาย (Falling Action)","จบเรื่อง (Resolution)"];
const PLOT_TECHNIQUES = ["ปูฉากล่วงหน้า (Foreshadowing)","เบี่ยงเบนความสนใจ (Red Herring)","แขวนตอนจบ (Cliffhanger)","ย้อนอดีต (Flashback)","การประชดของโชคชะตา (Dramatic Irony)","หักมุม (Plot Twist)","ปืนของเชคอฟ (Chekhov's Gun)","สลับมุมมอง (Multiple POV)","ค่อยๆ คลี่คลายช้าๆ (Slow Burn)","เผยความจริงทีละน้อย (Reveal)","อื่นๆ"];

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }

function makeDefaultProject(id: string, name?: string, color?: string) {
  return {
    id, name: name || "โปรเจกต์ใหม่", color: color || "#E91E63",
    createdAt: Date.now(),
    plan: { logline: "", genre: "", audience: "", notes: "", treatmentOverview: "" },
    writingPlan: { startDate: new Date().toISOString().slice(0,10), totalWords: 30000, days: 30, dailyTargets: [] as number[], dailyWords: [] as number[] },
    characters: [] as { id: string; name: string; role: string; desc: string; eyeColor: string; eyeColorOther: string; hairColor: string; hairColorOther: string; weapon: string; weaponOther: string; photo: string }[],
    places: [] as { id: string; name: string; type: string; desc: string }[],
    plot: [] as { id: string; title: string; desc: string; stage: string; technique: string; techniqueOther: string }[],
    episodes: [] as any[],
    todos: [] as { id: string; task: string; done: boolean; due: string; episodeId: string }[],
    calendar: { events: {} as Record<string, { id: string; label: string }[]> },
    onboarded: false,
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


function countWords(text: string): number {
  if (!text?.trim()) return 0;
  try {
    const Segmenter = (Intl as any).Segmenter;
    if (Segmenter) return [...new Segmenter("th",{granularity:"word"}).segment(text)].filter((x:any)=>x.isWordLike).length;
  } catch {}
  return text.trim().split(/\s+/).filter(Boolean).length;
}
function normalizeProject(raw:any,id:string):any {
  const base:any=makeDefaultProject(id,raw?.name,raw?.color);
  const p:any={...base,...raw,
    plan:{...base.plan,...(raw?.plan||{})},
    places:(raw?.places||[]).map((pl:any)=>({id:pl.id||uid(),name:pl.name||"",type:pl.type||"",desc:pl.desc||""})),
    characters:(raw?.characters||[]).map((c:any)=>({id:c.id||uid(),name:c.name||"",role:c.role||"",desc:c.desc||"",
      eyeColor:c.eyeColor||"",eyeColorOther:c.eyeColorOther||"",
      hairColor:c.hairColor||"",hairColorOther:c.hairColorOther||"",
      weapon:c.weapon||"",weaponOther:c.weaponOther||"",photo:c.photo||""})),
    plot:(raw?.plot||[]).map((pl:any)=>({id:pl.id||uid(),title:pl.title||"",desc:pl.desc||"",
      stage:pl.stage||"",technique:pl.technique||"",techniqueOther:pl.techniqueOther||""})),
    todos:(raw?.todos||[]).map((t:any)=>({id:t.id||uid(),task:t.task||"",done:!!t.done,due:t.due||"",episodeId:t.episodeId||""})),
    writingPlan:{...base.writingPlan,...(raw?.writingPlan||{}),dailyWords:[...((raw?.writingPlan||{}).dailyWords||[])]}};
  p.episodes=(raw?.episodes||[]).map((e:any,i:number)=>({
    id:e.id||uid(),title:e.title||`ตอนที่ ${i+1}`,
    status:EPISODE_STATUS.some(s=>s.id===e.status)?e.status:"not-started",
    plot:e.plot||e.notes||"",treatment:e.treatment||"",
    moodboard:(e.moodboard||[]).slice(0,12),
    targetWords:Number(e.targetWords||3000),writtenWords:Number(e.writtenWords||countWords(e.content||"")),
    content:e.content||"",
    scenes:(e.scenes||[]).slice(0,5).map((s:any)=>({id:s.id||uid(),name:s.name||"",detail:s.detail||"",
      targetWords:Number(s.targetWords||0),keyPoint:s.keyPoint||"",cliffhanger:s.cliffhanger||"",
      checklist:s.checklist||[false,false,false]}))
  }));
  return p;
}

/* helper: read a File as base64 data URL, downscaled for storage size */
function fileToDataURL(file: File, maxDim = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio); height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(reader.result as string); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
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

function FInput({ value, onChange, placeholder, theme, style, type }: {
  value: string; onChange: (v: string) => void; placeholder?: string; theme: IceCreamTheme; style?: React.CSSProperties; type?: string;
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
   ONBOARDING WIZARD
   สร้างโปรเจค → ตั้งค่านิยาย → ตัวละคร → สถานที่ → แพลน → เริ่มเขียน Treatment
══════════════════════════════════════════ */
const WIZARD_STEPS = [
  { id: "settings", label: "ตั้งค่านิยาย", emoji: "✎" },
  { id: "characters", label: "ตัวละคร", emoji: "☺" },
  { id: "world", label: "สถานที่", emoji: "🌍" },
  { id: "plan", label: "วางแพลน", emoji: "▦" },
  { id: "treatment", label: "Treatment", emoji: "📝" },
];

function OnboardingWizard({ theme, data, update, onRename, onFinish, onSkip }: {
  theme: IceCreamTheme; data: Project;
  update: (u: (p: Project) => Project) => void;
  onRename: (n: string) => void;
  onFinish: (finalTab: string) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState(0);
  const [draftName, setDraftName] = useState(data.name);
  useEffect(() => { setDraftName(data.name); }, [data.id]);
  const last = step === WIZARD_STEPS.length - 1;

  function addCharacter() { update((prev) => ({ ...prev, characters: [...prev.characters, { id: uid(), name: "ตัวละครใหม่", role: "", desc: "", eyeColor: "", eyeColorOther: "", hairColor: "", hairColorOther: "", weapon: "", weaponOther: "", photo: "" }] })); }
  function editCharacter(id: string, field: string, value: any) { update((prev) => ({ ...prev, characters: prev.characters.map((c) => c.id === id ? { ...c, [field]: value } : c) })); }
  function removeCharacter(id: string) { update((prev) => ({ ...prev, characters: prev.characters.filter((c) => c.id !== id) })); }

  function addPlace() { update((prev: any) => ({ ...prev, places: [...(prev.places || []), { id: uid(), name: "สถานที่ใหม่", type: "", desc: "" }] })); }
  function editPlace(id: string, field: string, value: string) { update((prev: any) => ({ ...prev, places: (prev.places || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p) })); }
  function removePlace(id: string) { update((prev: any) => ({ ...prev, places: (prev.places || []).filter((p: any) => p.id !== id) })); }

  function setPlan(field: string, value: string) { update((prev) => ({ ...prev, plan: { ...prev.plan, [field]: value } })); }
  function setWritingPlan(field: string, value: any) { update((prev) => ({ ...prev, writingPlan: { ...prev.writingPlan, [field]: value } })); }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(30,20,30,0.42)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, animation: "fadeSlideIn 0.2s ease",
    }}>
      <div style={{ width: "100%", maxWidth: 620, maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
        <GlassCard theme={theme} style={{ display: "flex", flexDirection: "column", maxHeight: "92vh" }}>
          {/* header + step dots */}
          <div style={{ marginBottom: 16, flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontFamily: "'Space Mono',monospace", fontSize: 17, color: theme.ink, margin: 0 }}>
                {theme.emoji} เริ่มต้นเรื่องใหม่
              </h2>
              <button onClick={onSkip} className="btn-pop"
                style={{ background: "transparent", border: "none", color: theme.inkSoft, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                ข้ามไปทำทีหลัง
              </button>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {WIZARD_STEPS.map((s, i) => (
                <div key={s.id} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    height: 5, borderRadius: 99, marginBottom: 6,
                    background: i <= step ? data.color : `${theme.primary}20`,
                    transition: "background 0.25s",
                  }} />
                  <div style={{ fontSize: 10, color: i === step ? theme.ink : theme.inkSoft, fontWeight: i === step ? 800 : 500, whiteSpace: "nowrap" }}>
                    {s.emoji} {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* step body */}
          <div style={{ overflowY: "auto", flex: 1, paddingRight: 2 }}>
            {step === 0 && (
              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <FLabel theme={theme}>ชื่อเรื่อง</FLabel>
                  <input
                    value={draftName} placeholder="ชื่อนิยายของคุณ"
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={() => draftName.trim() && onRename(draftName.trim())}
                    style={{
                      width: "100%", fontSize: 13.5, color: theme.ink, padding: "9px 12px",
                      borderRadius: 10, border: `1.5px solid ${theme.primary}25`,
                      background: "rgba(255,255,255,0.75)", outline: "none",
                      fontFamily: "'Nunito',sans-serif",
                    }}
                  />
                </div>
                <div>
                  <FLabel theme={theme}>โลจไลน์</FLabel>
                  <FTextarea theme={theme} rows={2} value={data.plan.logline} onChange={(v) => setPlan("logline", v)}
                    placeholder="สรุปเรื่องในหนึ่งประโยค…" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <FLabel theme={theme}>แนวเรื่อง</FLabel>
                    <FInput theme={theme} value={data.plan.genre} onChange={(v) => setPlan("genre", v)} placeholder="แฟนตาซี, ดราม่า…" />
                  </div>
                  <div>
                    <FLabel theme={theme}>กลุ่มผู้อ่าน</FLabel>
                    <FInput theme={theme} value={data.plan.audience} onChange={(v) => setPlan("audience", v)} placeholder="วัยรุ่น, ผู้ใหญ่…" />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: theme.inkSoft, margin: 0 }}>ข้อมูลเหล่านี้แก้ไขเพิ่มเติมได้ตลอดในแท็บ "ตั้งค่านิยาย"</p>
              </div>
            )}

            {step === 1 && (
              <div>
                <p style={{ fontSize: 12.5, color: theme.inkSoft, marginTop: 0 }}>เพิ่มตัวละครหลักไว้ก่อน 2–3 คน แก้ไขเพิ่มเติมทีหลังได้เสมอ</p>
                <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                  {data.characters.map((c) => (
                    <div key={c.id} style={{ display: "flex", gap: 6, alignItems: "flex-start", background: "rgba(255,255,255,0.6)", border: `1.5px solid ${theme.primary}20`, borderRadius: 12, padding: 8 }}>
                      <div style={{ flex: 1, display: "grid", gap: 5 }}>
                        <input value={c.name} onChange={(e) => editCharacter(c.id, "name", e.target.value)} placeholder="ชื่อตัวละคร"
                          style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13, color: theme.ink, border: "none", outline: "none", background: "transparent" }} />
                        <input value={c.role} onChange={(e) => editCharacter(c.id, "role", e.target.value)} placeholder="บทบาท เช่น ตัวเอก"
                          style={{ fontSize: 11.5, color: data.color, fontWeight: 700, border: "none", outline: "none", background: "transparent" }} />
                      </div>
                      <button onClick={() => removeCharacter(c.id)} className="btn-pop" style={{ background: "transparent", border: "none", color: "#ccc", cursor: "pointer" }}>✕</button>
                    </div>
                  ))}
                </div>
                <IceBtn variant="ghost" theme={theme} onClick={addCharacter}>☺ + เพิ่มตัวละคร</IceBtn>
              </div>
            )}

            {step === 2 && (
              <div>
                <p style={{ fontSize: 12.5, color: theme.inkSoft, marginTop: 0 }}>เพิ่มสถานที่หลักที่เรื่องจะเกิดขึ้น</p>
                <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                  {(data.places || []).map((p: any) => (
                    <div key={p.id} style={{ display: "flex", gap: 6, alignItems: "flex-start", background: "rgba(255,255,255,0.6)", border: `1.5px solid ${theme.primary}20`, borderRadius: 12, padding: 8 }}>
                      <div style={{ flex: 1, display: "grid", gap: 5 }}>
                        <input value={p.name} onChange={(e) => editPlace(p.id, "name", e.target.value)} placeholder="ชื่อสถานที่"
                          style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13, color: theme.ink, border: "none", outline: "none", background: "transparent" }} />
                        <input value={p.type} onChange={(e) => editPlace(p.id, "type", e.target.value)} placeholder="ประเภท เช่น เมือง, โรงเรียน"
                          style={{ fontSize: 11.5, color: data.color, fontWeight: 700, border: "none", outline: "none", background: "transparent" }} />
                      </div>
                      <button onClick={() => removePlace(p.id)} className="btn-pop" style={{ background: "transparent", border: "none", color: "#ccc", cursor: "pointer" }}>✕</button>
                    </div>
                  ))}
                </div>
                <IceBtn variant="ghost" theme={theme} onClick={addPlace}>🌍 + เพิ่มสถานที่</IceBtn>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "grid", gap: 14 }}>
                <p style={{ fontSize: 12.5, color: theme.inkSoft, margin: 0 }}>ตั้งเป้าหมาย 30 วันคร่าวๆ ปรับละเอียดได้ในแท็บ "30-Day Plan"</p>
                <div>
                  <FLabel theme={theme}>วันเริ่มต้น</FLabel>
                  <input type="date" value={data.writingPlan.startDate} onChange={(e) => setWritingPlan("startDate", e.target.value)}
                    style={{ width: "100%", fontSize: 13.5, color: theme.ink, padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${theme.primary}25`, background: "rgba(255,255,255,0.75)", outline: "none", fontFamily: "'Nunito',sans-serif" }} />
                </div>
                <div>
                  <FLabel theme={theme}>เป้าหมายคำทั้งหมด (30 วัน)</FLabel>
                  <FInput theme={theme} type="number" value={String(data.writingPlan.totalWords)}
                    onChange={(v) => setWritingPlan("totalWords", Math.max(0, Number(v) || 0))} placeholder="30000" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <p style={{ fontSize: 12.5, color: theme.inkSoft, marginTop: 0 }}>สรุปเรื่องราวภาพรวมก่อนเริ่มแตกเป็นรายตอน — เขียนคร่าวๆ ก็ได้ แก้ไขต่อได้เสมอ</p>
                <FTextarea theme={theme} rows={10} value={data.plan.treatmentOverview || ""} onChange={(v) => setPlan("treatmentOverview", v)}
                  placeholder="ภาพรวมเรื่อง: จุดเริ่มต้น ความขัดแย้งหลัก จุดพลิกผัน และตอนจบ…" />
              </div>
            )}
          </div>

          {/* nav buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexShrink: 0 }}>
            <IceBtn variant="outline" theme={theme} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>‹ ย้อนกลับ</IceBtn>
            <div style={{ flex: 1 }} />
            {!last ? (
              <IceBtn variant="primary" theme={theme} onClick={() => setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1))}>ถัดไป ›</IceBtn>
            ) : (
              <IceBtn variant="primary" theme={theme} onClick={() => onFinish("plan")}>🚀 เริ่มเขียน Treatment</IceBtn>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
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
  const [showWizard, setShowWizard] = useState(false);
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
      setProjectData(normalizeProject(data || makeDefaultProject(selectedId), selectedId));
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
    setShowCreate(false); setActiveTab("dashboard");
    setShowWizard(true);
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
                onOpenWizard={() => setShowWizard(true)}
              />
            )}
          </main>
        </div>
      </div>

      {showWizard && projectData && (
        <OnboardingWizard
          theme={theme}
          data={projectData}
          update={updateProjectData}
          onRename={renameProject}
          onSkip={() => { updateProjectData((p) => ({ ...p, onboarded: true })); setShowWizard(false); }}
          onFinish={(finalTab) => {
            updateProjectData((p) => ({ ...p, onboarded: true }));
            setShowWizard(false);
            setActiveTab(finalTab);
          }}
        />
      )}

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
function ProjectView({ theme, data, update, activeTab, setActiveTab, savingState, onRename, onOpenWizard }: {
  theme: IceCreamTheme; data: Project;
  update: (u: (p: Project) => Project) => void;
  activeTab: string; setActiveTab: (t: string) => void;
  savingState: string; onRename: (n: string) => void;
  onOpenWizard?: () => void;
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
        {activeTab === "dashboard" && <DashboardPanel theme={theme} data={data} update={update} setActiveTab={setActiveTab} onOpenWizard={onOpenWizard} />}
        {activeTab === "30day" && <ThirtyDayPanel theme={theme} data={data} update={update} />}
        {activeTab === "editor" && <WritingEditorPanel theme={theme} data={data} update={update} />}
        {activeTab === "characters" && <CharactersPanel theme={theme} data={data} update={update} />}
        {activeTab === "world" && <WorldPanel theme={theme} data={data} update={update} />}
        {activeTab === "plan" && <PlanPanel theme={theme} data={data} update={update} />}
        {activeTab === "calendar" && <CalendarPanel theme={theme} data={data} update={update} />}
        {activeTab === "plot" && <PlotPanel theme={theme} data={data} update={update} />}
        {activeTab === "episodes" && <EpisodesPanel theme={theme} data={data} update={update} />}
        {activeTab === "todo" && <TodoPanel theme={theme} data={data} update={update} />}
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
      <div style={{ marginBottom: 18 }}>
        <FLabel theme={theme}>บันทึกแพลนโดยรวม</FLabel>
        <FTextarea theme={theme} rows={9} value={data.plan.notes} onChange={(v) => set("notes", v)}
          placeholder="เขียนแผนการเล่าเรื่อง โทนของงาน…" />
      </div>
      <div>
        <FLabel theme={theme}>ภาพรวม Treatment</FLabel>
        <FTextarea theme={theme} rows={10} value={data.plan.treatmentOverview || ""} onChange={(v) => set("treatmentOverview", v)}
          placeholder="สรุปเรื่องราวตั้งแต่ต้นจนจบ เป็นภาพรวมก่อนแตกเป็นรายตอน…" />
      </div>
    </GlassCard>
  );
}

/* ══════════════════════════════════════════
   PANEL: WORLD (สถานที่)
══════════════════════════════════════════ */
function WorldPanel({ theme, data, update }: { theme: IceCreamTheme; data: Project; update: (u: (p: Project) => Project) => void }) {
  function add() { update((prev: any) => ({ ...prev, places: [...(prev.places || []), { id: uid(), name: "สถานที่ใหม่", type: "", desc: "" }] })); }
  function edit(id: string, field: string, value: string) { update((prev: any) => ({ ...prev, places: (prev.places || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p) })); }
  function remove(id: string) { update((prev: any) => ({ ...prev, places: (prev.places || []).filter((p: any) => p.id !== id) })); }
  const places = data.places || [];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12, marginBottom: 14 }}>
        {places.map((p: any) => (
          <div key={p.id} style={{
            background: theme.glass, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            border: `1.5px solid ${theme.glassBorder}`,
            borderLeft: `5px solid ${data.color}`,
            borderRadius: 16, padding: "12px 12px 12px 10px",
            display: "flex", gap: 8, position: "relative",
            boxShadow: `0 4px 14px ${data.color}18`,
            animation: "fadeSlideIn 0.2s ease",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <input value={p.name} onChange={(e) => edit(p.id, "name", e.target.value)}
                style={{ width: "100%", fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: theme.ink, background: "transparent", border: "none", outline: "none", marginBottom: 3 }} />
              <input value={p.type} onChange={(e) => edit(p.id, "type", e.target.value)}
                placeholder="ประเภท เช่น เมือง, ปราสาท, โรงเรียน"
                style={{ width: "100%", fontSize: 11.5, color: data.color, background: "transparent", border: "none", outline: "none", marginBottom: 6, fontFamily: "'Nunito',sans-serif", fontWeight: 700 }} />
              <textarea value={p.desc} onChange={(e) => edit(p.id, "desc", e.target.value)}
                placeholder="บรรยากาศ รายละเอียดสำคัญ เหตุการณ์ที่เกิดขึ้นที่นี่…" rows={3}
                style={{ width: "100%", fontSize: 12.5, color: theme.inkSoft, background: "transparent", border: "none", outline: "none", lineHeight: 1.6, resize: "vertical", fontFamily: "'Nunito',sans-serif" }} />
            </div>
            <button onClick={() => remove(p.id)} className="btn-pop"
              style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "#ccc", fontSize: 12, padding: 5, cursor: "pointer", borderRadius: 6 }}>✕</button>
          </div>
        ))}
      </div>
      {places.length === 0 && <p style={{ fontSize: 13, color: theme.inkSoft, padding: "16px 4px" }}>ยังไม่มีสถานที่ เริ่มเพิ่มฉากหลักของเรื่องได้เลย</p>}
      <IceBtn variant="ghost" theme={theme} onClick={add}>🌍 + เพิ่มสถานที่</IceBtn>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: CHARACTERS
══════════════════════════════════════════ */
function CharSelect({ theme, label, value, otherValue, options, onChange, onOtherChange }: {
  theme: IceCreamTheme; label: string; value: string; otherValue: string; options: string[];
  onChange: (v: string) => void; onOtherChange: (v: string) => void;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, color: theme.inkSoft, marginBottom: 2, fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", fontSize: 11.5, padding: "5px 6px", borderRadius: 8, border: `1px solid ${theme.primary}22`, background: theme.glass, color: theme.ink, fontFamily: "'Nunito',sans-serif" }}>
        <option value="">— เลือก —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {value === "อื่นๆ" && (
        <input value={otherValue} onChange={(e) => onOtherChange(e.target.value)} placeholder="ระบุเอง…"
          style={{ width: "100%", fontSize: 11.5, marginTop: 4, padding: "5px 6px", borderRadius: 8, border: `1px solid ${theme.primary}22`, background: "transparent", color: theme.ink, fontFamily: "'Nunito',sans-serif" }} />
      )}
    </div>
  );
}

function CharactersPanel({ theme, data, update }: { theme: IceCreamTheme; data: Project; update: (u: (p: Project) => Project) => void }) {
  function add() { update((prev) => ({ ...prev, characters: [...prev.characters, { id: uid(), name: "ตัวละครใหม่", role: "", desc: "", eyeColor: "", eyeColorOther: "", hairColor: "", hairColorOther: "", weapon: "", weaponOther: "", photo: "" } as any] })); }
  function edit(id: string, field: string, value: any) { update((prev) => ({ ...prev, characters: prev.characters.map((c) => c.id === id ? { ...c, [field]: value } : c) })); }
  function remove(id: string) { update((prev) => ({ ...prev, characters: prev.characters.filter((c) => c.id !== id) })); }
  async function onPhoto(id: string, file?: File) {
    if (!file) return;
    const dataUrl = await fileToDataURL(file, 480);
    edit(id, "photo", dataUrl);
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12, marginBottom: 14 }}>
        {data.characters.map((c: any) => (
          <div key={c.id} style={{
            background: theme.glass, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            border: `1.5px solid ${theme.glassBorder}`,
            borderLeft: `5px solid ${data.color}`,
            borderRadius: 16, padding: "12px 12px 12px 10px",
            display: "flex", flexDirection: "column", gap: 8, position: "relative",
            boxShadow: `0 4px 14px ${data.color}18`,
            animation: "fadeSlideIn 0.2s ease",
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              <label style={{ flexShrink: 0, cursor: "pointer" }}>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onPhoto(c.id, e.target.files?.[0])} />
                {c.photo ? (
                  <img src={c.photo} alt={c.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", border: `1.5px solid ${data.color}55` }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: theme.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: theme.inkSoft, border: `1.5px dashed ${theme.primary}40` }}>📷</div>
                )}
              </label>
              <div style={{ flex: 1, minWidth: 0 }}>
                <input value={c.name} onChange={(e) => edit(c.id, "name", e.target.value)}
                  style={{ width: "100%", fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: theme.ink, background: "transparent", border: "none", outline: "none", marginBottom: 3 }} />
                <input value={c.role} onChange={(e) => edit(c.id, "role", e.target.value)}
                  placeholder="บทบาท เช่น ตัวเอก"
                  style={{ width: "100%", fontSize: 11.5, color: data.color, background: "transparent", border: "none", outline: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 700 }} />
              </div>
              <button onClick={() => remove(c.id)} className="btn-pop"
                style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "#ccc", fontSize: 12, padding: 5, cursor: "pointer", borderRadius: 6 }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <CharSelect theme={theme} label="สีตา" value={c.eyeColor || ""} otherValue={c.eyeColorOther || ""} options={EYE_COLORS}
                onChange={(v) => edit(c.id, "eyeColor", v)} onOtherChange={(v) => edit(c.id, "eyeColorOther", v)} />
              <CharSelect theme={theme} label="สีผม" value={c.hairColor || ""} otherValue={c.hairColorOther || ""} options={HAIR_COLORS}
                onChange={(v) => edit(c.id, "hairColor", v)} onOtherChange={(v) => edit(c.id, "hairColorOther", v)} />
            </div>
            <CharSelect theme={theme} label="อาวุธ / ของประจำตัว" value={c.weapon || ""} otherValue={c.weaponOther || ""} options={WEAPON_OPTIONS}
              onChange={(v) => edit(c.id, "weapon", v)} onOtherChange={(v) => edit(c.id, "weaponOther", v)} />
            <textarea value={c.desc} onChange={(e) => edit(c.id, "desc", e.target.value)}
              placeholder="ลักษณะนิสัย ภูมิหลัง…" rows={3}
              style={{ width: "100%", fontSize: 12.5, color: theme.inkSoft, background: "transparent", border: "none", outline: "none", lineHeight: 1.6, resize: "vertical", fontFamily: "'Nunito',sans-serif" }} />
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
  function add() { update((prev) => ({ ...prev, plot: [...prev.plot, { id: uid(), title: "จุดสำคัญใหม่", desc: "", stage: "", technique: "", techniqueOther: "" } as any] })); }
  function edit(id: string, field: string, value: any) { update((prev) => ({ ...prev, plot: prev.plot.map((p) => p.id === id ? { ...p, [field]: value } : p) })); }
  function remove(id: string) { update((prev) => ({ ...prev, plot: prev.plot.filter((p) => p.id !== id) })); }
  function reorder(idx: number, dir: number) { update((prev) => ({ ...prev, plot: move(prev.plot, idx, dir) })); }

  return (
    <div>
      {data.plot.map((p: any, idx) => (
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
              style={{ width: "100%", fontFamily: "'Space Mono',monospace", fontSize: 13.5, fontWeight: 700, color: theme.ink, background: "transparent", border: "none", outline: "none", marginBottom: 6 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8, marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 10, color: theme.inkSoft, marginBottom: 2, fontWeight: 700 }}>ช่วงของเรื่อง</div>
                <select value={p.stage || ""} onChange={(e) => edit(p.id, "stage", e.target.value)}
                  style={{ width: "100%", fontSize: 11.5, padding: "5px 6px", borderRadius: 8, border: `1px solid ${theme.primary}22`, background: theme.glass, color: theme.ink, fontFamily: "'Nunito',sans-serif" }}>
                  <option value="">— เลือกช่วง —</option>
                  {PLOT_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: theme.inkSoft, marginBottom: 2, fontWeight: 700 }}>เทคนิคที่ใช้</div>
                <select value={p.technique || ""} onChange={(e) => edit(p.id, "technique", e.target.value)}
                  style={{ width: "100%", fontSize: 11.5, padding: "5px 6px", borderRadius: 8, border: `1px solid ${theme.primary}22`, background: theme.glass, color: theme.ink, fontFamily: "'Nunito',sans-serif" }}>
                  <option value="">— เลือกเทคนิค —</option>
                  {PLOT_TECHNIQUES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {p.technique === "อื่นๆ" && (
                  <input value={p.techniqueOther || ""} onChange={(e) => edit(p.id, "techniqueOther", e.target.value)} placeholder="ระบุเทคนิคเอง…"
                    style={{ width: "100%", fontSize: 11.5, marginTop: 4, padding: "5px 6px", borderRadius: 8, border: `1px solid ${theme.primary}22`, background: "transparent", color: theme.ink, fontFamily: "'Nunito',sans-serif" }} />
                )}
              </div>
            </div>
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

function DashboardPanel({theme,data,update,setActiveTab,onOpenWizard}:{theme:IceCreamTheme;data:Project;update:any;setActiveTab:any;onOpenWizard?:()=>void}) {
  const wp:any=data.writingPlan||{}; const start=new Date(wp.startDate||new Date().toISOString().slice(0,10));
  const elapsed=Math.min(30,Math.max(1,Math.ceil((Date.now()-start.getTime())/86400000)+1)), leftDays=Math.max(0,30-elapsed);
  const written=data.episodes.reduce((n:any,e:any)=>n+Number(e.writtenWords||countWords(e.content||"")),0), target=Number(wp.totalWords||0), left=Math.max(0,target-written);
  const pct=target?Math.min(100,written/target*100):0, todayTarget=leftDays?Math.ceil(left/leftDays):left;
  const expected=Math.ceil(target/30)*elapsed, status=written>expected?"นำหน้าแผน":written>=expected?"ตามแผน":"ช้ากว่าแผน";
  const current=data.episodes.find((e:any)=>e.status==="writing")||data.episodes.find((e:any)=>e.writtenWords>0);
  const streak=Math.min(elapsed,Math.floor(written/Math.max(1,Math.ceil(target/30))));
  const cards=[[`วันที่ ${elapsed} / 30`,"ความคืบหน้า"],[`${leftDays} วัน`,"วันที่เหลือ"],[target.toLocaleString()+" คำ","เป้าหมายคำทั้งหมด"],[written.toLocaleString()+" / "+left.toLocaleString(),"เขียนแล้ว / เหลือ"],[pct.toFixed(0)+"%","Progress"],[todayTarget.toLocaleString()+" คำ","เป้าหมายคำวันนี้"],[current?.title||"—","ตอนปัจจุบัน"],[`🔥 ${streak}`,"Writing Streak"]];
  return <div>
  {onOpenWizard && <GlassCard theme={theme} style={{marginBottom:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
    <span style={{fontSize:13,color:theme.ink}}>🧭 ไม่แน่ใจว่าจะเริ่มตรงไหน? ทำตามขั้นตอนตั้งค่านิยาย → ตัวละคร → สถานที่ → แพลน → treatment ได้อีกครั้ง</span>
    <IceBtn theme={theme} variant="primary" onClick={onOpenWizard} style={{marginLeft:"auto"}}>เปิดสเต็ปตั้งค่า</IceBtn>
  </GlassCard>}
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
    {cards.map(([v,l])=><div key={l} style={{background:theme.glass,border:`1.5px solid ${theme.glassBorder}`,borderRadius:16,padding:15}}><b style={{fontFamily:"'Space Mono',monospace",fontSize:16,color:theme.ink}}>{v}</b><div style={{fontSize:11,color:theme.inkSoft,marginTop:5}}>{l}</div></div>)}
  </div><GlassCard theme={theme} style={{marginTop:12}}><FLabel theme={theme}>สถานะ</FLabel><div style={{fontSize:22,fontWeight:800,color:status==="ช้ากว่าแผน"?"#E91E63":"#26A69A"}}>{status}</div><div style={{height:9,background:`${theme.primary}16`,borderRadius:99,marginTop:12}}><div style={{width:`${pct}%`,height:"100%",background:data.color,borderRadius:99}}/></div><div style={{display:"flex",gap:8,marginTop:14}}><IceBtn theme={theme} onClick={()=>setActiveTab("30day")}>▦ 30-Day Plan</IceBtn><IceBtn theme={theme} variant="ghost" onClick={()=>setActiveTab("episodes")}>▤ Episodes</IceBtn></div></GlassCard></div>;
}

function ThirtyDayPanel({theme,data,update}:{theme:IceCreamTheme;data:Project;update:any}) {
  const wp:any=data.writingPlan||{}; const target=Number(wp.totalWords||30000), days=wp.dailyTargets?.length===30?wp.dailyTargets:Array(30).fill(Math.ceil(target/30));
  const start=wp.startDate||new Date().toISOString().slice(0,10);
  const dailyWords=wp.dailyWords||[];
  const totalActual=dailyWords.reduce((n:number,v:any)=>n+Number(v||0),0);
  const totalTarget=days.reduce((n:number,v:number)=>n+Number(v||0),0);
  function setActual(i:number,v:number){
    update((p:any)=>{const arr=[...(p.writingPlan.dailyWords||[])];arr[i]=Math.max(0,v);return {...p,writingPlan:{...p.writingPlan,dailyWords:arr}}});
  }
  return <GlassCard theme={theme}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10,marginBottom:14}}>
    <div><FLabel theme={theme}>วันเริ่มต้น</FLabel><FInput theme={theme} value={start} onChange={(v)=>update((p:any)=>({...p,writingPlan:{...p.writingPlan,startDate:v}}))}/></div>
    <div><FLabel theme={theme}>เป้าหมายคำทั้งหมด</FLabel><FInput theme={theme} value={String(target)} onChange={(v)=>update((p:any)=>({...p,writingPlan:{...p.writingPlan,totalWords:Math.max(0,Number(v)||0),dailyTargets:Array(30).fill(Math.ceil((Number(v)||0)/30))}}))}/></div>
    <div><FLabel theme={theme}>รวมเขียนแล้ว</FLabel><div style={{fontFamily:"'Space Mono',monospace",fontSize:16,fontWeight:800,color:theme.ink,padding:"9px 0"}}>{totalActual.toLocaleString()} / {totalTarget.toLocaleString()} คำ</div></div>
  </div>
  <p style={{fontSize:11.5,color:theme.inkSoft,margin:"0 0 10px"}}>พิมพ์จำนวนคำที่เขียนได้จริงในช่อง "เขียนจริง" ของแต่ละวันเพื่ออัพเดทความคืบหน้า (ถ้าเขียนใน Writing Editor ของแอปนี้ ตัวเลขจะอัพเดทให้อัตโนมัติอยู่แล้ว)</p>
  <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr>{["วัน","วันที่","เป้าหมายคำ","เขียนจริง","สถานะ"].map(x=><th key={x} style={{textAlign:"left",padding:8,color:theme.inkSoft}}>{x}</th>)}</tr></thead><tbody>
  {days.map((t:number,i:number)=>{
    const d=new Date(start);d.setDate(d.getDate()+i);
    const actual=Number(dailyWords[i]||0);
    const isPast=d.getTime()<=Date.now();
    const statusLabel=actual>=t&&t>0?"ทันเป้า":actual>0?"ตามหลัง":isPast?"ยังไม่เขียน":"—";
    const statusColor=actual>=t&&t>0?"#66BB6A":actual>0?"#FF9800":isPast?"#E91E63":theme.inkSoft;
    return <tr key={i} style={{borderTop:`1px solid ${theme.primary}12`}}>
      <td style={{padding:8}}>{i+1}</td>
      <td style={{padding:8}}>{d.toLocaleDateString("th-TH",{day:"2-digit",month:"short"})}</td>
      <td style={{padding:8}}><input type="number" value={t} onChange={e=>update((p:any)=>{const arr=[...(p.writingPlan.dailyTargets?.length===30?p.writingPlan.dailyTargets:days)];arr[i]=Number(e.target.value)||0;return {...p,writingPlan:{...p.writingPlan,dailyTargets:arr}}})} style={{width:90,border:"none",background:"transparent",fontWeight:700,color:theme.ink}}/></td>
      <td style={{padding:8}}><input type="number" value={actual} onChange={e=>setActual(i,Number(e.target.value)||0)} placeholder="0" style={{width:90,border:`1px solid ${theme.primary}22`,borderRadius:8,padding:"4px 8px",background:theme.glass,fontWeight:700,color:theme.ink}}/></td>
      <td style={{padding:8,color:statusColor,fontWeight:700}}>{statusLabel}</td>
    </tr>})}</tbody></table></div></GlassCard>;
}

function EpisodesPanel({theme,data,update}:{theme:IceCreamTheme;data:Project;update:any}) {
  const [selected,setSelected]=useState<string|null>(data.episodes[0]?.id||null), ep:any=data.episodes.find((e:any)=>e.id===selected);
  const edit=(id:string,f:string,v:any)=>update((p:any)=>({...p,episodes:p.episodes.map((e:any)=>e.id===id?{...e,[f]:v}:e)}));
  function add(){update((p:any)=>p.episodes.length>=100?p:{...p,episodes:[...p.episodes,{id:uid(),title:`ตอนที่ ${p.episodes.length+1}`,status:"not-started",plot:"",treatment:"",moodboard:[],targetWords:3000,writtenWords:0,content:"",scenes:Array.from({length:5},()=>({id:uid(),name:"",detail:"",targetWords:0,keyPoint:"",cliffhanger:"",checklist:[false,false,false]}))}]})}
  function remove(id:string){update((p:any)=>({...p,episodes:p.episodes.filter((e:any)=>e.id!==id)}));setSelected(null)}
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:12,color:theme.inkSoft}}>{data.episodes.length} / 100 ตอน</span><IceBtn theme={theme} onClick={add} disabled={data.episodes.length>=100}>＋ เพิ่มตอน</IceBtn></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>{data.episodes.map((e:any,i:number)=><GlassCard key={e.id} theme={theme} style={{cursor:"pointer",border:e.id===selected?`2px solid ${data.color}`:undefined}} onClick={()=>setSelected(e.id)}><div style={{display:"flex",justifyContent:"space-between"}}><b>{i+1}. {e.title}</b><button onClick={(x:any)=>{x.stopPropagation();remove(e.id)}} style={{border:0,background:"transparent",color:"#bbb"}}>✕</button></div><select value={e.status} onChange={x=>edit(e.id,"status",x.target.value)} style={{marginTop:8,padding:5,borderRadius:8}}>{EPISODE_STATUS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select><div style={{fontSize:11,color:theme.inkSoft,marginTop:8}}>{Number(e.writtenWords||countWords(e.content||"")).toLocaleString()} / {Number(e.targetWords||0).toLocaleString()} คำ</div></GlassCard>)}</div>
  {ep&&<EpisodeDetailPanel theme={theme} ep={ep} edit={edit}/>}</div>;
}

function EpisodeDetailPanel({theme,ep,edit}:{theme:IceCreamTheme;ep:any;edit:any}) {
  const sceneEdit=(i:number,f:string,v:any)=>edit(ep.id,"scenes",ep.scenes.map((s:any,j:number)=>j===i?{...s,[f]:v}:s));
  const words=countWords(ep.content||"");
  const moodboard:string[]=ep.moodboard||[];
  async function addMoodboardImages(files: FileList | null) {
    if (!files || !files.length) return;
    const room = Math.max(0, 12 - moodboard.length);
    const picked = Array.from(files).slice(0, room);
    const dataUrls = await Promise.all(picked.map((f) => fileToDataURL(f, 720)));
    edit(ep.id, "moodboard", [...moodboard, ...dataUrls]);
  }
  function removeMoodboardImage(i: number) {
    edit(ep.id, "moodboard", moodboard.filter((_, j) => j !== i));
  }
  return <GlassCard theme={theme} style={{marginTop:14}}><h2 style={{fontFamily:"'Space Mono',monospace",fontSize:16,marginTop:0}}>Episode Detail — {ep.title}</h2><div style={{display:"grid",gap:10}}><FInput theme={theme} value={ep.title} onChange={(v)=>edit(ep.id,"title",v)} placeholder="ชื่อตอน"/><FTextarea theme={theme} rows={3} value={ep.plot} onChange={(v)=>edit(ep.id,"plot",v)} placeholder="Plot"/><FTextarea theme={theme} rows={4} value={ep.treatment} onChange={(v)=>edit(ep.id,"treatment",v)} placeholder="Treatment"/>
  <div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
      <FLabel theme={theme}>มูดบอร์ด (Mood Board)</FLabel>
      <span style={{fontSize:10.5,color:theme.inkSoft}}>{moodboard.length} / 12 รูป</span>
      <label style={{marginLeft:"auto"}}><input type="file" accept="image/*" multiple style={{display:"none"}} onChange={(e)=>addMoodboardImages(e.target.files)} disabled={moodboard.length>=12}/>
        <span className="btn-pop" style={{display:"inline-block",fontSize:11,padding:"5px 10px",borderRadius:20,cursor:moodboard.length>=12?"default":"pointer",background:theme.primarySoft,color:theme.primary,fontWeight:700,opacity:moodboard.length>=12?0.5:1}}>🖼 + เพิ่มรูป</span>
      </label>
    </div>
    {moodboard.length>0 ? (
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:8}}>
        {moodboard.map((src,i)=>(
          <div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",border:`1.5px solid ${theme.glassBorder}`}}>
            <img src={src} alt={`mood ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            <button onClick={()=>removeMoodboardImage(i)} className="btn-pop"
              style={{position:"absolute",top:2,right:2,width:18,height:18,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:10,cursor:"pointer",lineHeight:"18px",padding:0}}>✕</button>
          </div>
        ))}
      </div>
    ) : <p style={{fontSize:11.5,color:theme.inkSoft,margin:0}}>ยังไม่มีรูปมูดบอร์ด — อัพโหลดภาพบรรยากาศ อ้างอิงฉาก หรือภาพตัวละครสำหรับตอนนี้ได้</p>}
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
    <div><FLabel theme={theme}>เป้าหมายคำ</FLabel><FInput theme={theme} type="number" value={String(ep.targetWords)} onChange={(v)=>edit(ep.id,"targetWords",Number(v)||0)} placeholder="เป้าหมายคำ"/></div>
    <div><FLabel theme={theme}>เขียนแล้ว (คำ)</FLabel><FInput theme={theme} type="number" value={String(ep.writtenWords||words)} onChange={(v)=>edit(ep.id,"writtenWords",Number(v)||0)} placeholder="อัพเดทจำนวนคำที่เขียนได้"/></div>
  </div>
  {words>0 && Number(ep.writtenWords||0)!==words && <p style={{fontSize:11,color:theme.inkSoft,margin:0}}>* ในช่อง Writing Editor นับได้ {words.toLocaleString()} คำ — แก้ตัวเลข "เขียนแล้ว" ด้านบนได้เองถ้าต้องการนับต่างจากนี้</p>}
  {ep.scenes.slice(0,5).map((s:any,i:number)=><div key={s.id} style={{padding:10,border:`1px solid ${theme.primary}18`,borderRadius:12}}><b>Scene {i+1}</b><FInput theme={theme} value={s.name} onChange={v=>sceneEdit(i,"name",v)} placeholder="ชื่อ Scene"/><FTextarea theme={theme} rows={2} value={s.detail} onChange={v=>sceneEdit(i,"detail",v)} placeholder="รายละเอียด Scene"/><FInput theme={theme} value={s.keyPoint} onChange={v=>sceneEdit(i,"keyPoint",v)} placeholder="Key Point"/><FInput theme={theme} value={s.cliffhanger} onChange={v=>sceneEdit(i,"cliffhanger",v)} placeholder="Cliffhanger"/><label style={{fontSize:11}}><input type="checkbox" checked={!!s.checklist?.[0]} onChange={e=>{const c=[...(s.checklist||[false,false,false])];c[0]=e.target.checked;sceneEdit(i,"checklist",c)}}/> Scene พร้อม</label></div>)}</div></GlassCard>;
}

function WritingEditorPanel({theme,data,update}:{theme:IceCreamTheme;data:Project;update:any}) {
  const [id,setId]=useState<string|null>(data.episodes[0]?.id||null), [focus,setFocus]=useState(false); const ep:any=data.episodes.find((e:any)=>e.id===id);
  if(!ep)return <GlassCard theme={theme}><p style={{color:theme.inkSoft}}>เพิ่มตอนก่อนเริ่มเขียน</p></GlassCard>;
  const words=countWords(ep.content||""), pct=ep.targetWords?Math.min(100,words/ep.targetWords*100):0;
  const save=(v:string)=>update((p:any)=>{const words=countWords(v);const arr=[...(p.writingPlan?.dailyWords||[])];const d=Math.min(29,Math.max(0,Math.floor((Date.now()-new Date(p.writingPlan.startDate).getTime())/86400000)));const previous=countWords(ep.content||"");arr[d]=Math.max(0,Number(arr[d]||0)+(words-previous));return {...p,writingPlan:{...p.writingPlan,dailyWords:arr},episodes:p.episodes.map((e:any)=>e.id===ep.id?{...e,content:v,writtenWords:words,status:e.status==="not-started"?"writing":e.status}:e)}});
  return <div style={focus?{position:"fixed",inset:0,zIndex:10000,padding:24,background:theme.bgFrom,overflow:"auto"}:{}}><GlassCard theme={theme} style={{maxWidth:1000,margin:"0 auto",minHeight:focus?"calc(100vh - 48px)":600}}><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><select value={ep.id} onChange={e=>setId(e.target.value)}>{data.episodes.map((e:any)=><option key={e.id} value={e.id}>{e.title}</option>)}</select><span style={{fontSize:12,color:theme.inkSoft}}>{words.toLocaleString()} / {Number(ep.targetWords||0).toLocaleString()} คำ • {pct.toFixed(0)}%</span><span style={{marginLeft:"auto",fontSize:11,color:theme.inkSoft}}>● Autosave</span><IceBtn theme={theme} variant="ghost" onClick={()=>setFocus(!focus)}>{focus?"ออกจาก Focus":"Focus"}</IceBtn></div><div style={{height:7,background:`${theme.primary}14`,borderRadius:99,margin:"10px 0"}}><div style={{width:`${pct}%`,height:"100%",background:data.color,borderRadius:99}}/></div><textarea value={ep.content||""} onChange={e=>save(e.target.value)} placeholder="เริ่มเขียนนิยาย…" style={{width:"100%",minHeight:focus?"calc(100vh - 180px)":500,border:0,outline:0,resize:"vertical",background:"transparent",color:theme.ink,fontSize:16,lineHeight:2,fontFamily:"'Nunito',sans-serif"}}/></GlassCard></div>;
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

/* ══════════════════════════════════════════
   PANEL: TO-DO LIST
══════════════════════════════════════════ */
function TodoPanel({ theme, data, update }: { theme: IceCreamTheme; data: Project; update: (u: (p: Project) => Project) => void }) {
  const [newTask, setNewTask] = useState("");
  const [hideDone, setHideDone] = useState(false);
  const todos: any[] = (data as any).todos || [];

  function add() {
    if (!newTask.trim()) return;
    update((prev: any) => ({ ...prev, todos: [...(prev.todos || []), { id: uid(), task: newTask.trim(), done: false, due: "", episodeId: "" }] }));
    setNewTask("");
  }
  function edit(id: string, field: string, value: any) {
    update((prev: any) => ({ ...prev, todos: (prev.todos || []).map((t: any) => t.id === id ? { ...t, [field]: value } : t) }));
  }
  function remove(id: string) {
    update((prev: any) => ({ ...prev, todos: (prev.todos || []).filter((t: any) => t.id !== id) }));
  }

  const today = new Date().toISOString().slice(0, 10);
  const visible = todos.filter((t) => !hideDone || !t.done);
  const doneCount = todos.filter((t) => t.done).length;

  return (
    <GlassCard theme={theme}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <FInput theme={theme} value={newTask} onChange={setNewTask} placeholder="เพิ่มงานใหม่ เช่น ส่งต้นฉบับตอนที่ 5 ให้บก." />
        <IceBtn theme={theme} variant="primary" onClick={add} style={{ flexShrink: 0 }}>＋ เพิ่ม</IceBtn>
        <label style={{ marginLeft: "auto", fontSize: 12, color: theme.inkSoft, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} /> ซ่อนงานที่เสร็จแล้ว
        </label>
      </div>

      <div style={{ fontSize: 12, color: theme.inkSoft, marginBottom: 8 }}>เสร็จแล้ว {doneCount} / {todos.length} งาน</div>

      {visible.length === 0 && <p style={{ fontSize: 13, color: theme.inkSoft, padding: "16px 4px" }}>ยังไม่มีงานในเช็คลิสต์ ลองเพิ่มงานแรกดูสิ</p>}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr>{["", "งาน", "ตอนที่เกี่ยวข้อง", "กำหนดส่ง", ""].map((x, i) => <th key={i} style={{ textAlign: "left", padding: 8, color: theme.inkSoft, fontWeight: 700 }}>{x}</th>)}</tr>
          </thead>
          <tbody>
            {visible.map((t) => {
              const overdue = !t.done && t.due && t.due < today;
              return (
                <tr key={t.id} style={{ borderTop: `1px solid ${theme.primary}12`, opacity: t.done ? 0.55 : 1 }}>
                  <td style={{ padding: 8 }}>
                    <input type="checkbox" checked={!!t.done} onChange={(e) => edit(t.id, "done", e.target.checked)} />
                  </td>
                  <td style={{ padding: 8, minWidth: 160 }}>
                    <input value={t.task} onChange={(e) => edit(t.id, "task", e.target.value)}
                      style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: theme.ink, fontFamily: "'Nunito',sans-serif", textDecoration: t.done ? "line-through" : "none" }} />
                  </td>
                  <td style={{ padding: 8, minWidth: 140 }}>
                    <select value={t.episodeId || ""} onChange={(e) => edit(t.id, "episodeId", e.target.value)}
                      style={{ fontSize: 11.5, padding: "4px 6px", borderRadius: 8, border: `1px solid ${theme.primary}22`, background: theme.glass, color: theme.ink }}>
                      <option value="">— ไม่ระบุ —</option>
                      {data.episodes.map((ep: any) => <option key={ep.id} value={ep.id}>{ep.title}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: 8 }}>
                    <input type="date" value={t.due || ""} onChange={(e) => edit(t.id, "due", e.target.value)}
                      style={{ fontSize: 11.5, padding: "4px 6px", borderRadius: 8, border: `1px solid ${overdue ? "#E91E63" : theme.primary + "22"}`, background: "transparent", color: overdue ? "#E91E63" : theme.ink }} />
                  </td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => remove(t.id)} className="btn-pop"
                      style={{ background: "transparent", border: "none", color: "#ccc", fontSize: 12, padding: 4, cursor: "pointer" }}>✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
