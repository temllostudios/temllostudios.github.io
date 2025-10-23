// Loading animation
window.addEventListener('load', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1500);
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.boxShadow = 'none';
        }
    }
});

// FAQ toggle function
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isActive = element.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-question').forEach(question => {
        question.classList.remove('active');
        if (question.nextElementSibling) {
            question.nextElementSibling.classList.remove('active');
        }
    });

    // Open clicked item if it wasn't active
    if (!isActive && answer) {
        element.classList.add('active');
        answer.classList.add('active');
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const header = document.querySelector('.header');
            
            if (targetElement && header) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Case Study Modal Functionality - Enhanced with safety checks
function initializeCaseStudyModal() {
    const caseStudyModal = document.getElementById('caseStudyModal');
    const caseStudyVideo = document.getElementById('caseStudyVideo');
    const caseStudyTitle = document.getElementById('caseStudyTitle');
    const caseStudyDescription = document.getElementById('caseStudyDescription');
    const caseStudyChallenge = document.getElementById('caseStudyChallenge');
    const caseStudySolution = document.getElementById('caseStudySolution');
    const caseStudyResults = document.getElementById('caseStudyResults');
    const caseStudyModalClose = document.querySelector('.case-study-modal-close');
    
    // Check if all required elements exist
    if (!caseStudyModal || !caseStudyModalClose) {
        console.warn('Case study modal elements not found');
        return;
    }
    
    // Open modal when case study card is clicked
    document.querySelectorAll('.case-study-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.getAttribute('data-video-id');
            const title = card.getAttribute('data-title');
            const description = card.getAttribute('data-description');
            const challenge = card.getAttribute('data-challenge');
            const solution = card.getAttribute('data-solution');
            const results = card.getAttribute('data-results');
            
            // Set video source if element exists
            if (caseStudyVideo) {
                caseStudyVideo.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&color=6b46c1&title=0&byline=0&portrait=0`;
            }
            
            // Set video info if elements exist
            if (caseStudyTitle) caseStudyTitle.textContent = title;
            if (caseStudyDescription) caseStudyDescription.textContent = description;
            if (caseStudyChallenge) caseStudyChallenge.textContent = challenge;
            if (caseStudySolution) caseStudySolution.textContent = solution;
            if (caseStudyResults) caseStudyResults.textContent = results;
            
            // Show modal
            caseStudyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    caseStudyModalClose.addEventListener('click', () => {
        caseStudyModal.classList.remove('active');
        if (caseStudyVideo) caseStudyVideo.src = '';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside content
    caseStudyModal.addEventListener('click', (e) => {
        if (e.target === caseStudyModal) {
            caseStudyModal.classList.remove('active');
            if (caseStudyVideo) caseStudyVideo.src = '';
            document.body.style.overflow = 'auto';
        }
    });
}

// Portfolio Modal Functionality
function initializePortfolioModal() {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('vimeoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const modalClose = document.querySelector('.modal-close');

    // Only initialize portfolio modal if elements exist
    if (modal && videoPlayer && modalClose) {
        // Open modal when portfolio item is clicked
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('click', () => {
                const videoId = item.getAttribute('data-video');
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;
                
                // Set video source
                videoPlayer.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&color=6b46c1&title=0&byline=0&portrait=0`;
                
                // Set video info
                if (videoTitle) videoTitle.textContent = title;
                if (videoDescription) videoDescription.textContent = description;
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close modal
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            videoPlayer.src = '';
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                videoPlayer.src = '';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Portfolio Filtering
function initializePortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get filter value
                const filterValue = button.getAttribute('data-filter');
                
                // Filter portfolio items
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category').includes(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Glass element hover effects
function initializeGlassEffects() {
    const glassElements = document.querySelectorAll('.glass');
    
    glassElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.background = 'var(--glass-hover)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.background = 'var(--glass)';
        });
    });
}

// Newsletter form submission
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input');
            const email = emailInput ? emailInput.value : '';
            
            // Simple validation
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Here you would typically send the data to your server
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScrolling();
    initializeCaseStudyModal();
    initializePortfolioModal();
    initializePortfolioFiltering();
    initializeGlassEffects();
    initializeNewsletterForm();
    initializeMobileMenu();
});