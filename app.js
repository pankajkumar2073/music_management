/* ============================================
   Music Festival Artist Management System
   Minimal JavaScript for interactivity
============================================ */

// Sample Data (pre-loaded for demo)
const sampleArtists = [
    { id: 1, name: "Neon Pulse", genre: "EDM", contact: "neon@pulse.com", status: "confirmed", bio: "High-energy electronic duo known for explosive live shows." },
    { id: 2, name: "Luna Waves", genre: "Indie Pop", contact: "luna@waves.com", status: "confirmed", bio: "Dreamy indie-pop artist with soulful vocals." },
    { id: 3, name: "Bass Rebels", genre: "Dubstep", contact: "bass@rebels.com", status: "pending", bio: "Heavy bass and aggressive drops." },
    { id: 4, name: "Skyline Echo", genre: "Rock", contact: "sky@echo.com", status: "confirmed", bio: "Alternative rock band with powerful stage presence." },
    { id: 5, name: "DJ Vortex", genre: "Techno", contact: "dj@vortex.com", status: "confirmed", bio: "Underground techno legend." }
];

const sampleStages = [
    { id: 1, name: "Main Stage", capacity: 15000, location: "North Field", status: "active" },
    { id: 2, name: "Neon Arena", capacity: 8000, location: "East Zone", status: "active" },
    { id: 3, name: "Sunset Pavilion", capacity: 5000, location: "West Hill", status: "active" },
    { id: 4, name: "Underground", capacity: 2500, location: "South Tent", status: "maintenance" }
];

const sampleSlots = [
    { id: 1, artistId: 1, stageId: 1, date: "2026-12-15", start: "18:00", end: "19:30", title: "Neon Pulse Live" },
    { id: 2, artistId: 2, stageId: 2, date: "2026-12-15", start: "19:00", end: "20:00", title: "Luna Waves Set" },
    { id: 3, artistId: 4, stageId: 1, date: "2026-12-15", start: "20:00", end: "21:30", title: "Skyline Echo" },
    { id: 4, artistId: 5, stageId: 3, date: "2026-12-15", start: "21:00", end: "22:30", title: "DJ Vortex" },
    { id: 5, artistId: 3, stageId: 2, date: "2026-12-16", start: "18:30", end: "20:00", title: "Bass Rebels Drop" }
];

const sampleTech = [
    { id: 1, artistId: 1, items: "2x CDJ-3000, DJM-A9 Mixer, LED Wall, Laser System", power: "15 kW", notes: "Need 30 min soundcheck" },
    { id: 2, artistId: 2, items: "Vocal Mic (wireless), Acoustic Guitar Amp, Keyboard Stand", power: "5 kW", notes: "Prefer warm lighting" },
    { id: 3, artistId: 4, items: "Full Drum Kit, 2x Guitar Amps, Bass Amp, 4x Mics", power: "12 kW", notes: "Backline required" },
    { id: 4, artistId: 5, items: "Pioneer CDJ setup, Subwoofers, Smoke Machine", power: "20 kW", notes: "Heavy bass focus" }
];

