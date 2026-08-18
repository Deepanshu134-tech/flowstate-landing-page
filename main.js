(function() {
    'use strict';

    // 1. DARK MODE
    
    function initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const icon = document.getElementById('theme-icon');
        const label = document.getElementById('theme-label');
        const html = document.documentElement;

        if (!toggle) return;

        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = stored || (prefersDark ? 'dark' : 'light');
        html.setAttribute('data-theme', initial);
        updateUI(initial);

        toggle.addEventListener('click', function() {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateUI(next);
        });

        function updateUI(theme) {
            if (theme === 'dark') {
                icon.textContent = '☀️';
                label.textContent = 'Light';
            } else {
                icon.textContent = '🌙';
                label.textContent = 'Dark';
            }
        }
    }

    
    // 2. MOBILE NAV

    function initMobileNav() {
        const toggle = document.getElementById('nav-toggle');
        const links = document.querySelector('.nav-links');

        if (!toggle || !links) return;

        toggle.addEventListener('click', function() {
            const isOpen = links.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
        });

        links.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // 3. STAT COUNTER

    function animateStat(el) {
        if (el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        const target = parseFloat(el.dataset.target);
        if (isNaN(target) || target <= 0) return;

        const duration = 1400;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (isDecimal) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.round(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
                // Pulse effect on completion
                el.style.transition = 'transform 0.2s ease';
                el.style.transform = 'scale(1.1)';
                setTimeout(function() {
                    el.style.transform = 'scale(1)';
                }, 200);
            }
        }
        requestAnimationFrame(update);
    }


    // 4. SCROLL REVEAL
 
    function initScrollReveal() {
        const targets = document.querySelectorAll(
            '.stat-item, .feature-card, .dashboard-mock, .section-header'
        );
        targets.forEach(function(el) {
            el.classList.add('reveal');
        });

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const stats = entry.target.querySelectorAll('.stat-number:not([data-animated])');
                    stats.forEach(function(stat) {
                        animateStat(stat);
                    });
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function(el) {
            observer.observe(el);
        });
    }

  
    // 5. INTERACTIVE DASHBOARD
   
    function initDashboard() {
        const tasks = document.querySelectorAll('.task-item');
        const remainingSpan = document.getElementById('tasks-remaining');

        if (!tasks.length) return;

        function updateRemaining() {
            const remaining = document.querySelectorAll('.task-item:not(.completed)').length;
            if (remainingSpan) {
                remainingSpan.textContent = remaining;
            }
        }

        tasks.forEach(function(task) {
            task.addEventListener('click', function(e) {
                // Don't toggle if clicking on progress bar (we want that to stay visual)
                if (e.target.closest('.progress-bar')) return;

                this.classList.toggle('completed');
                updateRemaining();

                // Haptic feedback simulation
                this.style.transition = 'transform 0.1s ease';
                this.style.transform = 'scale(0.98)';
                setTimeout(function() {
                    this.style.transform = 'scale(1)';
                }.bind(this), 100);
            });
        });

        updateRemaining();
    }

 
    // 6. KONAMI CODE + CONFETTI
   
    function initKonami() {
        const code = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'b', 'B', 'a', 'A'
        ];
        let position = 0;
        let timeout = null;

        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const key = e.key;
            const expected = code[position];
            const keyMatch = (expected === key) || (expected.toLowerCase() === key.toLowerCase());

            if (keyMatch) {
                position++;
                if (position === code.length) {
                    triggerEasterEgg();
                    position = 0;
                }
            } else {
                position = 0;
            }
        });

        function triggerEasterEgg() {
            // Show toast
            const toast = document.getElementById('easter-egg-toast');
            if (toast) {
                toast.classList.add('show');
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    toast.classList.remove('show');
                }, 4000);
            }

            // Trigger confetti
            createConfetti();
        }
    }

    
    // 7. CONFETTI
   
    function createConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        const colors = ['#6366f1', '#818cf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'];
        const pieces = 80;

        for (let i = 0; i < pieces; i++) {
            const el = document.createElement('div');
            el.className = 'confetti-piece';
            el.style.left = Math.random() * 100 + '%';
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.width = (Math.random() * 6 + 4) + 'px';
            el.style.height = (Math.random() * 6 + 4) + 'px';
            el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            el.style.setProperty('--duration', (Math.random() * 2 + 2) + 's');
            el.style.animationDelay = (Math.random() * 1.5) + 's';

            container.appendChild(el);

            // Remove after animation
            setTimeout(function() {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 4000);
        }

        // Clean up after all pieces
        setTimeout(function() {
            container.innerHTML = '';
        }, 5000);
    }

 
    // 8. CHECK INITIAL STATS
   
    function checkInitialStats() {
        const stats = document.querySelectorAll('.stat-number:not([data-animated])');
        stats.forEach(function(el) {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
            if (isVisible) {
                animateStat(el);
            }
        });
    }

 
    // 9. HANDLE RESIZE
    
    function handleResize() {
        const links = document.querySelector('.nav-links');
        const toggle = document.getElementById('nav-toggle');
        if (window.innerWidth > 768 && links && links.classList.contains('open')) {
            links.classList.remove('open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
    }

    // 10. INIT
   
    document.addEventListener('DOMContentLoaded', function() {
        initTheme();
        initMobileNav();
        initScrollReveal();
        initDashboard();
        initKonami();
        checkInitialStats();

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        }, { passive: true });
    });

})();