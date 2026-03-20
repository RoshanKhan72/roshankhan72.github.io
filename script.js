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
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
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
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
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
