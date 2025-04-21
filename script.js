document.addEventListener('DOMContentLoaded', function() {
    // 週分頁切換
    const weekButtons = document.querySelectorAll('.week-button');
    const weekPanes = document.querySelectorAll('.week-pane');

    weekButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有週按鈕的active類
            weekButtons.forEach(btn => btn.classList.remove('active'));
            // 移除所有週內容面板的active類
            weekPanes.forEach(pane => pane.classList.remove('active'));

            // 添加當前週按鈕的active類
            button.classList.add('active');
            // 顯示對應的週內容面板
            const weekId = button.getAttribute('data-week');
            document.getElementById(weekId).classList.add('active');

            // 重置當前週的天分頁為第一個
            const currentWeekPane = document.getElementById(weekId);
            const dayButtons = currentWeekPane.querySelectorAll('.day-button');
            const dayPanes = currentWeekPane.querySelectorAll('.day-pane');
            
            dayButtons.forEach(btn => btn.classList.remove('active'));
            dayPanes.forEach(pane => pane.classList.remove('active'));
            
            dayButtons[0].classList.add('active');
            dayPanes[0].classList.add('active');
        });
    });

    // 天分頁切換
    document.querySelectorAll('.day-button').forEach(button => {
        button.addEventListener('click', () => {
            const weekPane = button.closest('.week-pane');
            const dayButtons = weekPane.querySelectorAll('.day-button');
            const dayPanes = weekPane.querySelectorAll('.day-pane');

            // 移除所有天按鈕的active類
            dayButtons.forEach(btn => btn.classList.remove('active'));
            // 移除所有天內容面板的active類
            dayPanes.forEach(pane => pane.classList.remove('active'));

            // 添加當前天按鈕的active類
            button.classList.add('active');
            // 顯示對應的天內容面板
            const dayId = button.getAttribute('data-day');
            weekPane.querySelector(`.day-pane[id="${dayId}"]`).classList.add('active');
        });
    });

    // 問答互動功能
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const quizItem = this.closest('.quiz-item');
            const options = quizItem.querySelectorAll('.option');
            const explanation = quizItem.querySelector('.explanation');
            
            // 禁用所有選項
            options.forEach(opt => opt.style.pointerEvents = 'none');
            
            // 標記正確和錯誤答案
            options.forEach(opt => {
                if (opt.getAttribute('data-correct') === 'true') {
                    opt.classList.add('correct');
                }
            });
            
            // 如果選擇錯誤，標記為錯誤
            if (this.getAttribute('data-correct') === 'false') {
                this.classList.add('incorrect');
            }
            
            // 顯示解釋
            explanation.classList.remove('hidden');
        });
    });

    // 側邊欄功能
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
    });

    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    // 返回頂部按鈕
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 進度指示器
    const progressBar = document.querySelector('.progress-bar');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // 主題切換
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 搜索功能
    const searchBox = document.querySelector('.search-box input');
    const searchToggle = document.querySelector('.search-toggle');

    searchToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        searchBox.focus();
    });

    searchBox.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        const content = document.querySelectorAll('.note-section, .quiz-section');
        
        content.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchText)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // 代碼塊展開/收起
    document.querySelectorAll('.code-example').forEach(example => {
        const toggle = document.createElement('div');
        toggle.className = 'code-toggle';
        toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        
        example.appendChild(toggle);
        
        toggle.addEventListener('click', () => {
            example.classList.toggle('collapsed');
            const icon = toggle.querySelector('i');
            if (example.classList.contains('collapsed')) {
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
            } else {
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
            }
        });
    });

    // 平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                sidebar.classList.remove('active');
            }
        });
    });

    // 移動端手勢支持
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && touchStartX < 50) {
                // 從左側滑入
                sidebar.classList.add('active');
            } else if (diff < 0 && sidebar.classList.contains('active')) {
                // 從右側滑出
                sidebar.classList.remove('active');
            }
        }
    }
}); 