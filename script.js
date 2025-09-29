// Load data from localStorage
let data = JSON.parse(localStorage.getItem("fitnessData")) || {
    pushups: [],
    pullups: []
  };
  
  // DOM elements
  const menuToggle = document.getElementById('menuToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  
  // Toggle sidebar
  menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    mainContent.style.filter = 'blur(5px)';
  });
  
  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
    mainContent.style.filter = 'none';
  });
  
// Nav items click
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
      // Remove active from all nav items
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
  
      const page = this.getAttribute('data-page');
      showPage(page);
  
      // Close sidebar
      sidebar.classList.remove('active');
      mainContent.style.filter = 'none';
  
      // ✅ Hamburger (3 chiziq) ni qaytarish
      menuToggle.style.display = 'flex';
      setTimeout(() => {
        menuToggle.style.opacity = '1';
      }, 10);
    });
  });
  
  // Show specific page
  function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    document.getElementById(pageName).classList.add('active');
  
    // Refresh history if needed
    if (pageName === 'pushups') renderPushUpsHistory();
    if (pageName === 'pullups') renderPullUpsHistory();
    if (pageName === 'history') {
      renderFullHistory();
      updateStats();
    }
  }
  
  // Save push-ups
  function savePushUps() {
    const valueInput = document.getElementById('pushups-input');
    const dateInput = document.getElementById('pushups-date');
    const value = parseInt(valueInput.value);
    const date = dateInput.value || new Date().toISOString().split('T')[0]; // Agar tanlanmasa — bugun
  
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid number!');
      return;
    }
  
    const entry = { date, value };
    const existingIndex = data.pushups.findIndex(e => e.date === date);
    if (existingIndex > -1) {
      data.pushups[existingIndex] = entry;
    } else {
      data.pushups.push(entry);
    }
  
    saveData();
    valueInput.value = '';
    showToast("✅ Push-up saved!");
    renderPushUpsHistory(); // Tarixni yangila
  }
  
  // Pull-ups uchun ham shunday
  function savePullUps() {
    const valueInput = document.getElementById('pullups-input');
    const dateInput = document.getElementById('pullups-date');
    const value = parseInt(valueInput.value);
    const date = dateInput.value || new Date().toISOString().split('T')[0];
  
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid number!');
      return;
    }
  
    const entry = { date, value };
    const existingIndex = data.pullups.findIndex(e => e.date === date);
    if (existingIndex > -1) {
      data.pullups[existingIndex] = entry;
    } else {
      data.pullups.push(entry);
    }
  
    saveData();
    valueInput.value = '';
    showToast("✅ Pull-up saved!");
    renderPullUpsHistory();
  }
  
  // Save to localStorage
  function saveData() {
    localStorage.setItem("fitnessData", JSON.stringify(data));
  }
  
  // Render histories
  function renderPushUpsHistory() {
    const container = document.getElementById('pushups-history');
    container.innerHTML = '';
  
    if (data.pushups.length === 0) {
      container.innerHTML = '<p>No records yet.</p>';
      return;
    }
  
    const sorted = [...data.pushups].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(e => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `<span>${formatDate(e.date)}</span> <strong>${e.value}</strong>`;
      container.appendChild(div);
    });
  }
  
  function renderPullUpsHistory() {
    const container = document.getElementById('pullups-history');
    container.innerHTML = '';
  
    if (data.pullups.length === 0) {
      container.innerHTML = '<p>No records yet.</p>';
      return;
    }
  
    const sorted = [...data.pullups].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(e => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `<span>${formatDate(e.date)}</span> <strong>${e.value}</strong>`;
      container.appendChild(div);
    });
  }
  
  function renderFullHistory() {
    const container = document.getElementById('full-history');
    container.innerHTML = '';
  
    const allDates = [...new Set([
      ...data.pushups.map(e => e.date),
      ...data.pullups.map(e => e.date)
    ])].sort((a, b) => new Date(b) - new Date(a));
  
    if (allDates.length === 0) {
      container.innerHTML = '<p>No records yet.</p>';
      return;
    }
  
    allDates.forEach(date => {
      const p = data.pushups.find(e => e.date === date);
      const u = data.pullups.find(e => e.date === date);
  
      if (!p && !u) return;
  
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `
        <span class="date">${formatDate(date)}</span>
        <strong>
          ${p ? `${p.value} push-up` : ''}${p && u ? ', ' : ''}${u ? `${u.value} pull-up` : ''}
        </strong>
      `;
      container.appendChild(div);
    });
  }
  
  // Format date
  function formatDate(isoDate) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(isoDate).toLocaleDateString('en-US', options);
  }
  
  // Update stats
  function updateStats() {
    const totalP = data.pushups.reduce((sum, e) => sum + e.value, 0);
    const totalU = data.pullups.reduce((sum, e) => sum + e.value, 0);
    const days = new Set([...data.pushups, ...data.pullups].map(e => e.date)).size;
  
    document.getElementById('stats').innerHTML = `
      Total: ${totalP} push-ups, ${totalU} pull-ups | Days Tracked: ${days}
    `;
  }
  
  // Toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#333';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '1000';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
  
    document.body.appendChild(toast);
  
    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  }

  // ====================
