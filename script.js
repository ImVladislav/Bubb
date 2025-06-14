document.addEventListener('DOMContentLoaded', function() {
    const book = document.getElementById('book');
    
    // Перевіряємо, чи завантажилися бібліотеки
    if (typeof jQuery === 'undefined' || typeof $.fn.turn === 'undefined') {
        console.error('Required libraries not loaded!');
        return;
    }

    // Ініціалізуємо turn.js
    $(book).turn({
        width: book.offsetWidth || 600,
        height: book.offsetHeight || 800,
        autoCenter: true,
        duration: 4000,
        gradients: true,
        acceleration: false,
        elevation: 50,
        display: 'single',
        when: {
            turning: function(e, page, view) {
                // Додаткова логіка при перегортанні, якщо потрібно
            }
        }
    });

    // Обробка прокрутки колеса миші
    window.addEventListener('wheel', (e) => {
        if (e.deltaY > 0) {
            $(book).turn('next');
        } else if (e.deltaY < 0) {
            $(book).turn('previous');
        }
    }, { passive: true });

    // Додаємо обробники для кнопок навігації
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            switch(action) {
                case 'prev':
                    $(book).turn('previous');
                    break;
                case 'next':
                    $(book).turn('next');
                    break;
            }
        });
    });

    // Додаємо обробник для свайпів на мобільних пристроях
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Свайп вліво - наступна сторінка
            $(book).turn('next');
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Свайп вправо - попередня сторінка
            $(book).turn('previous');
        }
    }

    // Адаптивність при зміні розміру вікна
    window.addEventListener('resize', () => {
        $(book).turn('size', book.offsetWidth, book.offsetHeight);
    });
});
