// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const skillBars = document.querySelectorAll('.skill-progress');

// Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    mobileMenu.classList.remove('active');
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                closeMobileMenu();
            }
        });
    });
}

// Navbar Background on Scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
            ? 'rgba(26, 32, 44, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'rgba(26, 32, 44, 0.95)'
            : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Animate Skill Bars on Scroll
function animateSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                skillBar.style.width = width;
                observer.unobserve(skillBar);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        bar.style.width = '0';
        observer.observe(bar);
    });
}

// Form Validation and Submission
function handleContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const subject = formData.get('subject')?.toString().trim();
        const message = formData.get('message')?.toString().trim();
        const recipientEmail = contactForm.getAttribute('data-email') || 'mohammadroshan72khan@gmail.com';

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(`Portfolio Contact: ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

        window.location.href = mailtoLink;
        showNotification('Your email app should open with your message ready to send. If it does not, please email me directly at mohammadroshan72khan@gmail.com.', 'success');
        contactForm.reset();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;

    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        padding: 0;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Manual close
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add CSS animations for notifications
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.project-card, .skill-category, .education-card, .about-text, .contact-info, .contact-form');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Active Navigation Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Typing Animation for Hero Title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const originalText = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let charIndex = 0;
    const typingSpeed = 50;

    function typeChar() {
        if (charIndex < originalText.length) {
            heroTitle.innerHTML = originalText.slice(0, charIndex + 1);
            charIndex++;
            setTimeout(typeChar, typingSpeed);
        }
    }

    setTimeout(typeChar, 500);
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-content');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            parallax.style.opacity = 1 - scrolled / 600;
        }
    });
}

// Dynamic Project Filtering
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Initialize skill bars animation
    animateSkillBars();
    
    // Initialize contact form
    handleContactForm();
    
    // Initialize typing animation
    initTypingAnimation();
    
    // Initialize parallax effect
    initParallaxEffect();

    // Initialize project filters
    initProjectFilters();
    
    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    mobileMenu.addEventListener('click', toggleMobileMenu);
    
    // Scroll event listeners
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Initialize certifications logic
    initCertificates();
});

// Add ripple animation
const rippleStyles = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handlers
window.addEventListener('scroll', debounce(() => {
    handleNavbarScroll();
    updateActiveNavLink();
}, 10));

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Skill Information Database
const skillInfo = {
    // Programming Languages
    'C': {
        title: 'C Programming Language',
        description: 'A powerful, low-level programming language known for its efficiency and portability.',
        details: `
            <h3>What is C?</h3>
            <p>C is a general-purpose programming language created in the 1970s. It's known for its simplicity, efficiency, and close-to-hardware capabilities.</p>
            
            <h3>My Experience</h3>
            <p>I have advanced proficiency in C programming, using it for:</p>
            <ul>
                <li>Data structure implementations</li>
                <li>Algorithm development and optimization</li>
                <li>System programming concepts</li>
                <li>Memory management and pointer operations</li>
            </ul>
            
            <h3>Key Projects</h3>
            <p>Applied C programming in academic projects focusing on:</p>
            <ul>
                <li>Buffer management systems</li>
                <li>Memory-efficient algorithms</li>
                <li>Low-level data structures</li>
            </ul>
        `
    },
    'Java': {
        title: 'Java Programming Language',
        description: 'A versatile, object-oriented programming language widely used in enterprise applications.',
        details: `
            <h3>What is Java?</h3>
            <p>Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible.</p>
            
            <h3>My Experience</h3>
            <p>I have advanced proficiency in Java, with experience in:</p>
            <ul>
                <li>Object-oriented programming principles</li>
                <li>Android application development</li>
                <li>Multi-threading and concurrent programming</li>
                <li>JavaFX and GUI development</li>
            </ul>
            
            <h3>Applications</h3>
            <p>Used Java extensively for:</p>
            <ul>
                <li>Android mobile applications</li>
                <li>Desktop applications</li>
                <li>Backend services and APIs</li>
            </ul>
        `
    },
    'Python': {
        title: 'Python Programming Language',
        description: 'A high-level, interpreted programming language known for its simplicity and extensive libraries.',
        details: `
            <h3>What is Python?</h3>
            <p>Python is an interpreted, high-level programming language with dynamic semantics. Its high-level built-in data structures make it attractive for rapid application development.</p>
            
            <h3>My Experience</h3>
            <p>I have advanced proficiency in Python, specializing in:</p>
            <ul>
                <li>Machine learning and AI applications</li>
                <li>Data analysis and visualization</li>
                <li>Web development with Django and Flask</li>
                <li>Automation and scripting</li>
            </ul>
            
            <h3>Key Libraries</h3>
            <p>Experienced with popular Python libraries:</p>
            <ul>
                <li>TensorFlow and PyTorch for ML</li>
                <li>Pandas and NumPy for data analysis</li>
                <li>Django for web development</li>
                <li>OpenCV for computer vision</li>
            </ul>
        `
    },
    'JavaScript': {
        title: 'JavaScript Programming Language',
        description: 'A versatile, high-level, interpreted scripting language that is a core technology of the World Wide Web.',
        details: `
            <h3>What is JavaScript?</h3>
            <p>JavaScript is a text-based programming language used both on the client-side and server-side that allows you to make web pages interactive.</p>
            
            <h3>My Experience</h3>
            <p>I use JavaScript extensively in full-stack and front-end development, including:</p>
            <ul>
                <li>Developing interactive and dynamic web interfaces</li>
                <li>Full-stack development with Node.js and Express</li>
                <li>Working with modern frontend tools and web technologies</li>
                <li>Building client-side logic and API integrations</li>
            </ul>
            
            <h3>Applications</h3>
            <p>Applied JavaScript in projects such as:</p>
            <ul>
                <li>AI Study Notes Generator (backend and interactive cards)</li>
                <li>Smart AI Doctor Booking Portal</li>
                <li>Dynamic portfolio interactions</li>
            </ul>
        `
    },
    // Technologies
    'Machine Learning': {
        title: 'Machine Learning',
        description: 'The field of study that gives computers the ability to learn without being explicitly programmed.',
        details: `
            <h3>What is Machine Learning?</h3>
            <p>Machine Learning is a subset of artificial intelligence that focuses on the development of algorithms that can learn and make predictions or decisions based on data.</p>
            
            <h3>My Expertise</h3>
            <p>I have strong knowledge in:</p>
            <ul>
                <li>Supervised learning algorithms</li>
                <li>Unsupervised learning techniques</li>
                <li>Neural networks and deep learning</li>
                <li>Model evaluation and optimization</li>
            </ul>
            
            <h3>Practical Applications</h3>
            <p>Applied ML in various domains:</p>
            <ul>
                <li>Image classification and analysis</li>
                <li>Natural language processing</li>
                <li>Predictive modeling</li>
                <li>Data mining and pattern recognition</li>
            </ul>
        `
    },
    'Data Mining': {
        title: 'Data Mining',
        description: 'The process of discovering patterns in large data sets involving methods at the intersection of machine learning, statistics, and database systems.',
        details: `
            <h3>What is Data Mining?</h3>
            <p>Data mining is the practice of examining large pre-existing databases in order to generate new information.</p>
            
            <h3>My Skills</h3>
            <p>Proficient in data mining techniques:</p>
            <ul>
                <li>Data preprocessing and cleaning</li>
                <li>Pattern recognition algorithms</li>
                <li>Clustering and classification</li>
                <li>Association rule mining</li>
            </ul>
            
            <h3>Tools and Technologies</h3>
            <p>Experienced with:</p>
            <ul>
                <li>Python data science stack</li>
                <li>Statistical analysis methods</li>
                <li>Big data processing techniques</li>
                <li>Visualization tools</li>
            </ul>
        `
    },
    'DBMS': {
        title: 'Database Management Systems',
        description: 'Software that interacts with end users, applications, and the database itself to capture and analyze data.',
        details: `
            <h3>What is DBMS?</h3>
            <p>A Database Management System is a software system designed to allow the definition, creation, querying, update, and administration of databases.</p>
            
            <h3>My Experience</h3>
            <p>Strong foundation in database concepts:</p>
            <ul>
                <li>Relational database design</li>
                <li>SQL query optimization</li>
                <li>Database normalization</li>
                <li>Transaction management</li>
            </ul>
            
            <h3>Technologies Used</h3>
            <p>Proficient with:</p>
            <ul>
                <li>MySQL and PostgreSQL</li>
                <li>NoSQL databases (MongoDB)</li>
                <li>Database design patterns</li>
                <li>Performance tuning</li>
            </ul>
        `
    },
    'Android Development': {
        title: 'Android Development',
        description: 'The process of creating applications for devices running the Android operating system.',
        details: `
            <h3>Android Development</h3>
            <p>Android development involves creating mobile applications for the world's most popular mobile operating system.</p>
            
            <h3>My Skills</h3>
            <p>Experienced in Android development with:</p>
            <ul>
                <li>Java and Kotlin programming</li>
                <li>Android SDK and APIs</li>
                <li>UI/UX design principles</li>
                <li>Material Design guidelines</li>
            </ul>
            
            <h3>Project Experience</h3>
            <p>Worked on:</p>
            <ul>
                <li>Notification analysis applications</li>
                <li>Multimedia processing apps</li>
                <li>Security-focused mobile solutions</li>
                <li>User interface optimization</li>
            </ul>
        `
    },
    'Data Structures': {
        title: 'Data Structures',
        description: 'A way of organizing and storing data in a computer so that it can be accessed and modified efficiently.',
        details: `
            <h3>Data Structures</h3>
            <p>Data structures are the building blocks of efficient algorithms and are essential for organizing data in computer programs.</p>
            
            <h3>My Knowledge</h3>
            <p>Strong understanding of:</p>
            <ul>
                <li>Arrays, linked lists, and trees</li>
                <li>Stacks, queues, and heaps</li>
                <li>Hash tables and dictionaries</li>
                <li>Graphs and graph algorithms</li>
            </ul>
            
            <h3>Practical Implementation</h3>
            <p>Implemented various data structures in:</p>
            <ul>
                <li>Buffer management systems</li>
                <li>Algorithm optimization problems</li>
                <li>Memory-efficient solutions</li>
                <li>Performance-critical applications</li>
            </ul>
        `
    },
    'Algorithms': {
        title: 'Algorithms',
        description: 'A step-by-step procedure for solving a problem in a finite number of steps.',
        details: `
            <h3>Algorithms</h3>
            <p>Algorithms are fundamental to computer science and are the heart of efficient problem-solving in programming.</p>
            
            <h3>My Expertise</h3>
            <p>Strong algorithmic knowledge in:</p>
            <ul>
                <li>Sorting and searching algorithms</li>
                <li>Dynamic programming</li>
                <li>Greedy algorithms</li>
                <li>Graph algorithms and traversals</li>
            </ul>
            
            <h3>Applications</h3>
            <p>Applied algorithms in:</p>
            <ul>
                <li>Optimization problems</li>
                <li>Data processing pipelines</li>
                <li>Machine learning implementations</li>
                <li>System design solutions</li>
            </ul>
        `
    },
    'OOP Concepts': {
        title: 'Object-Oriented Programming',
        description: 'A programming paradigm based on the concept of objects, which can contain data and code.',
        details: `
            <h3>Object-Oriented Programming</h3>
            <p>OOP is a programming paradigm that organizes software design around data, or objects, rather than functions and logic.</p>
            
            <h3>Core Concepts</h3>
            <p>Strong grasp of OOP principles:</p>
            <ul>
                <li>Encapsulation and abstraction</li>
                <li>Inheritance and polymorphism</li>
                <li>Class and object design</li>
                <li>Design patterns</li>
            </ul>
            
            <h3>Practical Application</h3>
            <p>Applied OOP in:</p>
            <ul>
                <li>Java application development</li>
                <li>C++ system programming</li>
                <li>Python class design</li>
                <li>Software architecture</li>
            </ul>
        `
    },
    'Web Development': {
        title: 'Web Development',
        description: 'The work involved in developing websites for the Internet or an intranet.',
        details: `
            <h3>Web Development</h3>
            <p>Web development encompasses the creation and maintenance of websites and web applications.</p>
            
            <h3>My Skills</h3>
            <p>Proficient in:</p>
            <ul>
                <li>HTML5, CSS3, and JavaScript</li>
                <li>Responsive web design</li>
                <li>Frontend frameworks (React, Vue)</li>
                <li>Backend development (Node.js, Django)</li>
            </ul>
            
            <h3>Portfolio Examples</h3>
            <p>Created:</p>
            <ul>
                <li>Personal portfolio websites</li>
                <li>Responsive web applications</li>
                <li>Interactive user interfaces</li>
                <li>Modern web experiences</li>
            </ul>
        `
    },
    // Tools
    'Git': {
        title: 'Git Version Control',
        description: 'A distributed version control system for tracking changes in source code during software development.',
        details: `
            <h3>Git Version Control</h3>
            <p>Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.</p>
            
            <h3>My Git Skills</h3>
            <p>Proficient in Git operations:</p>
            <ul>
                <li>Branching and merging strategies</li>
                <li>Conflict resolution</li>
                <li>Collaborative workflows</li>
                <li>Repository management</li>
            </ul>
            
            <h3>Experience</h3>
            <p>Used Git for:</p>
            <ul>
                <li>Academic project collaboration</li>
                <li>Open source contributions</li>
                <li>Version control best practices</li>
                <li>Continuous integration workflows</li>
            </ul>
        `
    },
    'GitHub': {
        title: 'GitHub Platform',
        description: 'A cloud-based platform for hosting, sharing, and collaborating on code repositories.',
        details: `
            <h3>GitHub</h3>
            <p>GitHub is a widely used platform for version control, collaboration, and project sharing in software development.</p>
            
            <h3>My Usage</h3>
            <p>I use GitHub for:</p>
            <ul>
                <li>Hosting personal and academic projects</li>
                <li>Tracking issues and project progress</li>
                <li>Collaborating with teammates</li>
                <li>Showcasing repositories and portfolios</li>
            </ul>
            
            <h3>Workflow</h3>
            <p>Common workflows include:</p>
            <ul>
                <li>Pull requests and code review</li>
                <li>Branch-based development</li>
                <li>Repository documentation</li>
                <li>Deployment and project visibility</li>
            </ul>
        `
    },
    'AI Tools': {
        title: 'AI Tools',
        description: 'Modern AI-powered tools used for productivity, automation, coding assistance, and experimentation.',
        details: `
            <h3>AI Tools</h3>
            <p>AI tools help speed up development, improve productivity, and support idea generation across technical workflows.</p>
            
            <h3>How I Use Them</h3>
            <p>I leverage AI tools for:</p>
            <ul>
                <li>Code generation and debugging support</li>
                <li>Learning new concepts faster</li>
                <li>Writing and refining documentation</li>
                <li>Exploring AI-driven solutions and ideas</li>
            </ul>
            
            <h3>Benefits</h3>
            <p>They are especially helpful for:</p>
            <ul>
                <li>Rapid prototyping</li>
                <li>Productivity enhancement</li>
                <li>Creative problem solving</li>
                <li>Experimenting with intelligent workflows</li>
            </ul>
        `
    },
    'Android Studio': {
        title: 'Android Studio IDE',
        description: 'The official integrated development environment for Android application development.',
        details: `
            <h3>Android Studio</h3>
            <p>Android Studio is the official IDE for Android development, providing a complete development environment for building high-quality Android apps.</p>
            
            <h3>My Experience</h3>
            <p>Skilled in using Android Studio for:</p>
            <ul>
                <li>Project setup and configuration</li>
                <li>Debugging and testing</li>
                <li>Performance profiling</li>
                <li>UI design with Layout Editor</li>
            </ul>
            
            <h3>Development Features</h3>
            <p>Experienced with:</p>
            <ul>
                <li>Emulator management</li>
                <li>Gradle build system</li>
                <li>Code analysis tools</li>
                <li>Version control integration</li>
            </ul>
        `
    },
    'VS Code': {
        title: 'Visual Studio Code',
        description: 'A lightweight but powerful source code editor developed by Microsoft.',
        details: `
            <h3>Visual Studio Code</h3>
            <p>VS Code is a free source-code editor made by Microsoft for Windows, Linux and macOS. It includes support for debugging, embedded Git control, and syntax highlighting.</p>
            
            <h3>My VS Code Setup</h3>
            <p>Extensive experience with:</p>
            <ul>
                <li>Multi-language development</li>
                <li>Extension marketplace</li>
                <li>Integrated terminal</li>
                <li>Debugging configurations</li>
            </ul>
            
            <h3>Productivity Features</h3>
            <p>Utilize features like:</p>
            <ul>
                <li>IntelliSense and autocomplete</li>
                <li>Code formatting and linting</li>
                <li>Git integration</li>
                <li>Custom themes and shortcuts</li>
            </ul>
        `
    },
    'Jupyter Notebook': {
        title: 'Jupyter Notebook',
        description: 'An open-source web application that allows you to create and share documents that contain live code, equations, visualizations and narrative text.',
        details: `
            <h3>Jupyter Notebook</h3>
            <p>Jupyter Notebook is an interactive web application for creating and sharing computational documents.</p>
            
            <h3>My Usage</h3>
            <p>Extensively used for:</p>
            <ul>
                <li>Data analysis and exploration</li>
                <li>Machine learning prototyping</li>
                <li>Statistical modeling</li>
                <li>Research documentation</li>
            </ul>
            
            <h3>Key Features</h3>
            <p>Leverage capabilities like:</p>
            <ul>
                <li>Interactive code execution</li>
                <li>Data visualization integration</li>
                <li>Markdown documentation</li>
                <li>Export to multiple formats</li>
            </ul>
        `
    },
    'MySQL': {
        title: 'MySQL Database',
        description: 'An open-source relational database management system.',
        details: `
            <h3>MySQL Database</h3>
            <p>MySQL is an open-source relational database management system that is widely used for web applications and data storage.</p>
            
            <h3>My MySQL Skills</h3>
            <p>Proficient in:</p>
            <ul>
                <li>Database design and modeling</li>
                <li>Complex query writing</li>
                <li>Indexing and optimization</li>
                <li>Database administration</li>
            </ul>
            
            <h3>Practical Applications</h3>
            <p>Used MySQL for:</p>
            <ul>
                <li>Web application backends</li>
                <li>Data persistence layers</li>
                <li>Reporting systems</li>
                <li>Data warehousing solutions</li>
            </ul>
        `
    },
    'TensorFlow': {
        title: 'TensorFlow',
        description: 'An end-to-end open source platform for machine learning.',
        details: `
            <h3>TensorFlow</h3>
            <p>TensorFlow is a free and open-source software library for machine learning and artificial intelligence.</p>
            
            <h3>My TensorFlow Experience</h3>
            <p>Skilled in:</p>
            <ul>
                <li>Neural network architecture design</li>
                <li>Model training and optimization</li>
                <li>TensorFlow Lite for mobile</li>
                <li>Custom model development</li>
            </ul>
            
            <h3>Applications</h3>
            <p>Applied TensorFlow in:</p>
            <ul>
                <li>Image classification projects</li>
                <li>Natural language processing</li>
                <li>Mobile ML applications</li>
                <li>Deep learning research</li>
            </ul>
        `
    },
    'Scikit-learn': {
        title: 'Scikit-learn',
        description: 'A simple and efficient tool for data mining and data analysis.',
        details: `
            <h3>Scikit-learn</h3>
            <p>Scikit-learn is a free software machine learning library for the Python programming language.</p>
            
            <h3>My Expertise</h3>
            <p>Proficient with scikit-learn for:</p>
            <ul>
                <li>Classification and regression</li>
                <li>Clustering algorithms</li>
                <li>Dimensionality reduction</li>
                <li>Model selection and evaluation</li>
            </ul>
            
            <h3>Project Usage</h3>
            <p>Used scikit-learn in:</p>
            <ul>
                <li>Predictive modeling</li>
                <li>Data preprocessing pipelines</li>
                <li>Cross-validation techniques</li>
                <li>Hyperparameter tuning</li>
            </ul>
        `
    },
    'Postman': {
        title: 'Postman API Platform',
        description: 'An API platform for building and using APIs.',
        details: `
            <h3>Postman</h3>
            <p>Postman is a collaboration platform for API development used by developers to build, test and document APIs.</p>
            
            <h3>My Postman Skills</h3>
            <p>Experienced in:</p>
            <ul>
                <li>API testing and debugging</li>
                <li>Collection management</li>
                <li>Environment variables</li>
                <li>Automated testing workflows</li>
            </ul>
            
            <h3>Development Workflow</h3>
            <p>Use Postman for:</p>
            <ul>
                <li>RESTful API testing</li>
                <li>Request/response validation</li>
                <li>Performance testing</li>
                <li>API documentation</li>
            </ul>
        `
    }
};

// Modal functionality
const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.getElementsByClassName('close')[0];

// Open modal when clicking on skills
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('clickable-skill')) {
        const skillName = e.target.getAttribute('data-skill');
        const info = skillInfo[skillName];
        
        if (info) {
            modalTitle.textContent = info.title;
            modalContent.innerHTML = info.details;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    if (e.target.classList.contains('clickable-tech')) {
        const techName = e.target.getAttribute('data-tech');
        const info = skillInfo[techName];
        
        if (info) {
            modalTitle.textContent = info.title;
            modalContent.innerHTML = info.details;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
});

// Close modal when clicking on X
closeBtn.onclick = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Console welcome message
console.log('%c👋 Welcome to Roshan\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cBuilt with passion and modern web technologies', 'font-size: 14px; color: #764ba2;');

// Certificates Database and Management
// Admin Configuration
let adminPassword = "roshanadmin123"; // Change this to your preferred admin password

// Certificates Database and Management
let certificates = [];

function getAdminPassword() {
    const savedPassword = localStorage.getItem('portfolio_admin_password');
    return savedPassword || adminPassword;
}

function saveAdminPassword(pass) {
    localStorage.setItem('portfolio_admin_password', pass);
}

function getCertificates() {
    const saved = localStorage.getItem('portfolio_certificates');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Error parsing certificates from localStorage", e);
        }
    }
    return certificates;
}

function saveCertificates(list) {
    localStorage.setItem('portfolio_certificates', JSON.stringify(list));
}

function renderCertificates() {
    const list = getCertificates();
    const grid = document.getElementById('certifications-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const isAdmin = localStorage.getItem('portfolio_admin_logged_in') === 'true';
    
    if (list.length === 0) {
        grid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No certifications added yet.</p>';
        return;
    }
    
    list.forEach((cert, idx) => {
        const card = document.createElement('div');
        card.className = 'cert-card';
        
        let linkHTML = '';
        if (cert.link) {
            linkHTML = `
                <a href="${cert.link}" target="_blank" class="cert-btn">
                    <i class="fas fa-external-link-alt"></i> Verify
                </a>
            `;
        } else if (cert.fileData) {
            linkHTML = `
                <a href="${cert.fileData}" target="_blank" class="cert-btn" download="${cert.title.replace(/\s+/g, '_')}_Certificate">
                    <i class="fas fa-file-download"></i> View File
                </a>
            `;
        }
        
        let adminButtons = '';
        if (isAdmin) {
            adminButtons = `
                <div class="cert-actions-admin">
                    <button class="btn btn-secondary btn-sm edit-cert-btn" data-index="${idx}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-cert-btn" data-index="${idx}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div>
                <div class="cert-card-header">
                    <div class="cert-icon">
                        <i class="fas fa-award"></i>
                    </div>
                    <div class="cert-card-info">
                        <h3>${cert.title}</h3>
                        <span class="cert-issuer">${cert.issuer}</span>
                    </div>
                </div>
                <div class="cert-date">Issued: ${cert.date}</div>
            </div>
            <div class="cert-footer">
                ${linkHTML}
                ${adminButtons}
            </div>
        `;
        grid.appendChild(card);
    });
    
    if (isAdmin) {
        document.querySelectorAll('.delete-cert-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                if (confirm('Are you sure you want to delete this certificate?')) {
                    const currentList = getCertificates();
                    currentList.splice(idx, 1);
                    saveCertificates(currentList);
                    renderCertificates();
                }
            });
        });
        
        document.querySelectorAll('.edit-cert-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                const currentList = getCertificates();
                const cert = currentList[idx];
                
                document.getElementById('edit-cert-index').value = idx;
                document.getElementById('cert-title').value = cert.title;
                document.getElementById('cert-issuer').value = cert.issuer;
                document.getElementById('cert-date').value = cert.date;
                document.getElementById('cert-link').value = cert.link || '';
                
                document.getElementById('certFormTitle').textContent = 'Edit Certificate';
                document.getElementById('certFormModal').style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
    }
}

function checkAdminState() {
    const isAdmin = localStorage.getItem('portfolio_admin_logged_in') === 'true';
    const adminPanel = document.getElementById('admin-panel');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    
    if (isAdmin) {
        if (adminPanel) adminPanel.classList.remove('hidden');
        if (adminLoginBtn) adminLoginBtn.innerHTML = '<i class="fas fa-user-cog"></i> Admin Mode';
    } else {
        if (adminPanel) adminPanel.classList.add('hidden');
        if (adminLoginBtn) adminLoginBtn.innerHTML = '<i class="fas fa-lock"></i> Manage';
    }
    renderCertificates();
}

function exportScriptJS() {
    fetch('script.js')
        .then(response => response.text())
        .then(text => {
            const currentList = getCertificates();
            const cleanList = currentList.map(cert => ({
                title: cert.title,
                issuer: cert.issuer,
                date: cert.date,
                link: cert.link,
                fileData: cert.fileData
            }));
            const listJSON = JSON.stringify(cleanList, null, 4);
            
            // Replace certificates list
            const certRegex = /(let\s+certificates\s*=\s*\[)[\s\S]*?(\];)/;
            let newText = text.replace(certRegex, `$1\n${listJSON.slice(2, -2)}\n$2`);
            
            // Replace adminPassword in the script code
            const currentPassword = getAdminPassword();
            const passRegex = /let\s+adminPassword\s*=\s*".*?";/;
            newText = newText.replace(passRegex, `let adminPassword = "${currentPassword}";`);
            
            const blob = new Blob([newText], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'script.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Successfully exported script.js! Replace your local script.js file with this downloaded file, commit and push to make additions permanent.', 'success');
        })
        .catch(err => {
            console.error("Error exporting script.js", err);
            showNotification('Failed to fetch script.js for export.', 'error');
        });
}

function initCertificates() {
    checkAdminState();
    
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const loginForm = document.getElementById('login-form');
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            const isAdmin = localStorage.getItem('portfolio_admin_logged_in') === 'true';
            if (isAdmin) {
                document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
            } else {
                adminLoginModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            adminLoginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            const correctPassword = getAdminPassword();
            if (password === correctPassword) {
                localStorage.setItem('portfolio_admin_logged_in', 'true');
                showNotification('Logged in successfully as admin!', 'success');
                adminLoginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                loginForm.reset();
                checkAdminState();
            } else {
                showNotification('Incorrect password! Try again.', 'error');
            }
        });
    }
    
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('portfolio_admin_logged_in');
            showNotification('Logged out from admin panel.', 'info');
            checkAdminState();
        });
    }
    
    const addCertBtn = document.getElementById('add-cert-btn');
    const certFormModal = document.getElementById('certFormModal');
    const closeCertForm = document.getElementById('close-cert-form');
    const certForm = document.getElementById('cert-form');
    
    if (addCertBtn) {
        addCertBtn.addEventListener('click', () => {
            document.getElementById('edit-cert-index').value = '';
            certForm.reset();
            document.getElementById('certFormTitle').textContent = 'Add New Certificate';
            certFormModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCertForm) {
        closeCertForm.addEventListener('click', () => {
            certFormModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (certForm) {
        certForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('cert-title').value.trim();
            const issuer = document.getElementById('cert-issuer').value.trim();
            const date = document.getElementById('cert-date').value.trim();
            const link = document.getElementById('cert-link').value.trim();
            const fileInput = document.getElementById('cert-file');
            
            const editIndexStr = document.getElementById('edit-cert-index').value;
            const isEditing = editIndexStr !== '';
            
            const currentList = getCertificates();
            
            const saveHandler = (fileDataString) => {
                const newCert = { title, issuer, date, link, fileData: fileDataString };
                if (isEditing) {
                    const idx = parseInt(editIndexStr);
                    if (!fileDataString && currentList[idx].fileData) {
                        newCert.fileData = currentList[idx].fileData;
                    }
                    currentList[idx] = newCert;
                    showNotification('Certificate updated successfully!', 'success');
                } else {
                    currentList.push(newCert);
                    showNotification('New certificate added successfully!', 'success');
                }
                
                saveCertificates(currentList);
                certFormModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                certForm.reset();
                renderCertificates();
            };
            
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (file.size > 2 * 1024 * 1024) {
                    showNotification('File size exceeds 2MB limit.', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(event) {
                    saveHandler(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                saveHandler('');
            }
        });
    }
    
    // Change Password Actions
    const changePassBtn = document.getElementById('change-pass-btn');
    const changePassModal = document.getElementById('changePassModal');
    const closeChangePass = document.getElementById('close-change-pass');
    const changePassForm = document.getElementById('change-pass-form');
    
    if (changePassBtn) {
        changePassBtn.addEventListener('click', () => {
            changePassForm.reset();
            changePassModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeChangePass) {
        closeChangePass.addEventListener('click', () => {
            changePassModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (changePassForm) {
        changePassForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-password').value;
            
            if (newPass !== confirmPass) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            saveAdminPassword(newPass);
            showNotification('Admin password changed successfully! Click "Export script.js" and commit the changes to make it permanent.', 'success');
            changePassModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    const exportCodeBtn = document.getElementById('export-code-btn');
    if (exportCodeBtn) {
        exportCodeBtn.addEventListener('click', () => {
            exportScriptJS();
        });
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === adminLoginModal) {
            adminLoginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === certFormModal) {
            certFormModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (event.target === changePassModal) {
            changePassModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}
