// ============================================================
// script.js — JavaScript untuk Website Tech Community
// Digunakan oleh: index.html, form.html, gallery.html
// ============================================================


// ============================================================
// DATA ANGGOTA — Array penyimpanan sementara (simulasi database)
// ============================================================

var members = [
  { nama: "Arya Dwi Putra",  email: "arya@email.com",   minat: "Web Development" },
  { nama: "Siti Rahma",      email: "siti@email.com",   minat: "Data Science" },
  { nama: "Bimo Aksara",     email: "bimo@email.com",   minat: "Cybersecurity" },
  { nama: "Dewi Lestari",    email: "dewi@email.com",   minat: "UI/UX Design" },
  { nama: "Fadhil Ramadhan", email: "fadhil@email.com", minat: "Mobile Development" },
  { nama: "Nadia Kusuma",    email: "nadia@email.com",  minat: "Artificial Intelligence" }
];

// Array sementara untuk anggota baru yang didaftarkan di form.html
var newMembersArray = [];

// Mapping warna badge sesuai bidang minat
var badgeMap = {
  "Web Development":        "badge-blue",
  "Data Science":           "badge-purple",
  "Cybersecurity":          "badge-yellow",
  "UI/UX Design":           "badge-pink",
  "Mobile Development":     "badge-green",
  "Artificial Intelligence":"badge-blue"
};


// ============================================================
// FUNGSI UMUM — Dipakai di semua halaman
// ============================================================

// Fungsi: escape karakter HTML agar aman ditampilkan
function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Fungsi: generate ID anggota unik
function generateId() {
  return "TC-" + Date.now().toString(36).toUpperCase().slice(-5);
}

// Fungsi: tampilkan notifikasi toast di pojok layar
function showToast(pesan) {
  var existing = document.querySelector(".toast");
  if (existing) existing.remove();

  var toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = "<span>&#10003;</span> " + pesan;
  document.body.appendChild(toast);

  setTimeout(function () {
    if (toast.parentNode) toast.remove();
  }, 3000);
}


// ============================================================
// HALAMAN UTAMA (index.html)
// ============================================================

// Fungsi: ambil data tambahan dari sessionStorage (kiriman form.html)
function loadFromStorage() {
  var saved = sessionStorage.getItem("tc_members");
  if (saved) {
    var extraMembers = JSON.parse(saved);
    for (var i = 0; i < extraMembers.length; i++) {
      members.push(extraMembers[i]);
    }
  }
}

// Fungsi: render tabel anggota di halaman utama
function renderTable() {
  var tbody   = document.getElementById("member-table-body");
  var countEl = document.getElementById("table-count");
  var statEl  = document.getElementById("stat-members");

  if (!tbody) return; // hentikan jika elemen tidak ada (bukan index.html)

  if (countEl) countEl.textContent = members.length;
  if (statEl)  statEl.textContent  = members.length + "+";

  if (members.length === 0) {
    tbody.innerHTML =
      "<tr><td colspan='5' style='text-align:center;color:var(--muted);padding:2rem;'>Belum ada anggota.</td></tr>";
    return;
  }

  var rows = "";
  for (var i = 0; i < members.length; i++) {
    var m          = members[i];
    var badgeClass = badgeMap[m.minat] || "badge-blue";
    var nomor      = (i + 1 < 10) ? "0" + (i + 1) : "" + (i + 1);

    rows +=
      "<tr>" +
        "<td style='color:var(--muted);font-family:var(--font-mono);font-size:0.8rem;'>" + nomor + "</td>" +
        "<td><strong>" + escapeHtml(m.nama) + "</strong></td>" +
        "<td style='font-family:var(--font-mono);font-size:0.82rem;color:var(--muted);'>" + escapeHtml(m.email) + "</td>" +
        "<td><span class='badge " + badgeClass + "'>" + escapeHtml(m.minat) + "</span></td>" +
        "<td><span class='badge badge-green'>&#10003; Aktif</span></td>" +
      "</tr>";
  }

  tbody.innerHTML = rows;
}


// ============================================================
// HALAMAN FORM (form.html)
// ============================================================

// Fungsi: tampilkan pesan error di bawah field
function showError(field, pesan) {
  var el = document.getElementById("err-" + field);
  if (el) {
    el.textContent   = pesan;
    el.style.display = "block";
  }
}

// Fungsi: sembunyikan semua pesan error
function resetErrors() {
  var fields = ["nama", "email", "minat"];
  for (var i = 0; i < fields.length; i++) {
    var el = document.getElementById("err-" + fields[i]);
    if (el) el.style.display = "none";
  }
}