// BILDIRISHNOMALAR (NOTIFICATIONS)
// ====================

// 1. Ruxsat so'rash
function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Bildirishnoma ruxsati berildi');
          scheduleNotifications(); // Agar ruxsat berilsa, jadvalni boshlash
        }
      });
    }
  }
  
  // 2. Kuniga 3 marta eslatma jadvali
  function scheduleNotifications() {
    const times = [9, 15, 20]; // Soat 9:00, 15:00, 20:00
    const now = new Date();
    const today = now.toISOString().split('T')[0];
  
    times.forEach(hour => {
      let notifyTime = new Date(today + `T${hour.toString().padStart(2, '0')}:00:00`);
  
      // Agar vaqt o'tib ketsa, ertangi kunga o'tkazamiz
      if (notifyTime <= now) {
        notifyTime = new Date(notifyTime.getTime() + 24 * 60 * 60 * 1000); // Ertaga
      }
  
      const delay = notifyTime - now;
  
      setTimeout(() => {
        showNotification();
        // Har kuni takrorlanishi uchun doimiy interval sozlaymiz
        setInterval(showNotification, 24 * 60 * 60 * 1000);
      }, delay);
    });
  }
  
  // 3. Bildirishnoma ko'rsatish
  function showNotification() {
    if (Notification.permission === 'granted') {
      new Notification("💪 Time to train!", {
        body: "Have you done your push-ups or pull-ups today?",
        icon: "https://cdn-icons-png.flaticon.com/512/2566/2566829.png",
        badge: "https://cdn-icons-png.flaticon.com/512/2566/2566829.png"
      });
    }
  }

    // ====================
    // SANANI CHEGARALASH: Kelajak sanalar taqiqlansin
    // ====================
    function setMaxDate() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
        input.setAttribute('max', today);
        });
    }
  
// Sahifa yuklanganda bajariladigan funksiya
window.onload = () => {
    // Yilni o'rnatish
    document.getElementById("year").textContent = new Date().getFullYear();
  
    // Dastlabki sahifa
    showPage('pushups');
  
    // Tarixlarni yuklash
    renderPushUpsHistory();
    renderPullUpsHistory();
  
    // Agar "history" faol bo'lsa
    if (document.getElementById('history').classList.contains('active')) {
      renderFullHistory();
      updateStats();
    }
  
    // 📅 Sanalarga max="today" ni qo'shish
    setMaxDate();
  
    // 🛎️ Bildirishnoma so'rash
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        scheduleNotifications();
      } else if (Notification.permission === 'default') {
        setTimeout(requestNotificationPermission, 2000);
      }
    }
  };