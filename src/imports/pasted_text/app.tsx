import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const PALETTE = [
  "#8A4A3A", "#3E6259", "#4A5C7A", "#8C6E45",
  "#6B4C6E", "#5C6B4A", "#3E5C6B", "#7A5C3E",
];

const TABS = [
  { id: "characters", label: "ตัวละคร", icon: "☺" },
  { id: "plan",       label: "แพลน",    icon: "✎" },
  { id: "calendar",   label: "ปฏิทิน",  icon: "▦" },
  { id: "plot",       label: "พล็อต",   icon: "◇" },
  { id: "episodes",   label: "ตอน",     icon: "▤" },
];

const STATUS = [
  { id: "draft",   label: "ฉบับร่าง", color: "var(--gold)" },
  { id: "editing", label: "กำลังแก้",  color: "var(--brick)" },
  { id: "done",    label: "เสร็จแล้ว", color: "var(--teal)" },
];

const MONTH_TH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const WEEKDAY_TH = ["อา","จ","อ","พ","พฤ","ศ","ส"];

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

function makeDefaultProject(id, name, color) {
  return {
    id,
    name: name || "โปรเจกต์ใหม่",
    color: color || PALETTE[0],
    createdAt: Date.now(),
    plan: { logline: "", genre: "", audience: "", notes: "" },
    characters: [],
    plot: [],
    episodes: [],
    calendar: { events: {} },
  };
}

function buildMonthGrid(year, month) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function move(arr, idx, dir) {
  const target = idx + dir;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[idx], next[target]] = [next[target], next[idx]];
  return next;
}

/* ══════════════════════════════════════════
   STORAGE
══════════════════════════════════════════ */
async function loadIndex() {
  try {
    const res = await window.storage.get("projects-index", false);
    return res ? JSON.parse(res.value) : [];
  } catch {
    return [];
  }
}
async function saveIndex(list) {
  try {
    await window.storage.set("projects-index", JSON.stringify(list), false);
  } catch (e) {
    console.error("save index failed", e);
  }
}
async function loadProjectData(id) {
  try {
    const res = await window.storage.get(`project:${id}`, false);
    return res ? JSON.parse(res.value) : null;
  } catch {
    return null;
  }
}
async function saveProjectData(data) {
  try {
    await window.storage.set(`project:${data.id}`, JSON.stringify(data), false);
  } catch (e) {
    console.error("save project failed", e);
  }
}
async function deleteProjectData(id) {
  try {
    await window.storage.delete(`project:${id}`, false);
  } catch (e) {
    console.error("delete project failed", e);
  }
}