// Load from localStorage or use sample
function loadData(key, sample) {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : sample;
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let artists = loadData('mf_artists', sampleArtists);
let stages = loadData('mf_stages', sampleStages);
let slots = loadData('mf_slots', sampleSlots);
let techReqs = loadData('mf_tech', sampleTech);

// Utility
function getArtistName(id) {
    const a = artists.find(x => x.id === id);
    return a ? a.name : "Unknown";
}

function getStageName(id) {
    const s = stages.find(x => x.id === id);
    return s ? s.name : "Unknown";
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.borderColor = isError ? 'rgba(255,23,68,0.5)' : 'rgba(0,230,118,0.4)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Mobile menu
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

// ========== ARTISTS PAGE ==========
function renderArtists() {
    const container = document.getElementById('artists-list');
    if (!container) return;

    if (artists.length === 0) {
        container.innerHTML = '<p class="text-center" style="color:var(--text-secondary)">No artists yet. Add one above!</p>';
        return;
    }

    container.innerHTML = artists.map(a => `
        <div class="artist-card">
            <div class="artist-avatar">${a.name.charAt(0)}</div>
            <h3>${a.name}</h3>
            <span class="artist-genre">${a.genre}</span>
            <p class="artist-info"><strong>Contact:</strong> ${a.contact}</p>
            <p class="artist-info">${a.bio || ''}</p>
            <div class="flex-between mt-2">
                <span class="status-badge status-${a.status}">${a.status}</span>
                <button class="btn btn-sm btn-danger" onclick="deleteArtist(${a.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function addArtist(e) {
    e.preventDefault();
    const name = document.getElementById('artist-name').value.trim();
    const genre = document.getElementById('artist-genre').value;
    const contact = document.getElementById('artist-contact').value.trim();
    const bio = document.getElementById('artist-bio').value.trim();
    const status = document.getElementById('artist-status').value;

    if (!name || !contact) {
        showToast('Please fill required fields', true);
        return;
    }

    const newId = artists.length ? Math.max(...artists.map(a => a.id)) + 1 : 1;
    artists.push({ id: newId, name, genre, contact, bio, status });
    saveData('mf_artists', artists);
    document.getElementById('artist-form').reset();
    renderArtists();
    updateStats();
    showToast('Artist added successfully!');
}

function deleteArtist(id) {
    if (!confirm('Delete this artist?')) return;
    artists = artists.filter(a => a.id !== id);
    saveData('mf_artists', artists);
    renderArtists();
    updateStats();
    showToast('Artist deleted');
}

// ========== STAGES PAGE ==========
function renderStages() {
    const container = document.getElementById('stages-list');
    if (!container) return;

    container.innerHTML = stages.map(s => `
        <div class="stage-card">
            <h3>🎤 ${s.name}</h3>
            <p class="artist-info"><strong>Capacity:</strong> ${s.capacity.toLocaleString()}</p>
            <p class="artist-info"><strong>Location:</strong> ${s.location}</p>
            <div class="flex-between mt-2">
                <span class="status-badge ${s.status === 'active' ? 'status-confirmed' : 'status-pending'}">${s.status}</span>
            </div>
        </div>
    `).join('');
}

function addStage(e) {
    e.preventDefault();
    const name = document.getElementById('stage-name').value.trim();
    const capacity = parseInt(document.getElementById('stage-capacity').value);
    const location = document.getElementById('stage-location').value.trim();
    const status = document.getElementById('stage-status').value;

    if (!name || !capacity) {
        showToast('Please fill required fields', true);
        return;
    }

    const newId = stages.length ? Math.max(...stages.map(s => s.id)) + 1 : 1;
    stages.push({ id: newId, name, capacity, location, status });
    saveData('mf_stages', stages);
    document.getElementById('stage-form').reset();
    renderStages();
    updateStats();
    populateSelects();
    showToast('Stage added successfully!');
}

// ========== SLOTS / PERFORMANCE ==========
function renderSlots() {
    const container = document.getElementById('slots-list');
    if (!container) return;

    if (slots.length === 0) {
        container.innerHTML = '<p class="text-center" style="color:var(--text-secondary)">No performance slots yet.</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Stage</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${slots.map(s => `
                        <tr>
                            <td>${getArtistName(s.artistId)}</td>
                            <td>${getStageName(s.stageId)}</td>
                            <td>${s.date}</td>
                            <td>${s.start} - ${s.end}</td>
                            <td>${s.title}</td>
                            <td><button class="btn btn-sm btn-danger" onclick="deleteSlot(${s.id})">Remove</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function addSlot(e) {
    e.preventDefault();
    const artistId = parseInt(document.getElementById('slot-artist').value);
    const stageId = parseInt(document.getElementById('slot-stage').value);
    const date = document.getElementById('slot-date').value;
    const start = document.getElementById('slot-start').value;
    const end = document.getElementById('slot-end').value;
    const title = document.getElementById('slot-title').value.trim();

    if (!artistId || !stageId || !date || !start || !end) {
        showToast('Please fill all fields', true);
        return;
    }

    // Simple conflict check
    const conflict = checkConflict(stageId, date, start, end);
    if (conflict) {
        showToast('⚠ Conflict detected! Same stage & overlapping time.', true);
        // Still allow adding but warn
    }

    const newId = slots.length ? Math.max(...slots.map(s => s.id)) + 1 : 1;
    slots.push({ id: newId, artistId, stageId, date, start, end, title: title || getArtistName(artistId) });
    saveData('mf_slots', slots);
    document.getElementById('slot-form').reset();
    renderSlots();
    updateStats();
    if (document.getElementById('schedule-timeline')) renderSchedule();
    if (document.getElementById('conflicts-area')) renderConflicts();
    showToast(conflict ? 'Slot added (with conflict warning)' : 'Performance slot added!');
}

function deleteSlot(id) {
    if (!confirm('Remove this slot?')) return;
    slots = slots.filter(s => s.id !== id);
    saveData('mf_slots', slots);
    renderSlots();
    updateStats();
    if (document.getElementById('schedule-timeline')) renderSchedule();
    if (document.getElementById('conflicts-area')) renderConflicts();
    showToast('Slot removed');
}

// ========== TECHNICAL REQUIREMENTS ==========
function renderTech() {
    const container = document.getElementById('tech-list');
    if (!container) return;

    if (techReqs.length === 0) {
        container.innerHTML = '<p class="text-center" style="color:var(--text-secondary)">No technical requirements added yet.</p>';
        return;
    }

    container.innerHTML = techReqs.map(t => `
        <div class="tech-card">
            <h3>${getArtistName(t.artistId)}</h3>
            <p class="artist-info"><strong>Equipment:</strong> ${t.items}</p>
            <p class="artist-info"><strong>Power Needed:</strong> ${t.power}</p>
            <p class="artist-info"><strong>Notes:</strong> ${t.notes || '—'}</p>
            <button class="btn btn-sm btn-danger mt-2" onclick="deleteTech(${t.id})">Delete</button>
        </div>
    `).join('');
}

function addTech(e) {
    e.preventDefault();
    const artistId = parseInt(document.getElementById('tech-artist').value);
    const items = document.getElementById('tech-items').value.trim();
    const power = document.getElementById('tech-power').value.trim();
    const notes = document.getElementById('tech-notes').value.trim();

    if (!artistId || !items) {
        showToast('Please fill required fields', true);
        return;
    }

    const newId = techReqs.length ? Math.max(...techReqs.map(t => t.id)) + 1 : 1;
    techReqs.push({ id: newId, artistId, items, power, notes });
    saveData('mf_tech', techReqs);
    document.getElementById('tech-form').reset();
    renderTech();
    showToast('Technical requirements saved!');
}

function deleteTech(id) {
    techReqs = techReqs.filter(t => t.id !== id);
    saveData('mf_tech', techReqs);
    renderTech();
    showToast('Deleted');
}

// ========== SCHEDULE ==========
function renderSchedule() {
    const container = document.getElementById('schedule-timeline');
    if (!container) return;

    if (slots.length === 0) {
        container.innerHTML = '<p class="text-center" style="color:var(--text-secondary)">No performances scheduled yet.</p>';
        return;
    }

    // Sort by date + start time
    const sorted = [...slots].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.start.localeCompare(b.start);
    });

    container.innerHTML = sorted.map(s => `
        <div class="timeline-item">
            <div class="timeline-time">${s.date} · ${s.start} – ${s.end}
                <span class="timeline-stage">${getStageName(s.stageId)}</span>
            </div>
            <h3>${s.title}</h3>
            <p style="color:var(--text-secondary);margin-top:0.3rem">${getArtistName(s.artistId)}</p>
        </div>
    `).join('');
}

// ========== CONFLICT DETECTION ==========
function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

function checkConflict(stageId, date, start, end, excludeId = null) {
    const startM = timeToMinutes(start);
    const endM = timeToMinutes(end);

    return slots.some(s => {
        if (s.id === excludeId) return false;
        if (s.stageId !== stageId || s.date !== date) return false;
        const sStart = timeToMinutes(s.start);
        const sEnd = timeToMinutes(s.end);
        return startM < sEnd && endM > sStart; // overlap
    });
}

function findAllConflicts() {
    const conflicts = [];
    for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
            const a = slots[i];
            const b = slots[j];
            if (a.stageId === b.stageId && a.date === b.date) {
                const aStart = timeToMinutes(a.start);
                const aEnd = timeToMinutes(a.end);
                const bStart = timeToMinutes(b.start);
                const bEnd = timeToMinutes(b.end);
                if (aStart < bEnd && aEnd > bStart) {
                    conflicts.push({ a, b });
                }
            }
        }
    }
    return conflicts;
}