// Fungsi: validasi isian form sebelum submit
function validateForm() {
  var valid = true;
  resetErrors();

  var nama  = document.getElementById("nama").value.trim();
  var email = document.getElementById("email").value.trim();
  var minat = document.getElementById("minat").value;

  if (nama === "") {
    showError("nama", "Nama tidak boleh kosong.");
    valid = false;
  } else if (nama.length < 3) {
    showError("nama", "Nama minimal 3 karakter.");
    valid = false;
  }

  if (email === "") {
    showError("email", "Email tidak boleh kosong.");
    valid = false;
  } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    showError("email", "Format email tidak valid.");
    valid = false;
  }

  if (minat === "") {
    showError("minat", "Pilih bidang minat terlebih dahulu.");
    valid = false;
  }

  return valid;
}

// Fungsi: proses submit form pendaftaran
function submitForm() {
  if (!validateForm()) return;

  var nama     = document.getElementById("nama").value.trim();
  var email    = document.getElementById("email").value.trim();
  var minat    = document.getElementById("minat").value;
  var motivasi = document.getElementById("motivasi").value.trim();
  var id       = generateId();

  // Simpan ke array sementara
  var anggotaBaru = { id: id, nama: nama, email: email, minat: minat, motivasi: motivasi };
  newMembersArray.push(anggotaBaru);

  // Simpan ke sessionStorage agar index.html bisa membaca
  var existing = JSON.parse(sessionStorage.getItem("tc_members") || "[]");
  existing.push({ nama: nama, email: email, minat: minat });
  sessionStorage.setItem("tc_members", JSON.stringify(existing));

  // Tampilkan alert konfirmasi
  alert(
    "Pendaftaran Berhasil!\n\n" +
    "Nama   : " + nama  + "\n" +
    "Email  : " + email + "\n" +
    "Minat  : " + minat + "\n" +
    "ID     : " + id    + "\n\n" +
    "Selamat bergabung di Tech Community!"
  );

  // Tampilkan data hasil di panel bawah form
  document.getElementById("res-nama").textContent  = nama;
  document.getElementById("res-email").textContent = email;
  document.getElementById("res-minat").textContent = minat;
  document.getElementById("res-id").textContent    = id;
  document.getElementById("res-motivasi").textContent =
    motivasi ? '"' + motivasi + '"' : "(tidak ada motivasi yang diisi)";

  document.getElementById("result-panel").classList.add("show");

  // Perbarui tabel sesi
  updateSessionTable();

  // Scroll ke panel hasil
  document.getElementById("result-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Fungsi: render tabel anggota yang didaftarkan di sesi ini
function updateSessionTable() {
  var section = document.getElementById("session-table-section");
  if (!section) return;

  section.style.display = "block";
  document.getElementById("session-count").textContent = newMembersArray.length;

  var tbody = document.getElementById("session-tbody");
  var rows  = "";

  for (var i = 0; i < newMembersArray.length; i++) {
    var m          = newMembersArray[i];
    var nomor      = (i + 1 < 10) ? "0" + (i + 1) : "" + (i + 1);
    var badgeClass = badgeMap[m.minat] || "badge-blue";

    rows +=
      "<tr>" +
        "<td style='color:var(--muted);font-family:var(--font-mono);font-size:0.8rem;'>" + nomor + "</td>" +
        "<td>" +
          "<strong>" + escapeHtml(m.nama) + "</strong><br>" +
          "<span style='font-family:var(--font-mono);font-size:0.7rem;color:var(--accent);'>" + escapeHtml(m.id) + "</span>" +
        "</td>" +
        "<td style='font-family:var(--font-mono);font-size:0.82rem;color:var(--muted);'>" + escapeHtml(m.email) + "</td>" +
        "<td><span class='badge " + badgeClass + "'>" + escapeHtml(m.minat) + "</span></td>" +
      "</tr>";
  }

  tbody.innerHTML = rows;
}

// Fungsi: reset form dan sembunyikan panel hasil
function addAnother() {
  document.getElementById("result-panel").classList.remove("show");
  resetForm();
  document.getElementById("nama").focus();
}

// Fungsi: kosongkan semua field form
function resetForm() {
  document.getElementById("nama").value     = "";
  document.getElementById("email").value    = "";
  document.getElementById("minat").value    = "";
  document.getElementById("motivasi").value = "";
  resetErrors();
}


// ============================================================
// HALAMAN GALERI — GAMBAR (gallery.html)
// ============================================================

var images = [
  {
    src:     "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    caption: "Workshop Coding — Sesi Intensif Web Development",
    alt:     "Laptop dengan kode"
  },
  {
    src:     "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    caption: "Sesi Kolaborasi — Diskusi Tim Tech Community",
    alt:     "Tim berdiskusi"
  },
  {
    src:     "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    caption: "Hackathon 2024 — 48 Jam Penuh Inovasi",
    alt:     "Hackathon"
  },
  {
    src:     "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    caption: "Learning Session — Belajar Coding Bareng",
    alt:     "Belajar coding"
  }
];

var currentImg = 0;

// Fungsi: tampilkan gambar sesuai indeks
function renderImage(idx) {
  var imgEl   = document.getElementById("main-image");
  var caption = document.getElementById("img-caption");
  if (!imgEl) return;

  imgEl.style.opacity = "0";
  setTimeout(function () {
    imgEl.src            = images[idx].src;
    imgEl.alt            = images[idx].alt;
    caption.textContent  = images[idx].caption;
    imgEl.style.opacity  = "1";
  }, 200);

  // Update titik navigasi
  var dots = document.querySelectorAll(".img-dot");
  for (var i = 0; i < dots.length; i++) {
    dots[i].classList.toggle("active", i === idx);
  }
}

// Fungsi: gambar berikutnya
function nextImage() {
  currentImg = (currentImg + 1) % images.length;
  renderImage(currentImg);
}

// Fungsi: gambar sebelumnya
function prevImage() {
  currentImg = (currentImg - 1 + images.length) % images.length;
  renderImage(currentImg);
}

// Fungsi: pergi ke gambar tertentu
function goToImage(idx) {
  currentImg = idx;
  renderImage(currentImg);
}

// Fungsi: tampilkan info gambar via alert
function showImageInfo() {
  alert(
    "Info Galeri Foto\n\n" +
    "Total foto : " + images.length + " gambar\n" +
    "Foto aktif : " + (currentImg + 1) + " — " + images[currentImg].caption + "\n" +
    "Sumber     : Unsplash (royalty-free)\n\n" +
    "Gunakan tombol Prev / Next atau klik titik untuk berpindah gambar."
  );
}


// ============================================================
// HALAMAN GALERI — AUDIO (gallery.html)
// ============================================================

var tracks = [
  {
    title:  "Lofi Study Beats",
    artist: "Tech Community Playlist",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    emoji:  "🎵"
  },
  {
    title:  "Chill Coding Vibes",
    artist: "Lo-fi Session",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    emoji:  "💻"
  },
  {
    title:  "Focus Flow",
    artist: "Deep Work Mix",
    src:    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    emoji:  "🎧"
  }
];

var currentTrack = 0;
var isPlaying    = false;

// Fungsi: render daftar lagu
function renderTrackList() {
  var el = document.getElementById("track-list");
  if (!el) return;

  var html = "";
  for (var i = 0; i < tracks.length; i++) {
    var t        = tracks[i];
    var isActive = (i === currentTrack);
    var bgStyle  = isActive
      ? "background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);"
      : "border:1px solid transparent;";
    var txtColor = isActive ? "color:var(--accent);font-weight:700;" : "color:var(--text);font-weight:400;";
    var nowLabel = (isActive && isPlaying)
      ? "<span style='color:var(--accent);font-size:0.7rem;font-family:var(--font-mono);'>&#9658; NOW</span>"
      : "";

    html +=
      "<div onclick='loadTrack(" + i + ", true)' style='" +
        "display:flex;align-items:center;gap:10px;" +
        "padding:6px 8px;border-radius:6px;cursor:pointer;" +
        bgStyle + "transition:all 0.2s;margin-bottom:4px;'>" +
        "<span style='font-size:1rem;'>" + t.emoji + "</span>" +
        "<div style='flex:1;'>" +
          "<div style='font-size:0.82rem;" + txtColor + "'>" + t.title + "</div>" +
          "<div style='font-size:0.7rem;color:var(--muted);font-family:var(--font-mono);'>" + t.artist + "</div>" +
        "</div>" +
        nowLabel +
      "</div>";
  }

  el.innerHTML = html;
}

// Fungsi: muat lagu sesuai indeks
function loadTrack(idx, autoPlay) {
  var audioEl = document.getElementById("audio-player");
  if (!audioEl) return;

  currentTrack = idx;
  var t = tracks[idx];

  audioEl.src = t.src;
  document.getElementById("audio-title").textContent = t.title;
  document.getElementById("audio-thumb").textContent  = t.emoji;
  document.getElementById("audio-fill").style.width   = "0%";
  document.getElementById("audio-time").textContent   = "0:00 / 0:00";

  if (autoPlay && isPlaying) {
    audioEl.play();
  } else {
    isPlaying = false;
    updatePlayBtn();
  }

  renderTrackList();
}

// Fungsi: play / pause audio
function togglePlay() {
  var audioEl = document.getElementById("audio-player");
  if (!audioEl) return;

  if (isPlaying) {
    audioEl.pause();
    isPlaying = false;
    document.getElementById("audio-status").textContent = "Dijeda";
    document.getElementById("audio-status").className   = "badge badge-yellow";
  } else {
    audioEl.play();
    isPlaying = true;
    document.getElementById("audio-status").textContent = "Memutar";
    document.getElementById("audio-status").className   = "badge badge-green";
  }

  updatePlayBtn();
  renderTrackList();
}

// Fungsi: update tampilan tombol play
function updatePlayBtn() {
  var btn = document.getElementById("play-btn");
  if (!btn) return;
  btn.textContent = isPlaying ? "⏸" : "▶";
  btn.classList.toggle("active", isPlaying);
}

// Fungsi: lagu berikutnya
function nextTrack() {
  loadTrack((currentTrack + 1) % tracks.length, true);
}

// Fungsi: lagu sebelumnya
function prevTrack() {
  loadTrack((currentTrack - 1 + tracks.length) % tracks.length, true);
}

// Fungsi: atur volume
function setVolume(val) {
  var audioEl = document.getElementById("audio-player");
  if (audioEl) audioEl.volume = val;

  var icon = document.getElementById("vol-icon");
  if (!icon) return;
  if (val == 0)       icon.textContent = "🔇";
  else if (val < 0.4) icon.textContent = "🔉";
  else                icon.textContent = "🔊";
}

// Fungsi: klik progress bar untuk seek
function seekAudio(e) {
  var audioEl = document.getElementById("audio-player");
  if (!audioEl || !audioEl.duration) return;
  var ratio = e.offsetX / e.currentTarget.offsetWidth;
  audioEl.currentTime = ratio * audioEl.duration;
}

// Fungsi: format detik menjadi m:ss
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  var m = Math.floor(sec / 60);
  var s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" + s : s);
}


// ============================================================
// HALAMAN GALERI — VIDEO (gallery.html)
// ============================================================

var videos = [
  {
    id:      "mU6anWqZJcc",
    title:   "Intro to Web Development — Full Course for Beginners",
    channel: "freeCodeCamp.org"
  },
  {
    id:      "PkZNo7MFNFg",
    title:   "Learn JavaScript — Full Course for Beginners",
    channel: "freeCodeCamp.org"
  },
  {
    id:      "rfscVS0vtbw",
    title:   "Learn CSS in 20 Minutes",
    channel: "Web Dev Simplified"
  }
];

var currentVideo = 0;

// Fungsi: ganti video berikutnya
function changeVideo() {
  currentVideo = (currentVideo + 1) % videos.length;
  var v = videos[currentVideo];

  document.getElementById("yt-iframe").src =
    "https://www.youtube.com/embed/" + v.id + "?rel=0&modestbranding=1";
  document.getElementById("video-title").textContent = v.title;

  showToast("Video diubah ke: " + v.title);
}

// Fungsi: tampilkan info video via alert
function showVideoInfo() {
  var v = videos[currentVideo];
  alert(
    "Info Video\n\n" +
    "Judul   : " + v.title   + "\n" +
    "Channel : " + v.channel + "\n" +
    "Sumber  : YouTube (embed iframe)\n\n" +
    "Klik 'Ganti Video' untuk melihat video lain (" + videos.length + " video tersedia)."
  );
}


// ============================================================
// INISIALISASI — Deteksi halaman & jalankan fungsi yang sesuai
// ============================================================

window.onload = function () {

  // --- Halaman Utama (index.html) ---
  if (document.getElementById("member-table-body")) {
    loadFromStorage();
    renderTable();
  }

  // --- Halaman Form (form.html) ---
  if (document.getElementById("registration-form")) {
    // Muat data sesi sebelumnya dari sessionStorage
    var saved = JSON.parse(sessionStorage.getItem("tc_members") || "[]");
    if (saved.length > 0) {
      for (var i = 0; i < saved.length; i++) {
        newMembersArray.push({
          id:       generateId(),
          nama:     saved[i].nama,
          email:    saved[i].email,
          minat:    saved[i].minat,
          motivasi: ""
        });
      }
      updateSessionTable();
    }
  }

  // --- Halaman Galeri (gallery.html) ---
  if (document.getElementById("main-image")) {
    renderImage(0);
    setInterval(nextImage, 6000); // auto-slide gambar
  }

  if (document.getElementById("track-list")) {
    var audioEl = document.getElementById("audio-player");
    if (audioEl) {
      audioEl.volume = 0.7;

      // Update progress bar saat audio berjalan
      audioEl.addEventListener("timeupdate", function () {
        if (audioEl.duration) {
          var pct = (audioEl.currentTime / audioEl.duration) * 100;
          document.getElementById("audio-fill").style.width = pct + "%";
          document.getElementById("audio-time").textContent =
            formatTime(audioEl.currentTime) + " / " + formatTime(audioEl.duration);
        }
      });

      // Putar lagu berikutnya saat lagu selesai
      audioEl.addEventListener("ended", function () {
        nextTrack();
      });
    }

    renderTrackList();
  }

};