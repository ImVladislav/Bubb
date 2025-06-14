class BubbPageFlip {
    constructor() {
        console.log('🚀 BubbPageFlip starting...');
        this.currentPage = 0;
        this.isScrolling = false;
        this.lastScrollTime = 0;
        this.pages = null;
        this.totalPages = 0;
        this.init();
        console.log('✅ BubbPageFlip initialized!');
    }
    
    init() {
        this.initPages();
        this.setupEventListeners();
        this.initAnimations();
        this.setupButtonListeners();
    }
    
    initPages() {
        // Ініціалізуємо сторінки
        this.pages = document.querySelectorAll('.page-wrapper');
        this.totalPages = this.pages.length;
        
        // Позиціонуємо всі сторінки одну поверх одної
        this.pages.forEach((page, index) => {
            page.style.position = 'absolute';
            page.style.top = '0';
            page.style.left = '0';
            page.style.width = '100%';
            page.style.height = '100%';
            
            if (index === 0) {
                page.style.display = 'block';
                page.style.zIndex = '10';
            } else {
                page.style.display = 'block'; // Показуємо всі сторінки
                page.style.zIndex = String(this.totalPages - index); // Нижні сторінки мають менший z-index
            }
        });
        
        // Додаємо індикатор поточної сторінки
        this.addPageIndicator();
        
        console.log('📖 Pages initialized with', this.totalPages, 'pages');
    }
    
    addPageIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'page-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(128, 128, 0, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease-in-out;
        `;
        indicator.textContent = `Page ${this.currentPage + 1} / ${this.totalPages}`;
        document.body.appendChild(indicator);
    }
    
    setupEventListeners() {
        // Скрол для перегортування сторінок
        document.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Клавіатурні скорочення
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Зміна розміру вікна
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        console.log('🖱️ Scroll detected, delta:', e.deltaY);
        
        // Запобігаємо швидкому перегортанню
        if (this.isScrolling) {
            console.log('⏳ Scroll blocked - animation in progress');
            return;
        }
        
        const delta = e.deltaY;
        const currentTime = Date.now();
        
        // Захист від спаму скролу
        if (currentTime - this.lastScrollTime < 800) {
            console.log('⏳ Scroll blocked - too fast');
            return;
        }
        this.lastScrollTime = currentTime;
        
        this.isScrolling = true;
        
        if (delta > 0) {
            // Скрол вниз - наступна сторінка
            console.log('⬇️ Scrolling down - next page');
            this.nextPage();
        } else {
            // Скрол вгору - попередня сторінка
            console.log('⬆️ Scrolling up - prev page');
            this.prevPage();
        }
        
        // Дозволяємо наступний скрол через певний час
        setTimeout(() => {
            this.isScrolling = false;
            console.log('✅ Scroll unlocked');
        }, 3000);
    }
    
    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                this.nextPage();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                this.prevPage();
                break;
        }
    }
    
    handleResize() {
        // Оновлюємо розміри при зміні розміру вікна
        console.log('📱 Window resized');
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.flipToPage(this.currentPage + 1);
        }
    }
    
    prevPage() {
        if (this.currentPage > 0) {
            this.flipToPage(this.currentPage - 1);
        }
    }
    
    flipToPage(targetPage) {
        if (targetPage < 0 || targetPage >= this.totalPages) {
            console.log('❌ Invalid page number:', targetPage);
            return;
        }
        
        console.log(`🔄 Flipping from page ${this.currentPage} to page ${targetPage}`);
        
        const currentPageElement = this.pages[this.currentPage];
        const targetPageElement = this.pages[targetPage];
        const isForward = targetPage > this.currentPage;
        
        let animatingElement, staticElement;
        
        if (isForward) {
            // При пролистуванні вперед - анімуємо поточну сторінку
            animatingElement = currentPageElement;
            staticElement = targetPageElement;
            // Цільова сторінка вже видима під поточною
            targetPageElement.style.zIndex = '5';
            currentPageElement.style.zIndex = '100';
        } else {
            // При пролистуванні назад - анімуємо ПОПЕРЕДНЮ (цільову) сторінку
            animatingElement = targetPageElement;
            staticElement = currentPageElement;
            // Поточна сторінка залишається видимою під анімованою
            currentPageElement.style.zIndex = '5';
            targetPageElement.style.zIndex = '100';
        }
        
        console.log('🎬 Starting page flip animation...', isForward ? 'FORWARD' : 'BACKWARD');
        
        // Додаємо відповідний клас для анімації перегортування
        const animationClass = isForward ? 'page-flipping' : 'page-flipping-back';
        animatingElement.classList.add(animationClass);
        console.log('✅ Added', animationClass, 'class to:', animatingElement);
        
        // Створюємо простий ефект підняття кутка
        const cornerLift = document.createElement('div');
        cornerLift.className = 'corner-lift';
        animatingElement.appendChild(cornerLift);
        console.log('✅ Added corner lift effect');
        
        // Створюємо просту тінь
        const shadow = document.createElement('div');
        shadow.className = 'page-flip-shadow';
        animatingElement.appendChild(shadow);
        console.log('✅ Added shadow effect');
        
        // Через час анімації завершуємо перегортування
        setTimeout(() => {
            // Очищуємо анімовану сторінку
            animatingElement.classList.remove('page-flipping');
            animatingElement.classList.remove('page-flipping-back');
            animatingElement.style.transform = ''; // Очищуємо transform
            
            // Видаляємо тимчасові елементи
            if (cornerLift.parentNode) cornerLift.remove();
            if (shadow.parentNode) shadow.remove();
            
            // Цільова сторінка стає активною поверх всіх
            targetPageElement.style.zIndex = '10';
            
            // Оновлюємо z-index для всіх сторінок
            this.pages.forEach((page, index) => {
                if (index === targetPage) {
                    page.style.zIndex = '10'; // Активна сторінка
                } else if (index < targetPage) {
                    page.style.zIndex = '1'; // Попередні сторінки внизу
                } else {
                    page.style.zIndex = String(this.totalPages - index + 1); // Наступні сторінки в порядку
                }
            });
            
            console.log(`✅ Page ${targetPage + 1} is now visible after animation`);
        }, 2500); // Час анімації CSS (2.5 секунди)
        
        // Оновлюємо currentPage тільки після завершення анімації
        setTimeout(() => {
            this.currentPage = targetPage;
            this.updatePageIndicator();
            
            // Анімуємо контент після завершення перегортування
            this.animatePageContent();
        }, 2500);
        
        console.log(`🎬 Animation started for page ${targetPage + 1}`);
    }
    
    nextPageWithCornerEffect() {
        console.log('🔄 nextPageWithCornerEffect called');
        
        if (this.currentPage < this.totalPages - 1) {
            this.showCornerLiftEffect('next');
            setTimeout(() => {
                this.flipToPage(this.currentPage + 1);
            }, 200);
        }
    }
    
    prevPageWithCornerEffect() {
        console.log('🔄 prevPageWithCornerEffect called');
        
        if (this.currentPage > 0) {
            this.showCornerLiftEffect('prev');
            setTimeout(() => {
                this.flipToPage(this.currentPage - 1);
            }, 200);
        }
    }
    
    showCornerLiftEffect(direction) {
        const currentPageWrapper = document.querySelectorAll('.page-wrapper')[this.currentPage];
        if (!currentPageWrapper) return;
        
        console.log(`✨ Showing corner lift effect: ${direction}`);
        
        // Створюємо ефект підняття кутка перед перегортанням
        const cornerPreview = document.createElement('div');
        cornerPreview.className = 'corner-lift';
        cornerPreview.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.15) 55%, transparent 60%);
            transform-origin: top right;
            animation: cornerPreview 0.2s ease-out forwards;
            pointer-events: none;
            z-index: 15;
        `;
        
        // Додаємо CSS анімацію для попереднього перегляду
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cornerPreview {
                0% { transform: rotateZ(0deg) scale(1); opacity: 0; }
                100% { transform: rotateZ(-3deg) scale(1.05); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
        
        currentPageWrapper.appendChild(cornerPreview);
        
        // Видаляємо попередній перегляд через короткий час
        setTimeout(() => {
            if (cornerPreview.parentNode) cornerPreview.remove();
            if (style.parentNode) style.remove();
        }, 300);
    }
    
    animatePageContent() {
        // Анімуємо контент поточної сторінки з GSAP
        setTimeout(() => {
            const currentPageContent = document.querySelectorAll('.page-wrapper')[this.currentPage];
            if (currentPageContent) {
                const elements = currentPageContent.querySelectorAll('.feature-card, .stat-item, .purchase-card, .social-link');
                
                gsap.from(elements, {
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }
        }, 300);
    }
    
    initAnimations() {
        // Початкові анімації для першої сторінки
        gsap.from('.coin-animation', {
            duration: 1,
            scale: 0,
            rotation: 360,
            ease: 'back.out(1.7)'
        });
        
        gsap.from('.main-title', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power2.out',
            delay: 0.3
        });
        
        gsap.from('.subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power2.out',
            delay: 0.6
        });
        
        gsap.from('.stat-item', {
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out',
            delay: 0.9
        });
        
        gsap.from('.cta-button', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)',
            delay: 1.5
        });
        
        // Scroll indicator видалено - використовуємо hover-зони
    }
    
    setupButtonListeners() {
        // Кнопки покупки
        document.querySelectorAll('.cta-button, .purchase-button').forEach(btn => {
            btn.addEventListener('click', this.handlePurchaseClick.bind(this));
        });

        // Соціальні посилання
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', this.handleSocialClick.bind(this));
        });

        // Поле введення суми
        const input = document.querySelector('input[type="number"]');
        if (input) input.addEventListener('input', this.updateConversion.bind(this));
    }
    
    handlePurchaseClick(e) {
        e.preventDefault();
        gsap.to(e.target, {
            duration: 0.1,
            scale: 0.95,
            yoyo: true,
            repeat: 1
        });
        this.showNotification('Purchase function will be available soon!', 'info');
    }
    
    handleSocialClick(e) {
        e.preventDefault();
        const platform = e.currentTarget.querySelector('span').textContent;
        this.showNotification(`${platform} link will be available soon!`, 'info');
    }
    
    updateConversion(e) {
        const amount = parseFloat(e.target.value) || 0;
        const rate = 0.00042;
        const tokens = Math.floor(amount / rate);
        
        const conversionInfo = document.querySelector('.conversion-info span');
        if (conversionInfo) {
            conversionInfo.textContent = `≈ ${tokens.toLocaleString()} BUBB`;
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '1rem',
            color: 'white',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    updatePageIndicator() {
        const indicator = document.getElementById('page-indicator');
        if (indicator) {
            indicator.textContent = `Page ${this.currentPage + 1} / ${this.totalPages}`;
            
            // Додаємо візуальний ефект при зміні
            indicator.style.transform = 'scale(1.2)';
            indicator.style.background = 'rgba(154, 205, 50, 0.9)';
            
            setTimeout(() => {
                indicator.style.transform = 'scale(1)';
                indicator.style.background = 'rgba(128, 128, 0, 0.9)';
            }, 200);
        }
    }
}

// Ініціалізуємо після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Bubb PageFlip...');
    const app = new BubbPageFlip();
    
    // Ефекти для елементів
    const initElementEffects = () => {
        // Анімація монетки
        gsap.to('.coin-animation i', {
            duration: 3,
            rotation: 360,
            repeat: -1,
            ease: 'none'
        });
        
        // Hover ефекти для кнопок
        document.querySelectorAll('.cta-button, .purchase-button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { duration: 0.3, scale: 1.05, boxShadow: '0 10px 25px rgba(154, 205, 50, 0.4)' });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { duration: 0.3, scale: 1, boxShadow: '0 5px 15px rgba(154, 205, 50, 0.2)' });
            });
        });
        
        // Hover ефекти для карток
        document.querySelectorAll('.feature-card, .purchase-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { duration: 0.3, y: -5, boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)' });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { duration: 0.3, y: 0, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' });
            });
        });
        
        // Анімація цін
        const animatePrice = () => {
            const price = document.querySelector('.current-price');
            if (price) {
                const currentPrice = parseFloat(price.textContent.replace('$', ''));
                const variation = (Math.random() - 0.5) * 0.00001;
                const newPrice = Math.max(0.0001, currentPrice + variation);
                
                gsap.to(price, {
                    duration: 0.5,
                    scale: 1.05,
                    color: variation > 0 ? '#4ade80' : '#ef4444',
                    onComplete: () => {
                        price.textContent = `$${newPrice.toFixed(5)}`;
                        gsap.to(price, {
                            duration: 0.5,
                            scale: 1,
                            color: '#333'
                        });
                    }
                });
            }
        };
        
        // Оновлюємо ціну кожні 3 секунди
        setInterval(animatePrice, 3000);
    };
    
    initElementEffects();
});