/* ══════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════ */
export default function App() {
  const [projects, setProjects] = useState([]);
  const [indexLoading, setIndexLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("characters");
  const [showCreate, setShowCreate] = useState(false);
  const [savingState, setSavingState] = useState("idle");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const saveTimeout = useRef(null);

  useEffect(() => {
    (async () => {
      const idx = await loadIndex();
      setProjects(idx);
      if (idx.length) setSelectedId(idx[0].id);
      setIndexLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setProjectData(null);
      return;
    }
    (async () => {
      setProjectLoading(true);
      const data = await loadProjectData(selectedId);
      setProjectData(data || makeDefaultProject(selectedId));
      setProjectLoading(false);
    })();
  }, [selectedId]);

  function scheduleSave(data) {
    setSavingState("saving");
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await saveProjectData(data);
      setSavingState("saved");
      setTimeout(() => setSavingState((s) => (s === "saved" ? "idle" : s)), 1400);
    }, 450);
  }

  function updateProjectData(updater) {
    setProjectData((prev) => {
      const next = updater(prev);
      scheduleSave(next);
      return next;
    });
  }

  async function createProject(name, color) {
    const id = uid();
    const item = { id, name: name || "โปรเจกต์ใหม่", color, createdAt: Date.now() };
    const nextIndex = [...projects, item];
    setProjects(nextIndex);
    saveIndex(nextIndex);
    const data = makeDefaultProject(id, item.name, color);
    setSelectedId(id);
    setProjectData(data);
    saveProjectData(data);
    setShowCreate(false);
    setActiveTab("characters");
  }

  function renameProject(name) {
    if (!projectData) return;
    updateProjectData((prev) => ({ ...prev, name }));
    const nextIndex = projects.map((p) => (p.id === selectedId ? { ...p, name } : p));
    setProjects(nextIndex);
    saveIndex(nextIndex);
  }

  function deleteProject(id) {
    const nextIndex = projects.filter((p) => p.id !== id);
    setProjects(nextIndex);
    saveIndex(nextIndex);
    deleteProjectData(id);
    setConfirmDelete(null);
    if (selectedId === id) setSelectedId(nextIndex[0]?.id || null);
  }

  return (
    <div style={S.appRoot} className="story-root">
      <GlobalStyle />
      {indexLoading ? (
        <div style={S.loadingScreen}>กำลังเปิดหิ้งหนังสือ…</div>
      ) : (
        <div style={S.shell} className="story-shell">
          <Sidebar
            projects={projects}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setActiveTab("characters");
            }}
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            onCreate={createProject}
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
            onDelete={deleteProject}
          />
          <main style={S.main} className="story-main">
            {!selectedId && (
              <EmptyState onCreateClick={() => setShowCreate(true)} />
            )}
            {selectedId && (projectLoading || !projectData) && (
              <div style={S.loadingScreen}>กำลังเปิดแฟ้มโปรเจกต์…</div>
            )}
            {selectedId && !projectLoading && projectData && (
              <ProjectView
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
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SIDEBAR — "bookshelf" of project spines
══════════════════════════════════════════ */
function Sidebar({
  projects, selectedId, onSelect, showCreate, setShowCreate,
  onCreate, confirmDelete, setConfirmDelete, onDelete,
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PALETTE[0]);

  function submit() {
    if (!name.trim()) return;
    onCreate(name.trim(), color);
    setName("");
    setColor(PALETTE[(projects.length + 1) % PALETTE.length]);
  }

  return (
    <aside style={S.sidebar} className="story-sidebar">
      <div style={S.sidebarHead}>
        <div style={S.brandMark}>栞</div>
        <div>
          <div style={S.brandTitle}>ชั้นหนังสือ</div>
          <div style={S.brandSub}>แพลนโปรเจกต์ทั้งหมด</div>
        </div>
      </div>

      <div style={S.spineList}>
        {projects.map((p) => (
          <div key={p.id} style={{ position: "relative" }}>
            <button
              className="spine"
              onClick={() => onSelect(p.id)}
              style={{
                ...S.spine,
                background: p.id === selectedId ? "var(--paper-card)" : "transparent",
                transform: p.id === selectedId ? "translateX(6px)" : "translateX(0)",
                boxShadow: p.id === selectedId ? "0 3px 10px rgba(43,38,32,0.12)" : "none",
              }}
            >
              <span style={{ ...S.spineBar, background: p.color }} />
              <span style={{
                ...S.spineLabel,
                color: p.id === selectedId ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: p.id === selectedId ? 600 : 400,
              }}>
                {p.name}
              </span>
            </button>
            {confirmDelete === p.id ? (
              <div style={S.confirmRow}>
                <span>ลบแพลนนี้?</span>
                <button style={S.confirmYes} onClick={() => onDelete(p.id)}>ลบ</button>
                <button style={S.confirmNo} onClick={() => setConfirmDelete(null)}>ยกเลิก</button>
              </div>
            ) : (
              <button
                title="ลบแพลนนี้"
                style={S.spineDelete}
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div style={S.emptySidebarNote}>ยังไม่มีแพลนโปรเจกต์</div>
        )}
      </div>

      {!showCreate ? (
        <button style={S.newProjectBtn} onClick={() => setShowCreate(true)}>
          + สร้างแพลนใหม่
        </button>
      ) : (
        <div style={S.createBox}>
          <input
            autoFocus
            placeholder="ชื่อโปรเจกต์ เช่น ลมเหนือเมฆ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={S.createInput}
          />
          <div style={S.swatchRow}>
            {PALETTE.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  ...S.swatch,
                  background: c,
                  outline: color === c ? "2px solid var(--ink)" : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
          <div style={S.createActions}>
            <button style={S.createConfirm} onClick={submit}>สร้าง</button>
            <button style={S.createCancel} onClick={() => setShowCreate(false)}>ยกเลิก</button>
          </div>
        </div>
      )}
    </aside>
  );
}

function EmptyState({ onCreateClick }) {
  return (
    <div style={S.emptyState}>
      <div style={S.emptyGlyph}>栞</div>
      <div style={S.emptyTitle}>เริ่มเรื่องแรกของคุณ</div>
      <p style={S.emptyBody}>
        สร้างแพลนโปรเจกต์เพื่อเก็บตัวละคร โครงเรื่อง พล็อต ตอน และตารางงานเขียน
        ไว้ในที่เดียวกัน แต่ละโปรเจกต์แยกจากกันโดยสมบูรณ์
      </p>
      <button style={S.emptyBtn} onClick={onCreateClick}>+ สร้างแพลนใหม่</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROJECT VIEW
══════════════════════════════════════════ */
function ProjectView({ data, update, activeTab, setActiveTab, savingState, onRename }) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(data.name);

  useEffect(() => { setDraftName(data.name); }, [data.id]);

  function commitName() {
    setEditingName(false);
    if (draftName.trim() && draftName !== data.name) onRename(draftName.trim());
    else setDraftName(data.name);
  }

  return (
    <div>
      <header style={S.projHeader}>
        <span style={{ ...S.ribbon, background: data.color }} />
        {!editingName ? (
          <h1 style={S.projTitle} onClick={() => setEditingName(true)} title="แตะเพื่อแก้ชื่อ">
            {data.name}
          </h1>
        ) : (
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => e.key === "Enter" && commitName()}
            style={S.projTitleInput}
          />
        )}
        <span style={S.saveIndicator}>
          {savingState === "saving" && "กำลังบันทึก…"}
          {savingState === "saved" && "บันทึกแล้ว ✓"}
        </span>
      </header>

      <nav style={S.tabRow}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              ...S.tabBtn,
              color: activeTab === t.id ? "var(--ink)" : "var(--ink-soft)",
              borderBottomColor: activeTab === t.id ? data.color : "transparent",
              fontWeight: activeTab === t.id ? 600 : 400,
            }}
          >
            <span style={{ marginRight: 6, opacity: 0.75 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <div style={S.panelWrap} key={activeTab}>
        {activeTab === "characters" && <CharactersPanel data={data} update={update} />}
        {activeTab === "plan" && <PlanPanel data={data} update={update} />}
        {activeTab === "calendar" && <CalendarPanel data={data} update={update} />}
        {activeTab === "plot" && <PlotPanel data={data} update={update} />}
        {activeTab === "episodes" && <EpisodesPanel data={data} update={update} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: PLAN
══════════════════════════════════════════ */
function PlanPanel({ data, update }) {
  function set(field, value) {
    update((prev) => ({ ...prev, plan: { ...prev.plan, [field]: value } }));
  }
  return (
    <div style={S.card}>
      <Field label="โลจไลน์ (สรุปเรื่องใน 1-2 ประโยค)">
        <textarea
          rows={2}
          value={data.plan.logline}
          onChange={(e) => set("logline", e.target.value)}
          style={S.textareaPlain}
          placeholder="เด็กสาวผู้สืบทอดร้านหนังสือเก่าค้นพบว่าหนังสือทุกเล่มในร้านคือประตูสู่ความทรงจำของเจ้าของเดิม"
        />
      </Field>
      <div style={S.twoCol}>
        <Field label="แนวเรื่อง">
          <input
            value={data.plan.genre}
            onChange={(e) => set("genre", e.target.value)}
            style={S.inputPlain}
            placeholder="แฟนตาซี, ดราม่า, โรแมนซ์…"
          />
        </Field>
        <Field label="กลุ่มผู้อ่านเป้าหมาย">
          <input
            value={data.plan.audience}
            onChange={(e) => set("audience", e.target.value)}
            style={S.inputPlain}
            placeholder="วัยรุ่น, ผู้ใหญ่ตอนต้น…"
          />
        </Field>
      </div>
      <Field label="บันทึกแพลนโดยรวม">
        <textarea
          rows={10}
          value={data.plan.notes}
          onChange={(e) => set("notes", e.target.value)}
          style={S.ruledTextarea}
          placeholder="เขียนแผนการเล่าเรื่อง โทนของงาน สิ่งที่อยากสื่อ หรือไอเดียที่ยังไม่จัดหมวดหมู่ไว้ตรงนี้…"
        />
      </Field>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={S.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: CHARACTERS
══════════════════════════════════════════ */
function CharactersPanel({ data, update }) {
  function add() {
    update((prev) => ({
      ...prev,
      characters: [...prev.characters, { id: uid(), name: "ตัวละครใหม่", role: "", desc: "" }],
    }));
  }
  function edit(id, field, value) {
    update((prev) => ({
      ...prev,
      characters: prev.characters.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  }
  function remove(id) {
    update((prev) => ({ ...prev, characters: prev.characters.filter((c) => c.id !== id) }));
  }

  return (
    <div>
      <div style={S.grid2}>
        {data.characters.map((c) => (
          <div key={c.id} style={S.charCard}>
            <div style={{ ...S.charAccent, background: data.color }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                value={c.name}
                onChange={(e) => edit(c.id, "name", e.target.value)}
                style={S.charName}
              />
              <input
                value={c.role}
                onChange={(e) => edit(c.id, "role", e.target.value)}
                placeholder="บทบาท เช่น ตัวเอก, คู่ปรับ"
                style={S.charRole}
              />
              <textarea
                value={c.desc}
                onChange={(e) => edit(c.id, "desc", e.target.value)}
                placeholder="ลักษณะนิสัย ภูมิหลัง เป้าหมาย…"
                rows={3}
                style={S.charDesc}
              />
            </div>
            <button style={S.rowDelete} onClick={() => remove(c.id)} title="ลบตัวละคร">✕</button>
          </div>
        ))}
      </div>
      {data.characters.length === 0 && (
        <p style={S.panelEmptyNote}>ยังไม่มีตัวละคร เริ่มเพิ่มตัวเอกของเรื่องได้เลย</p>
      )}
      <button style={S.addBtn} onClick={add}>+ เพิ่มตัวละคร</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: PLOT
══════════════════════════════════════════ */
function PlotPanel({ data, update }) {
  function add() {
    update((prev) => ({
      ...prev,
      plot: [...prev.plot, { id: uid(), title: "จุดสำคัญใหม่", desc: "" }],
    }));
  }
  function edit(id, field, value) {
    update((prev) => ({
      ...prev,
      plot: prev.plot.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }
  function remove(id) {
    update((prev) => ({ ...prev, plot: prev.plot.filter((p) => p.id !== id) }));
  }
  function reorder(idx, dir) {
    update((prev) => ({ ...prev, plot: move(prev.plot, idx, dir) }));
  }

  return (
    <div>
      {data.plot.map((p, idx) => (
        <div key={p.id} style={S.plotRow}>
          <div style={S.plotOrderCol}>
            <button style={S.orderBtn} onClick={() => reorder(idx, -1)} disabled={idx === 0}>▲</button>
            <span style={{ ...S.plotIndex, color: data.color }}>{idx + 1}</span>
            <button style={S.orderBtn} onClick={() => reorder(idx, 1)} disabled={idx === data.plot.length - 1}>▼</button>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={p.title}
              onChange={(e) => edit(p.id, "title", e.target.value)}
              style={S.plotTitle}
            />
            <textarea
              value={p.desc}
              onChange={(e) => edit(p.id, "desc", e.target.value)}
              placeholder="อธิบายเหตุการณ์ ผลกระทบต่อตัวละคร หรือจุดหักมุม…"
              rows={2}
              style={S.plotDesc}
            />
          </div>
          <button style={S.rowDelete} onClick={() => remove(p.id)} title="ลบจุดพล็อต">✕</button>
        </div>
      ))}
      {data.plot.length === 0 && (
        <p style={S.panelEmptyNote}>ยังไม่มีจุดพล็อต ลองเริ่มจาก "จุดเริ่มเรื่อง" หรือ "จุดพลิกผัน"</p>
      )}
      <button style={S.addBtn} onClick={add}>+ เพิ่มจุดพล็อต</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: EPISODES
══════════════════════════════════════════ */
function EpisodesPanel({ data, update }) {
  function add() {
    update((prev) => ({
      ...prev,
      episodes: [...prev.episodes, {
        id: uid(), title: `ตอนที่ ${prev.episodes.length + 1}`, status: "draft", notes: "",
      }],
    }));
  }
  function edit(id, field, value) {
    update((prev) => ({
      ...prev,
      episodes: prev.episodes.map((ep) => (ep.id === id ? { ...ep, [field]: value } : ep)),
    }));
  }
  function remove(id) {
    update((prev) => ({ ...prev, episodes: prev.episodes.filter((ep) => ep.id !== id) }));
  }
  function reorder(idx, dir) {
    update((prev) => ({ ...prev, episodes: move(prev.episodes, idx, dir) }));
  }

  return (
    <div>
      {data.episodes.map((ep, idx) => {
        const st = STATUS.find((s) => s.id === ep.status) || STATUS[0];
        return (
          <div key={ep.id} style={S.epRow}>
            <div style={S.plotOrderCol}>
              <button style={S.orderBtn} onClick={() => reorder(idx, -1)} disabled={idx === 0}>▲</button>
              <button style={S.orderBtn} onClick={() => reorder(idx, 1)} disabled={idx === data.episodes.length - 1}>▼</button>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={S.epTopRow}>
                <input
                  value={ep.title}
                  onChange={(e) => edit(ep.id, "title", e.target.value)}
                  style={S.epTitle}
                />
                <div style={S.statusGroup}>
                  {STATUS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => edit(ep.id, "status", s.id)}
                      style={{
                        ...S.statusChip,
                        background: ep.status === s.id ? `${s.color}` : "transparent",
                        color: ep.status === s.id ? "#FBF8EF" : "var(--ink-soft)",
                        borderColor: s.color,
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={ep.notes}
                onChange={(e) => edit(ep.id, "notes", e.target.value)}
                placeholder="สรุปเนื้อหาตอนนี้ หรือสิ่งที่ต้องแก้…"
                rows={2}
                style={S.epNotes}
              />
            </div>
            <button style={S.rowDelete} onClick={() => remove(ep.id)} title="ลบตอน">✕</button>
          </div>
        );
      })}
      {data.episodes.length === 0 && (
        <p style={S.panelEmptyNote}>ยังไม่มีตอน เริ่มวางแผนตอนแรกได้เลย</p>
      )}
      <button style={S.addBtn} onClick={add}>+ เพิ่มตอนใหม่</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   PANEL: CALENDAR
══════════════════════════════════════════ */
function CalendarPanel({ data, update }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [newLabel, setNewLabel] = useState("");

  const grid = buildMonthGrid(year, month);
  const events = data.calendar.events || {};

  function shiftMonth(delta) {
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

  function removeEvent(key, id) {
    update((prev) => {
      const evs = { ...prev.calendar.events };
      evs[key] = (evs[key] || []).filter((e) => e.id !== id);
      if (evs[key].length === 0) delete evs[key];
      return { ...prev, calendar: { ...prev.calendar, events: evs } };
    });
  }

  const isToday = (d) => d && year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
  const selectedKey = selectedDay ? dateKey(year, month, selectedDay) : null;

  const upcoming = Object.entries(events)
    .flatMap(([key, list]) => list.map((e) => ({ key, ...e })))
    .filter((e) => e.key >= dateKey(today.getFullYear(), today.getMonth(), today.getDate()))
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(0, 6);

  return (
    <div style={S.card}>
      <div style={S.calHeader}>
        <button style={S.calNav} onClick={() => shiftMonth(-1)}>‹</button>
        <div style={S.calMonthLabel}>{MONTH_TH[month]} {year + 543}</div>
        <button style={S.calNav} onClick={() => shiftMonth(1)}>›</button>
      </div>

      <div style={S.calWeekRow}>
        {WEEKDAY_TH.map((w) => <div key={w} style={S.calWeekCell}>{w}</div>)}
      </div>
      <div style={S.calGrid}>
        {grid.map((d, i) => {
          const key = d ? dateKey(year, month, d) : null;
          const hasEvent = key && events[key]?.length;
          const selected = key === selectedKey;
          return (
            <button
              key={i}
              disabled={!d}
              onClick={() => setSelectedDay(d)}
              style={{
                ...S.calDay,
                visibility: d ? "visible" : "hidden",
                background: selected ? "var(--brick)" : isToday(d) ? "var(--brick-soft)" : "transparent",
                color: selected ? "#FBF8EF" : "var(--ink)",
                fontWeight: isToday(d) ? 700 : 400,
              }}
            >
              {d}
              {hasEvent && <span style={{ ...S.calDot, background: selected ? "#FBF8EF" : data.color }} />}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div style={S.calDetail}>
          <div style={S.calDetailTitle}>
            {selectedDay} {MONTH_TH[month]} — เหตุการณ์
          </div>
          {(events[selectedKey] || []).map((e) => (
            <div key={e.id} style={S.calEventItem}>
              <span style={{ ...S.calEventDot, background: data.color }} />
              <span style={{ flex: 1 }}>{e.label}</span>
              <button style={S.rowDeleteSmall} onClick={() => removeEvent(selectedKey, e.id)}>✕</button>
            </div>
          ))}
          <div style={S.calAddRow}>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEvent()}
              placeholder="เช่น ส่งต้นฉบับตอนที่ 5"
              style={S.inputPlain}
            />
            <button style={S.addBtnSmall} onClick={addEvent}>เพิ่ม</button>
          </div>
        </div>
      )}

      <div style={S.upcomingBlock}>
        <div style={S.fieldLabel}>กำหนดการที่ใกล้ถึง</div>
        {upcoming.length === 0 && <p style={S.panelEmptyNote}>ไม่มีกำหนดการที่จะถึง</p>}
        {upcoming.map((e) => (
          <div key={e.id} style={S.upcomingRow}>
            <span style={{ ...S.calEventDot, background: data.color }} />
            <span style={S.upcomingDate}>{e.key.slice(8, 10)}/{e.key.slice(5, 7)}</span>
            <span>{e.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   GLOBAL STYLE
══════════════════════════════════════════ */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600&display=swap');
      .story-root, .story-root * { box-sizing: border-box; font-family: 'IBM Plex Sans Thai', sans-serif; }
      .spine:hover { background: rgba(43,38,32,0.05) !important; }
      button { cursor: pointer; border: none; font-family: inherit; }
      input, textarea { font-family: inherit; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: #D8CBB3; border-radius: 4px; }
      textarea:focus, input:focus { border-color: var(--brick) !important; }
      @media (max-width: 760px) {
        .story-shell { flex-direction: column !important; }
        .story-sidebar { width: 100% !important; flex-direction: row !important; overflow-x: auto; border-right: none !important; border-bottom: 1px solid var(--rule); align-items: center; }
        .story-sidebar > div:first-child { display: none; }
        .story-main { padding: 20px 16px 40px !important; }
      }
    `}</style>
  );
}

/* ══════════════════════════════════════════
   STYLE TOKENS (inline style objects)
══════════════════════════════════════════ */
const vars = {
  "--paper": "#F3EEE1",
  "--paper-card": "#FBF8EF",
  "--ink": "#2B2620",
  "--ink-soft": "#7A7060",
  "--rule": "#DCD0B4",
  "--brick": "#8A4A3A",
  "--brick-soft": "rgba(138,74,58,0.14)",
  "--teal": "#3E6259",
  "--gold": "#B08D57",
};

const S = {
  appRoot: { ...vars, minHeight: "100vh", background: "var(--paper)" },
  loadingScreen: {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: "60vh", color: "var(--ink-soft)", fontSize: 14, letterSpacing: "0.02em",
  },
  shell: { display: "flex", minHeight: "100vh" },

  sidebar: {
    width: 240, flexShrink: 0, background: "var(--paper)",
    borderRight: "1px solid var(--rule)", padding: "20px 12px",
    display: "flex", flexDirection: "column", gap: 14,
  },
  sidebarHead: { display: "flex", alignItems: "center", gap: 10, padding: "0 8px 6px" },
  brandMark: {
    fontFamily: "'Noto Serif Thai', serif", fontSize: 22, color: "var(--brick)",
    width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--paper-card)", borderRadius: "4px 12px 4px 12px", border: "1px solid var(--rule)",
  },
  brandTitle: { fontFamily: "'Noto Serif Thai', serif", fontSize: 14.5, color: "var(--ink)", fontWeight: 600 },
  brandSub: { fontSize: 10.5, color: "var(--ink-soft)", marginTop: 1 },

  spineList: { display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", flex: 1, minHeight: 40 },
  spine: {
    display: "flex", alignItems: "center", gap: 10, width: "100%",
    padding: "9px 12px 9px 8px", borderRadius: "3px 10px 10px 3px",
    background: "transparent", textAlign: "left", transition: "all 0.18s ease",
  },
  spineBar: { width: 5, height: 26, borderRadius: 2, flexShrink: 0 },
  spineLabel: { fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  spineDelete: {
    position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
    background: "transparent", color: "var(--ink-soft)", fontSize: 11, padding: 4, opacity: 0.55,
  },
  confirmRow: {
    position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
    display: "flex", alignItems: "center", gap: 5, fontSize: 10.5,
    background: "var(--paper-card)", padding: "4px 6px", borderRadius: 8,
    border: "1px solid var(--rule)", color: "var(--ink)",
  },
  confirmYes: { background: "var(--brick)", color: "#FBF8EF", fontSize: 10, padding: "3px 6px", borderRadius: 6 },
  confirmNo: { background: "transparent", color: "var(--ink-soft)", fontSize: 10, padding: "3px 4px" },
  emptySidebarNote: { fontSize: 12, color: "var(--ink-soft)", padding: "10px 8px" },

  newProjectBtn: {
    fontSize: 12.5, color: "var(--brick)", background: "var(--brick-soft)",
    padding: "9px 12px", borderRadius: 10, fontWeight: 500, letterSpacing: "0.01em",
  },
  createBox: {
    background: "var(--paper-card)", border: "1px solid var(--rule)",
    borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 8,
  },
  createInput: {
    fontSize: 12.5, padding: "7px 9px", borderRadius: 7, border: "1px solid var(--rule)",
    background: "#fff", color: "var(--ink)", outline: "none",
  },
  swatchRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  swatch: { width: 18, height: 18, borderRadius: "50%" },
  createActions: { display: "flex", gap: 6 },
  createConfirm: { flex: 1, fontSize: 12, background: "var(--brick)", color: "#FBF8EF", padding: "6px 0", borderRadius: 7 },
  createCancel: { flex: 1, fontSize: 12, background: "transparent", color: "var(--ink-soft)", padding: "6px 0", borderRadius: 7, border: "1px solid var(--rule)" },

  main: { flex: 1, padding: "28px 40px 60px", overflowY: "auto" },

  emptyState: { maxWidth: 420, margin: "10vh auto 0", textAlign: "center" },
  emptyGlyph: { fontFamily: "'Noto Serif Thai', serif", fontSize: 40, color: "var(--brick)", marginBottom: 6 },
  emptyTitle: { fontFamily: "'Noto Serif Thai', serif", fontSize: 20, color: "var(--ink)", marginBottom: 10, fontWeight: 600 },
  emptyBody: { fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.8, marginBottom: 20 },
  emptyBtn: { fontSize: 13, background: "var(--brick)", color: "#FBF8EF", padding: "10px 22px", borderRadius: 10, fontWeight: 500 },

  projHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 4 },
  ribbon: { width: 6, height: 30, borderRadius: 2, flexShrink: 0 },
  projTitle: { fontFamily: "'Noto Serif Thai', serif", fontSize: 24, color: "var(--ink)", fontWeight: 600, cursor: "pointer" },
  projTitleInput: {
    fontFamily: "'Noto Serif Thai', serif", fontSize: 24, color: "var(--ink)", fontWeight: 600,
    border: "none", borderBottom: "2px solid var(--brick)", background: "transparent", outline: "none",
  },
  saveIndicator: { marginLeft: "auto", fontSize: 11, color: "var(--ink-soft)" },

  tabRow: { display: "flex", gap: 4, borderBottom: "1px solid var(--rule)", margin: "18px 0 22px", overflowX: "auto" },
  tabBtn: {
    background: "transparent", padding: "9px 14px", fontSize: 13.5,
    borderBottom: "2px solid transparent", whiteSpace: "nowrap",
  },
  panelWrap: {},

  card: { background: "var(--paper-card)", border: "1px solid var(--rule)", borderRadius: 14, padding: 22 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  fieldLabel: { fontSize: 11.5, color: "var(--ink-soft)", marginBottom: 6, letterSpacing: "0.01em" },
  inputPlain: {
    width: "100%", fontSize: 13.5, color: "var(--ink)", padding: "9px 11px",
    borderRadius: 8, border: "1px solid var(--rule)", background: "#fff", outline: "none",
  },
  textareaPlain: {
    width: "100%", fontSize: 13.5, color: "var(--ink)", padding: "10px 11px",
    borderRadius: 8, border: "1px solid var(--rule)", background: "#fff", outline: "none",
    lineHeight: 1.7, resize: "vertical",
  },
  ruledTextarea: {
    width: "100%", fontSize: 13.5, color: "var(--ink)", padding: "8px 12px",
    border: "1px solid var(--rule)", borderRadius: 8, background: "#fff", outline: "none",
    lineHeight: "27px", resize: "vertical",
    backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 26px, var(--rule) 27px)",
    backgroundAttachment: "local",
  },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  charCard: {
    display: "flex", gap: 10, background: "var(--paper-card)", border: "1px solid var(--rule)",
    borderRadius: 12, padding: "12px 12px 12px 0", position: "relative",
  },
  charAccent: { width: 4, borderRadius: 3, alignSelf: "stretch" },
  charName: { width: "100%", fontFamily: "'Noto Serif Thai', serif", fontSize: 15, fontWeight: 600, color: "var(--ink)", background: "transparent", border: "none", outline: "none", marginBottom: 2 },
  charRole: { width: "100%", fontSize: 11.5, color: "var(--brick)", background: "transparent", border: "none", outline: "none", marginBottom: 6 },
  charDesc: { width: "100%", fontSize: 12.5, color: "var(--ink-soft)", background: "transparent", border: "none", outline: "none", lineHeight: 1.6, resize: "vertical" },
  rowDelete: { alignSelf: "flex-start", color: "var(--ink-soft)", background: "transparent", fontSize: 12, padding: 6, opacity: 0.5 },
  rowDeleteSmall: { color: "var(--ink-soft)", background: "transparent", fontSize: 11, padding: 4, opacity: 0.6 },
  panelEmptyNote: { fontSize: 12.5, color: "var(--ink-soft)", padding: "16px 4px" },
  addBtn: { marginTop: 14, fontSize: 12.5, color: "var(--brick)", background: "var(--brick-soft)", padding: "9px 16px", borderRadius: 9, fontWeight: 500 },
  addBtnSmall: { fontSize: 12, color: "#FBF8EF", background: "var(--brick)", padding: "8px 14px", borderRadius: 8, fontWeight: 500, flexShrink: 0 },

  plotRow: { display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--rule)" },
  plotOrderCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: 26, flexShrink: 0 },
  orderBtn: { background: "transparent", color: "var(--ink-soft)", fontSize: 9, padding: 3, opacity: 0.6 },
  plotIndex: { fontFamily: "'Noto Serif Thai', serif", fontSize: 15, fontWeight: 700, margin: "2px 0" },
  plotTitle: { width: "100%", fontFamily: "'Noto Serif Thai', serif", fontSize: 15, fontWeight: 600, color: "var(--ink)", background: "transparent", border: "none", outline: "none", marginBottom: 3 },
  plotDesc: { width: "100%", fontSize: 12.5, color: "var(--ink-soft)", background: "transparent", border: "none", outline: "none", lineHeight: 1.6, resize: "vertical" },

  epRow: { display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--rule)" },
  epTopRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 },
  epTitle: { flex: 1, minWidth: 120, fontFamily: "'Noto Serif Thai', serif", fontSize: 14.5, fontWeight: 600, color: "var(--ink)", background: "transparent", border: "none", outline: "none" },
  statusGroup: { display: "flex", gap: 5 },
  statusChip: { fontSize: 10.5, padding: "4px 9px", borderRadius: 999, border: "1px solid", fontWeight: 500 },
  epNotes: { width: "100%", fontSize: 12.5, color: "var(--ink-soft)", background: "transparent", border: "none", outline: "none", lineHeight: 1.6, resize: "vertical" },

  calHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  calMonthLabel: { fontFamily: "'Noto Serif Thai', serif", fontSize: 16, color: "var(--ink)", fontWeight: 600 },
  calNav: { width: 28, height: 28, borderRadius: "50%", background: "var(--brick-soft)", color: "var(--brick)", fontSize: 14 },
  calWeekRow: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 },
  calWeekCell: { textAlign: "center", fontSize: 11, color: "var(--ink-soft)", padding: "4px 0" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 },
  calDay: {
    position: "relative", height: 38, borderRadius: 8, background: "transparent",
    fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "center",
  },
  calDot: { position: "absolute", bottom: 4, width: 4, height: 4, borderRadius: "50%" },
  calDetail: { marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--rule)" },
  calDetailTitle: { fontFamily: "'Noto Serif Thai', serif", fontSize: 13.5, color: "var(--ink)", fontWeight: 600, marginBottom: 10 },
  calEventItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink)", padding: "6px 0" },
  calEventDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  calAddRow: { display: "flex", gap: 8, marginTop: 8 },
  upcomingBlock: { marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--rule)" },
  upcomingRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink)", padding: "5px 0" },
  upcomingDate: { color: "var(--ink-soft)", fontSize: 11, width: 40, flexShrink: 0 },
};