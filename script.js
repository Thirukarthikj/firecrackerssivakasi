/**
 * Sivakasi Trading Agency - Master Interactivity Engine (Professional Light Theme)
 * High-performance UI interactions, particle fireworks canvas, and catalog controls.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. ACCESSIBILITY & LAZY LOADING
    // =========================================================================
    document.querySelectorAll('[data-alt]').forEach(img => {
        if (!img.getAttribute('alt')) {
            img.setAttribute('alt', img.dataset.alt);
        }
    });

    document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    // =========================================================================
    // 2. SMOOTH SCROLL WITH HEADER OFFSET & AUTO-CLOSING MOBILE MENU
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('header');
                const headerH = header ? header.offsetHeight : 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;

                window.scrollTo({ top, behavior: 'smooth' });

                // Close mobile dropdown if open
                const mobileMenu = document.querySelector('header details[open]');
                if (mobileMenu) {
                    mobileMenu.removeAttribute('open');
                }
            }
        });
    });

    // =========================================================================
    // 3. SCROLL SPY ACTIVE NAVIGATION
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a[data-path]');
    const pathMap = {
        'hero': 'home',
        'about': 'about',
        'collections': 'collections',
        'why-choose': 'services',
        'services': 'services',
        'safety': 'safety',
        'shipping': 'shipping',
        'pricelist': 'price-list',
        'contact': 'contact'
    };

    function updateActiveNav() {
        const path = (window.location.pathname || '').toLowerCase();
        let activePath = 'home';

        if (path.includes('about.html')) activePath = 'about';
        else if (path.includes('collections.html')) activePath = 'collections';
        else if (path.includes('services.html')) activePath = 'services';
        else if (path.includes('safety.html')) activePath = 'safety';
        else if (path.includes('shipping.html')) activePath = 'shipping';
        else if (path.includes('price-list.html') || path.includes('pricelist.html')) activePath = 'price-list';
        else if (path.includes('contact.html')) activePath = 'contact';
        else activePath = 'home';

        navLinks.forEach(link => {
            const isActive = link.dataset.path === activePath;
            link.classList.toggle('bg-red-50', isActive);
            link.classList.toggle('text-red-700', isActive);
            link.classList.toggle('font-bold', isActive);
            link.classList.toggle('text-slate-600', !isActive);
        });
    }

    // =========================================================================
    // 4. HEADER FROSTED GLASS & SHADOW ON SCROLL
    // =========================================================================
    const header = document.querySelector('header');
    function handleHeaderScroll() {
        if (!header) return;
        if (window.scrollY > 40) {
            header.style.boxShadow = '0 4px 20px -4px rgba(15, 23, 42, 0.08)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.96)';
        } else {
            header.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.04)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
    }

    // =========================================================================
    // 5. SCROLL REVEAL ANIMATION
    // =========================================================================
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-animate');
                    entry.target.classList.remove('reveal-init');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('section[id]').forEach(section => {
            if (section.id === 'hero') return;
            const container = section.querySelector(':scope > div');
            if (container) {
                container.classList.add('reveal-init');
                revealObserver.observe(container);
            }
        });
    }

    // =========================================================================
    // 6. COLLECTIONS: CATEGORY TABS & LIVE SEARCH FILTER
    // =========================================================================
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
        const filterContainer = collectionsSection.querySelector('.flex.flex-wrap.items-center.justify-center');
        const productGrid = collectionsSection.querySelector('.grid.xl\\:grid-cols-5');

        const categoryMap = {
            'One Sound Crackers': 'ground',
            'Bijili Crackers': 'ground',
            'Atom Bomb Crackers': 'ground',
            'Paper Bomb Crackers': 'ground',
            'Flower Pots': 'ground',
            'Ground Chakkars': 'ground',
            'Twinkling Stars': 'kids',
            'Rockets': 'aerial',
            'Fancy Sky Shots': 'aerial',
            'Festive Gift Boxes': 'gift'
        };

        const filterLabels = {
            'All Fireworks': 'all',
            'Ground Fireworks': 'ground',
            'Aerial Fireworks': 'aerial',
            'Special Gift Boxes': 'gift',
            'Kids Special': 'kids'
        };

        if (filterContainer && productGrid) {
            const tabs = filterContainer.querySelectorAll('span');
            const cards = Array.from(productGrid.children);

            // Categorize cards
            cards.forEach(card => {
                const titleEl = card.querySelector('h3');
                const titleText = titleEl ? titleEl.textContent.trim() : '';
                card.dataset.category = categoryMap[titleText] || 'ground';
                card.dataset.title = titleText.toLowerCase();
                card.classList.add('product-card');
            });

            let currentCategory = 'all';
            let searchQuery = '';

            function applyFilter() {
                let visibleCount = 0;
                cards.forEach(card => {
                    const matchCategory = (currentCategory === 'all' || card.dataset.category === currentCategory);
                    const matchSearch = (!searchQuery || card.dataset.title.includes(searchQuery) || card.textContent.toLowerCase().includes(searchQuery));

                    if (matchCategory && matchSearch) {
                        card.classList.remove('filter-hide');
                        card.classList.add('filter-show');
                        visibleCount++;
                    } else {
                        card.classList.add('filter-hide');
                        card.classList.remove('filter-show');
                    }
                });

                // Update results counter
                const counterBadge = document.getElementById('productResultsCounter');
                if (counterBadge) {
                    counterBadge.textContent = `Showing ${visibleCount} of ${cards.length} Products`;
                }
            }

            const activeTabClass = 'px-4 py-2 rounded-full bg-red-700 text-white font-label-md text-label-md font-bold shadow-sm cursor-pointer transition-all';
            const inactiveTabClass = 'px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors font-label-md text-label-md font-medium cursor-pointer';

            tabs.forEach(tab => {
                const text = tab.textContent.trim();
                const filterKey = filterLabels[text];
                if (!filterKey) return;

                tab.dataset.filter = filterKey;
                tab.style.cursor = 'pointer';

                tab.addEventListener('click', function () {
                    tabs.forEach(t => t.className = inactiveTabClass);
                    this.className = activeTabClass;
                    currentCategory = filterKey;
                    applyFilter();
                });
            });

            // Live Search Input Listener
            const searchInput = document.getElementById('productSearchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    searchQuery = e.target.value.trim().toLowerCase();
                    applyFilter();
                });
            }
        }
    }

    // =========================================================================
    // 7. COUNTER ANIMATION FOR STATS SECTION
    // =========================================================================
    let countersStarted = false;
    const statsSection = document.getElementById('stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    const counters = statsSection.querySelectorAll('.font-headline-md');

                    counters.forEach(counter => {
                        const originalText = counter.textContent.trim();
                        const match = originalText.match(/(\d+)/);
                        if (match) {
                            const target = parseInt(match[0], 10);
                            const suffix = originalText.replace(match[0], '');
                            let current = 0;
                            const step = Math.max(1, Math.ceil(target / 45));

                            const timer = setInterval(() => {
                                current += step;
                                if (current >= target) {
                                    current = target;
                                    clearInterval(timer);
                                }
                                counter.textContent = current + suffix;
                            }, 30);
                        }
                    });
                }
            });
        }, { threshold: 0.35 });

        counterObserver.observe(statsSection);
    }

    // =========================================================================
    // 8. FLOATING BACK TO TOP
    // =========================================================================
    const backToTopBtn = document.getElementById('backToTop');
    function toggleBackToTop() {
        if (!backToTopBtn) return;
        backToTopBtn.classList.toggle('visible', window.scrollY > 450);
    }
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================================================
    // 9. ENQUIRY & WHATSAPP ORDER FORM
    // =========================================================================
    const form = document.getElementById('enquiryForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('input[type="text"]');
            const phoneInput = form.querySelector('input[type="tel"]');
            const emailInput = form.querySelector('input[type="email"]');
            const selectEl = form.querySelector('select');
            const textareaEl = form.querySelector('textarea');
            const submitBtn = form.querySelector('button[type="submit"]');

            const name = nameInput ? nameInput.value.trim() : 'Customer';
            const phone = phoneInput ? phoneInput.value.trim() : 'N/A';
            const email = (emailInput && emailInput.value.trim()) ? emailInput.value.trim() : 'Not provided';
            const orderType = selectEl ? selectEl.selectedOptions[0].text : 'General Inquiry';
            const message = textareaEl ? textareaEl.value.trim() : 'Please send the wholesale catalog';

            const formattedMsg = encodeURIComponent(
                '🎆 *New Fireworks Trade Enquiry*\n' +
                '━━━━━━━━━━━━━━━━━━━\n' +
                `👤 *Name:* ${name}\n` +
                `📞 *Phone:* ${phone}\n` +
                `✉️ *Email:* ${email}\n` +
                `📦 *Category:* ${orderType}\n` +
                `📝 *Requirement:* ${message}\n` +
                '━━━━━━━━━━━━━━━━━━━\n' +
                'Sent from Sivakasi Trading Agency Portal'
            );

            if (submitBtn) {
                const prevHTML = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="material-symbols-outlined text-[20px]" style="animation:successPulse 0.4s ease">check_circle</span>
                    <span>Directing to WhatsApp...</span>
                `;

                setTimeout(() => {
                    window.open(`https://wa.me/919655982583?text=${formattedMsg}`, '_blank');
                    submitBtn.innerHTML = prevHTML;
                    submitBtn.disabled = false;
                    form.reset();
                }, 1200);
            }
        });
    }

    // =========================================================================
    // 10. INTERACTIVE FIREWORKS CANVAS (VIBRANT SPARKS FOR LIGHT THEME)
    // =========================================================================
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const canvas = document.createElement('canvas');
        canvas.id = 'fireworksCanvas';
        heroSection.insertBefore(canvas, heroSection.firstChild.nextSibling);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = 0;
        let height = 0;

        function resizeCanvas() {
            width = canvas.width = heroSection.clientWidth;
            height = canvas.height = heroSection.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Rich radiant particle colors tuned for white background
        const colors = ['#b91c1c', '#ea580c', '#d97706', '#e11d48', '#c2410c', '#f59e0b', '#0284c7'];

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color || colors[Math.floor(Math.random() * colors.length)];
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4.5 + 1.2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.decay = Math.random() * 0.022 + 0.016;
                this.size = Math.random() * 2.8 + 1.2;
                this.gravity = 0.07;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity;
                this.vx *= 0.98;
                this.vy *= 0.98;
                this.alpha -= this.decay;
            }

            draw(context) {
                context.save();
                context.globalAlpha = Math.max(0, this.alpha);
                context.fillStyle = this.color;
                context.shadowColor = this.color;
                context.shadowBlur = 4;
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fill();
                context.restore();
            }
        }

        function createBurst(x, y, count = 26) {
            const burstColor = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(x, y, burstColor));
            }
        }

        // Click / Tap on Hero triggers explosion
        heroSection.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            createBurst(clickX, clickY, 32);
        });

        // Periodic gentle celebratory fireworks
        let lastAutoLaunch = Date.now();
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            const now = Date.now();
            if (now - lastAutoLaunch > 2400 && particles.length < 100 && window.scrollY < 800) {
                const rx = width * (0.2 + Math.random() * 0.6);
                const ry = height * (0.15 + Math.random() * 0.35);
                createBurst(rx, ry, 22);
                lastAutoLaunch = now;
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // =========================================================================
    // 11. PRICE LIST MODAL PREVIEW
    // =========================================================================
    const priceListModal = document.getElementById('priceListModal');
    const openModalBtns = document.querySelectorAll('[data-open-pricelist]');
    const closeModalBtn = document.getElementById('closePriceListModal');

    function openPriceList() {
        if (!priceListModal) return;
        priceListModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closePriceList() {
        if (!priceListModal) return;
        priceListModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openPriceList();
    }));

    if (closeModalBtn) closeModalBtn.addEventListener('click', closePriceList);
    if (priceListModal) {
        priceListModal.addEventListener('click', (e) => {
            if (e.target === priceListModal) closePriceList();
        });
    }

    // ESC key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && priceListModal && !priceListModal.classList.contains('hidden')) {
            closePriceList();
        }
    });

    // =========================================================================
    // 12. UNIFIED OPTIMIZED SCROLL LISTENER
    // =========================================================================
    const heroImg = document.querySelector('#hero .absolute img');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                handleHeaderScroll();
                toggleBackToTop();

                if (heroImg && window.scrollY < window.innerHeight) {
                    heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.12}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial triggers
    updateActiveNav();
    handleHeaderScroll();
    toggleBackToTop();
});
