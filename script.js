document.addEventListener('DOMContentLoaded', function() {
    // 初始化 DOM 元素
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const mainContent = document.querySelector('.main-content');
    const loadingElement = document.querySelector('.loading');
    const progressBar = document.querySelector('.progress-bar');

    // 初始化顯示第一週內容
    const firstWeekButton = document.querySelector('.week-button');
    const firstWeekPane = document.querySelector('.week-pane');
    if (firstWeekButton && firstWeekPane) {
        firstWeekButton.classList.add('active');
        firstWeekPane.classList.add('active');
    }

    // 移除載入動畫
    if (loadingElement) {
        setTimeout(() => {
            loadingElement.classList.add('hidden');
            setTimeout(() => {
                loadingElement.style.display = 'none';
            }, 300);
        }, 800);
    }

    // 確保主要內容區域可見
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
    }

    // 週次按鈕點擊事件
    const weekButtons = document.querySelectorAll('.week-button');
    const weekPanes = document.querySelectorAll('.week-pane');
    
    weekButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新按鈕狀態
            weekButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 更新內容顯示
            const weekId = button.getAttribute('data-week');
            weekPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === weekId) {
                    pane.classList.add('active');
                }
            });

            // 在移動設備上關閉側邊欄
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // 日期按鈕點擊事件
    document.querySelectorAll('.day-button').forEach(button => {
        button.addEventListener('click', () => {
            const weekPane = button.closest('.week-pane');
            const dayButtons = weekPane.querySelectorAll('.day-button');
            const dayPanes = weekPane.querySelectorAll('.day-pane');
            const dayId = button.getAttribute('data-day');

            // 更新按鈕狀態
            dayButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 更新內容顯示
            dayPanes.forEach(pane => pane.classList.remove('active'));
            weekPane.querySelector(`#${dayId}`).classList.add('active');
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
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // 點擊側邊欄外部關閉側邊欄
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // 導航連結點擊事件
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetButton = document.querySelector(`[data-week="${targetId}"]`);
            if (targetButton) {
                targetButton.click();
                document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 側邊欄連結點擊事件
    document.querySelectorAll('.sidebar-content a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetButton = document.querySelector(`[data-week="${targetId}"]`);
            if (targetButton) {
                targetButton.click();
                sidebar.classList.remove('active');
                document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 返回頂部按鈕
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
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
    }

    // 進度條
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }

    // 主題切換
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // 搜尋功能
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            const weekPanes = document.querySelectorAll('.week-pane');
            
            weekPanes.forEach(pane => {
                const text = pane.textContent.toLowerCase();
                const isVisible = text.includes(searchText);
                pane.style.display = isVisible ? 'block' : 'none';
            });
        });
    }

    // 視窗大小改變時調整佈局
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });

    // 程式碼區塊展開/收起
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
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 關閉側邊欄
                sidebar.classList.remove('active');
            }
        });
    });

    // Logo 點擊事件
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            if (firstWeekButton && firstWeekPane) {
                firstWeekButton.click();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}); 