function renderConflicts() {
    const container = document.getElementById('conflicts-area');
    if (!container) return;

    const conflicts = findAllConflicts();

    if (conflicts.length === 0) {
        container.innerHTML = `
            <div class="no-conflict">
                <h3>✅ No Conflicts Found</h3>
                <p style="color:var(--text-secondary)">All performance slots are properly scheduled without stage or time overlaps.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="conflict-box">
            <h3>⚠ ${conflicts.length} Conflict(s) Detected</h3>
            ${conflicts.map(c => `
                <div class="conflict-item">
                    <strong>${getStageName(c.a.stageId)}</strong> on <strong>${c.a.date}</strong><br>
                    • ${getArtistName(c.a.artistId)} (${c.a.start}–${c.a.end}) — ${c.a.title}<br>
                    • ${getArtistName(c.b.artistId)} (${c.b.start}–${c.b.end}) — ${c.b.title}
                </div>
            `).join('')}
        </div>
    `;
}

// ========== HELPERS ==========
function populateSelects() {
    // Artist selects
    document.querySelectorAll('.artist-select').forEach(sel => {
        const current = sel.value;
        sel.innerHTML = '<option value="">Select Artist</option>' +
            artists.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
        if (current) sel.value = current;
    });

    // Stage selects
    document.querySelectorAll('.stage-select').forEach(sel => {
        const current = sel.value;
        sel.innerHTML = '<option value="">Select Stage</option>' +
            stages.filter(s => s.status === 'active').map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        if (current) sel.value = current;
    });
}

function updateStats() {
    const el = (id, val) => {
        const e = document.getElementById(id);
        if (e) e.textContent = val;
    };
    el('stat-artists', artists.length);
    el('stat-stages', stages.length);
    el('stat-slots', slots.length);
    el('stat-conflicts', findAllConflicts().length);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    renderArtists();
    renderStages();
    renderSlots();
    renderTech();
    renderSchedule();
    renderConflicts();
    updateStats();

    // Attach form handlers
    const artistForm = document.getElementById('artist-form');
    if (artistForm) artistForm.addEventListener('submit', addArtist);

    const stageForm = document.getElementById('stage-form');
    if (stageForm) stageForm.addEventListener('submit', addStage);

    const slotForm = document.getElementById('slot-form');
    if (slotForm) slotForm.addEventListener('submit', addSlot);

    const techForm = document.getElementById('tech-form');
    if (techForm) techForm.addEventListener('submit', addTech);
});