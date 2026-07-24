document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CONMUTADOR DE TEMA (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Verificar si hay un tema guardado en localStorage, de lo contrario usar oscuro por defecto
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            
            // Efecto sutil de destello al cambiar de tema
            triggerThemeFlash('#000000');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            
            triggerThemeFlash('#ffffff');
        }
    });

    function triggerThemeFlash(color) {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.backgroundColor = color;
        flash.style.opacity = '0.15';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 0.4s ease';
        document.body.appendChild(flash);
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 400);
        }, 50);
    }


    /* ==========================================================================
       2. MENÚ MÓVIL INTERACTIVO
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = mobileMenuToggle.querySelector('i');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        if (navMenu.classList.contains('open')) {
            menuIcon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            menuIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // Cerrar menú móvil al hacer click en cualquier link
    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuIcon.classList.replace('fa-xmark', 'fa-bars');
        });
    });


    /* ==========================================================================
       3. EFECTO NAV ACTIVO AL SCROLLEAR & SHADOW NAVBAR
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navbar = document.getElementById('main-navbar');

    window.addEventListener('scroll', () => {
        // Añadir sombra/opacidad extra a la navbar al scrollear
        if (window.scrollY > 50) {
            navbar.style.top = '10px';
            navbar.style.width = '95%';
            navbar.style.padding = '12px 28px';
        } else {
            navbar.style.top = '20px';
            navbar.style.width = '90%';
            navbar.style.padding = '16px 32px';
        }

        // Detección de sección activa para iluminar menú
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       4. ANIMACIÓN AL HACER SCROLL (REVEAL ON SCROLL)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Dejar de observar una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12, // Elemento visible al 12% antes de animar
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       5. FILTRO DE PORTAFOLIO / CASOS DE ÉXITO
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Cambiar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Animación de salida y entrada suave
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(15px) scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    /* ==========================================================================
       6. CARRUSEL DE TESTIMONIOS INTERACTIVO
       ========================================================================== */
    const slider = document.getElementById('testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots-container');

    let currentSlide = 0;
    const slideCount = slides.length;
    let autoSlideInterval;

    // Crear indicadores (dots) dinámicamente
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.slider-dot');

    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
        resetAutoSlide();
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Auto rotación cada 6 segundos
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Detener auto rotación en hover para mejor experiencia
    const sliderContainer = document.querySelector('.testimonials-container');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();


    /* ==========================================================================
       7. FORMULARIOS INTERACTIVOS & TOAST MESSAGES
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    const toast = document.getElementById('toast-message');

    function showToast(messageText = '') {
        if (messageText) {
            toast.querySelector('span').textContent = messageText;
        }
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            // Mostrar estado de carga
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Enviando... <i class="fa-solid fa-circle-notch fa-spin" style="margin-left: 8px;"></i></span>`;

            // Simular envío de servidor con retraso de 1.5 segundos
            setTimeout(() => {
                // Éxito
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                showToast('¡Mensaje enviado con éxito! Nos comunicaremos contigo en menos de 24h.');
                contactForm.reset();
            }, 1500);
        });
    }

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector('input');
        const submitBtn = newsletterForm.querySelector('button');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
            
            showToast('¡Gracias por suscribirte a nuestro boletín de Growth Hacking!');
            newsletterForm.reset();
        }, 1200);
    });
});
