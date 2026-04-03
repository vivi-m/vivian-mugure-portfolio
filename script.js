/* ============================================
   VIVIAN MUGURE — PORTFOLIO WEBSITE
   JavaScript v2.0 — Security-Hardened
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ===== SECURITY UTILITIES =====
    const SecurityUtils = {
        // Sanitize string to prevent XSS
        sanitize(str) {
            if (typeof str !== 'string') return '';
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        },

        // Validate email format
        isValidEmail(email) {
            const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return re.test(email) && email.length <= 150;
        },

        // Validate name (letters, spaces, hyphens, apostrophes)
        isValidName(name) {
            const re = /^[a-zA-Z\s'\-\.]+$/;
            return re.test(name) && name.length >= 2 && name.length <= 100;
        },

        // Rate limiter
        rateLimiter: {
            submissions: [],
            maxPerWindow: 3,
            windowMs: 60000 * 5, // 5 minutes
            canSubmit() {
                const now = Date.now();
                this.submissions = this.submissions.filter(t => now - t < this.windowMs);
                return this.submissions.length < this.maxPerWindow;
            },
            recordSubmission() {
                this.submissions.push(Date.now());
            }
        }
    };

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('vm-theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('vm-theme', next);
        });
    }

    // ===== STICKY NAVBAR =====
    const navbar = document.getElementById('navbar');

    const handleNavScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('navHamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ===== HERO PARTICLES =====
    const particlesContainer = document.getElementById('heroParticles');

    if (particlesContainer) {
        const count = window.innerWidth < 768 ? 15 : 40;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            const size = `${Math.random() * 3 + 1}px`;
            particle.style.width = size;
            particle.style.height = size;
            particle.style.animationDuration = `${Math.random() * 10 + 8}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            fragment.appendChild(particle);
        }
        particlesContainer.appendChild(fragment);
    }

    // ===== SCROLL ANIMATIONS =====
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        scrollObserver.observe(el);
    });

    // ===== SKILL BAR ANIMATION =====
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                if (width && !isNaN(width) && width >= 0 && width <= 100) {
                    entry.target.style.width = `${width}%`;
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ===== COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target) || target < 0) return;
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== CONTACT FORM — SECURED =====
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        // Field error helpers
        const showFieldError = (fieldId, message) => {
            const errorEl = document.getElementById(`${fieldId}Error`);
            const field = document.getElementById(fieldId);
            if (errorEl) errorEl.textContent = message;
            if (field) field.classList.add('invalid');
        };

        const clearFieldErrors = () => {
            document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        };

        // Real-time validation feedback
        ['name', 'email', 'message'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    const val = field.value.trim();
                    const errorEl = document.getElementById(`${fieldId}Error`);
                    if (!errorEl) return;

                    if (fieldId === 'name' && val && !SecurityUtils.isValidName(val)) {
                        showFieldError('name', 'Please enter a valid name (letters only, 2-100 chars).');
                    } else if (fieldId === 'email' && val && !SecurityUtils.isValidEmail(val)) {
                        showFieldError('email', 'Please enter a valid email address.');
                    } else if (fieldId === 'message' && val && val.length < 10) {
                        showFieldError('message', 'Message must be at least 10 characters.');
                    } else {
                        if (errorEl) errorEl.textContent = '';
                        field.classList.remove('invalid');
                    }
                });
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearFieldErrors();

            // Honeypot check — if filled, it's a bot
            const honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) {
                formStatus.textContent = '\u2713 Message sent successfully! I will get back to you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
                return;
            }

            // Rate limiting
            if (!SecurityUtils.rateLimiter.canSubmit()) {
                formStatus.textContent = 'Too many submissions. Please try again later.';
                formStatus.className = 'form-status error';
                return;
            }

            const name = SecurityUtils.sanitize(document.getElementById('name').value.trim());
            const email = SecurityUtils.sanitize(document.getElementById('email').value.trim());
            const subject = SecurityUtils.sanitize(document.getElementById('subject').value.trim());
            const message = SecurityUtils.sanitize(document.getElementById('message').value.trim());

            // Validation
            let hasError = false;

            if (!name) {
                showFieldError('name', 'Name is required.');
                hasError = true;
            } else if (!SecurityUtils.isValidName(name)) {
                showFieldError('name', 'Please enter a valid name (letters only, 2-100 chars).');
                hasError = true;
            }

            if (!email) {
                showFieldError('email', 'Email is required.');
                hasError = true;
            } else if (!SecurityUtils.isValidEmail(email)) {
                showFieldError('email', 'Please enter a valid email address.');
                hasError = true;
            }

            if (!message) {
                showFieldError('message', 'Message is required.');
                hasError = true;
            } else if (message.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters.');
                hasError = true;
            }

            if (hasError) return;

            // Record the submission
            SecurityUtils.rateLimiter.recordSubmission();

            // Real form submission via local Node.js backend
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            }

            // Prepare data for Node.js backend
            const data = {
                name: name,
                email: email, 
                subject: subject,
                message: message
            };

            // CONNECTING TO THE NODE.JS BACKEND
            fetch('/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(async response => {
                const result = await response.json();
                
                if (response.ok && result.success) {
                    formStatus.textContent = `\u2713 ${result.message}`;
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = result.message || 'Oops! There was a problem submitting your form. Please try again.';
                    formStatus.className = 'form-status error';
                }
            })
            .catch(error => {
                console.error('Submission Error:', error);
                formStatus.textContent = 'Oops! Unable to connect to the server. Is the Node.js backend running?';
                formStatus.className = 'form-status error';
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i data-lucide="send"></i> Send Message';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }

                setTimeout(() => {
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }, 10000); // Wait longer for error reading
            });
        });
    }

    // ===== DOWNLOAD CV =====
    const downloadCV = document.getElementById('downloadCV');
    if (downloadCV) {
        downloadCV.addEventListener('click', (e) => {
            e.preventDefault();
            alert('CV download will be available soon! You can contact Vivian at vivianmugure36@gmail.com for her resume.');
        });
    }

    // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== TYPING EFFECT FOR HERO SUBTITLE =====
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const titles = ['Web Developer', 'UI Designer', 'Frontend Developer', 'Creative Problem Solver'];
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const typeText = () => {
            const currentTitle = titles[titleIndex];
            if (isDeleting) {
                heroSubtitle.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                heroSubtitle.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentTitle.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                typingSpeed = 500;
            }

            setTimeout(typeText, typingSpeed);
        };

        setTimeout(typeText, 2000);
    }

    // ===== TILT EFFECT ON PROJECT CARDS =====
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===== LAZY LOAD IMAGES =====
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported — already using loading="lazy" in HTML
    } else {
        // Fallback: IntersectionObserver-based lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imgObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imgObserver.observe(img));
    }
});
