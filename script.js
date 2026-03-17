document.addEventListener('DOMContentLoaded', function() {
    
// --- LOGIKA AMBIL NAMA TAMU DARI URL ---
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
const guestNameElement = document.getElementById('guestName');

if (namaTamu && guestNameElement) {
    // Mengganti teks placeholder dengan nama dari link
    guestNameElement.innerText = decodeURIComponent(namaTamu);
} // <--- Pastikan ada tutup kurung ini


    // --- 1. ELEMEN UTAMA ---
    const btnOpen = document.getElementById('open-invitation');
    const contentWrapper = document.getElementById('content-wrapper');
    const mainContainer = document.getElementById('main-container');
    const music = document.getElementById('background-music');
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    
    const pageOrder = [
        'page1', 'page2', 'halaman3', 'halaman4', 'story', 'gallery-trigger', 'detail'
    ];

    let touchStartY = 0;

    // --- 2. FUNGSI MUNCULKAN COVER ---
    function showCover() {
        if (page1) {
            const animItems = page1.querySelectorAll('.anim-item');
            animItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = "1";
                    item.style.transform = "translateY(0)";
                    item.classList.add('active');
                }, index * 300);
            });
        }
    }
    showCover();

        // --- 3. LOGIKA BUKA UNDANGAN (VERSI FIX) ---
    if (btnOpen) {
        btnOpen.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 1. Munculkan konten utama
            if (contentWrapper) {
                contentWrapper.style.display = 'block';
            }
            
            // 2. Aktifkan scroll pada container utama
            if (mainContainer) {
                mainContainer.style.overflowY = 'auto';
                mainContainer.style.height = 'auto'; // Pastikan height tidak terkunci
            }
            
            // 3. SCROLL KE HALAMAN 2 (Mempelai)
            // Kita pakai setTimeout sedikit agar browser sempat merender display:block
            setTimeout(() => {
                if (page2) {
                    page2.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);

            // 4. Sembunyikan tombol "Buka Undangan" saja, JANGAN sembunyikan page1
            this.style.display = 'none'; 
            
            // 5. Mainkan Musik
            if (music) {
                music.play().catch(() => console.log("Music blocked"));
            }
        });
    }


    // --- 4. ONE TAP SCROLL (HALAMAN SELANJUTNYA) ---
    document.addEventListener('pointerdown', (e) => touchStartY = e.clientY);
    document.addEventListener('pointerup', function(e) {
        if (e.target.closest('a, button, iframe, .btn-maps, #open-invitation')) return;
        if (contentWrapper && contentWrapper.style.display === 'block') {
            const deltaY = touchStartY - e.clientY;
            if (Math.abs(deltaY) < 20) { 
                const windowHeight = window.innerHeight;
                for (let i = 0; i < pageOrder.length; i++) {
                    const currentEl = document.getElementById(pageOrder[i]);
                    if (currentEl) {
                        const rect = currentEl.getBoundingClientRect();
                        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                            const nextEl = document.getElementById(pageOrder[i + 1]);
                            if (nextEl) {
                                nextEl.scrollIntoView({ behavior: 'smooth' });
                                return; 
                            }
                        }
                    }
                }
            }
        }
    });

    // --- 5. ANIMASI & EXTERNAL LIBS (AOS, SWIPER) ---
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }

    let swiper;
    if (document.querySelector('.mySwiper')) {
        swiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: { el: ".swiper-pagination", clickable: true },
        });
    }

    function initAnimations() {
        // Teks Wave
        document.querySelectorAll('.wave-trigger-title, .wave-trigger-reveal').forEach(el => {
            const text = el.innerText;
            el.innerHTML = [...text].map((char, i) => 
                `<span style="transition-delay:${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        });

        const globalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active', 'animate-now');
                    
                    if (entry.target.id === 'gallery-trigger') {
                        const photos = entry.target.querySelectorAll('.grid-item');
                        photos.forEach((photo, index) => {
                            setTimeout(() => {
                                photo.classList.add('show');
                                photo.style.opacity = "1";
                                photo.style.transform = "scale(1) translateY(0)";
                            }, index * 500);
                        });
                    }
                }
            });
        }, { threshold: 0.2 });

                document.querySelectorAll('.couple-section, .story-page, .gallery-page, #halaman4, #detail, #halaman8, #reservasi').forEach(el => {
            globalObserver.observe(el);
        });
    }
    initAnimations();


    // --- 6. HAPUS GARIS VERTIKAL ---
    const removeLines = () => {
        const detail = document.getElementById('detail');
        if (detail) {
            const lines = detail.querySelectorAll('.line, .divider-gold');
            lines.forEach(l => l.style.display = 'none');
        }
    };
    removeLines();

    // --- 7. COUNTDOWN LOGIC ---
    const weddingDate = new Date(2026, 3, 12, 8, 0, 0).getTime();
    const countdownItems = ["days", "hours", "minutes", "seconds"];

    const updateCountdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(updateCountdown);
            countdownItems.forEach(id => {
                if (document.getElementById(id)) document.getElementById(id).innerText = "00";
            });
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById("days")) {
            document.getElementById("days").innerText = String(d).padStart(2, '0');
            document.getElementById("hours").innerText = String(h).padStart(2, '0');
            document.getElementById("minutes").innerText = String(m).padStart(2, '0');
            document.getElementById("seconds").innerText = String(s).padStart(2, '0');
        }
    }, 1000);

    /* ============================================================
       FIREBASE & RSVP
       ============================================================ */
    const firebaseConfig = {
        apiKey: "AIzaSyCeBaCj_hBgr1dE2EBdATttNgItqoocPGI",
        authDomain: "undangan-shanum-arka.firebaseapp.com",
        projectId: "undangan-shanum-arka",
        storageBucket: "undangan-shanum-arka.firebasestorage.app",
        messagingSenderId: "434126453833",
        appId: "1:434126453833:web:37d20eaa439881f2ae9398"
    };

    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        const sendBtn = document.getElementById("sendBtn");
        if (sendBtn) {
            sendBtn.onclick = async function() {
                const name = document.getElementById("inputName").value.trim();
                const msg = document.getElementById("inputMessage").value.trim();
                const isHadir = document.getElementById("hadirYa").checked;

                if (name && msg) {
                    sendBtn.disabled = true;
                    try {
                        await db.collection("ucapan").add({
                            nama: name,
                            pesan: msg,
                            status: isHadir ? "Hadir" : "Tidak Hadir",
                            waktu: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        document.getElementById("inputName").value = "";
                        document.getElementById("inputMessage").value = "";
                        alert("Terkirim! Terima kasih atas ucapannya.");
                    } catch (e) {
                        alert("Gagal mengirim ucapan.");
                    } finally {
                        sendBtn.disabled = false;
                    }
                } else {
                    alert("Mohon isi nama dan ucapan.");
                }
            };
        }

        const commentsList = document.getElementById("comments-list");
        if (commentsList) {
            db.collection("ucapan").orderBy("waktu", "desc").onSnapshot((snapshot) => {
                commentsList.innerHTML = "";
                let stats = { total: 0, hadir: 0, absen: 0 };
                let allMessages = [];
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    allMessages.push(data);
                    stats.total++;
                    data.status === "Hadir" ? stats.hadir++ : stats.absen++;
                });

                const groupSize = 3; 
                for (let i = 0; i < allMessages.length; i += groupSize) {
                    const chunk = allMessages.slice(i, i + groupSize);
                    const slide = document.createElement("div");
                    slide.className = "swiper-slide";
                    
                    let html = `<div class="slide-page-wrapper">`;
                    chunk.forEach(m => {
                        html += `
                            <div class="comment-item">
                                <div class="card-header">
                                    <b>${m.nama}</b>
                                    <span class="status-badge ${m.status === 'Hadir' ? 'hadir' : 'absen'}">${m.status}</span>
                                </div>
                                <p class="comment-body">${m.pesan}</p>
                            </div>`;
                    });
                    html += `</div>`;
                    slide.innerHTML = html;
                    commentsList.appendChild(slide);
                }

                if (document.getElementById("statTotal")) document.getElementById("statTotal").innerText = stats.total;
                if (document.getElementById("statHadir")) document.getElementById("statHadir").innerText = stats.hadir;
                if (document.getElementById("statTidak")) document.getElementById("statTidak").innerText = stats.absen;
                
                if (swiper) swiper.update();
            });
        }
    }
});

/* ============================================================
   CLIPBOARD FUNCTIONS (OUTSIDE DOMCONTENTLOADED FOR GLOBAL ACCESS)
   ============================================================ */

function copyVoucher() {
    const codeEl = document.getElementById('promoCode');
    if (!codeEl) return;
    
    const code = codeEl.innerText;
    const toast = document.getElementById('toast');
    
    navigator.clipboard.writeText(code).then(() => {
        if (toast) {
            toast.innerText = "Kode Promo Tersalin!";
            toast.classList.add("show");
            setTimeout(() => { toast.classList.remove("show"); }, 2000);
        }
    }).catch(err => console.error('Gagal menyalin:', err));
}

function copyNum(val, el) {
    navigator.clipboard.writeText(val).then(() => {
        const originalHTML = el.innerHTML;
        el.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';
        el.classList.add('success');
        
        setTimeout(() => {
            el.innerHTML = originalHTML;
            el.classList.remove('success');
        }, 2000);
    });
}