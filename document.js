document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile nav if open
            if (document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
                document.querySelector('.main-nav').classList.remove('active');
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // Add 'active' class to current section in navigation on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Adjust as needed to activate when section is 50% in view
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Back to Top Button functionality
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // Custom Chatbot Widget Functionality
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotBox = document.getElementById('chatbot-box');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    // Chatbot Knowledge Base (Updated for Digital Horizon)
    const chatbotKnowledge = [
        {
            keywords: ["hello", "hi", "hey", "greetings", "digital horizon"],
            response: "Hello! I'm your Digital Horizon assistant. I can tell you about our innovative services, how to connect with us, or give you an overview of our mission. What's on your mind?"
        },
        {
            keywords: ["services", "what do you do", "offerings", "provide", "solutions"],
            response: "Digital Horizon specializes in cutting-edge Web Design, robust Web Development, impactful Digital Marketing, and seamless E-commerce Solutions. Which area are you interested in?"
        },
        {
            keywords: ["web design", "website design", "design services", "ui/ux", "look and feel"],
            response: "Our Web Design service crafts stunning, intuitive, and responsive interfaces designed to captivate your audience and elevate your brand aesthetic."
        },
        {
            keywords: ["web development", "website development", "build a site", "coding", "develop a site"],
            response: "With Web Development, we build high-performance, secure, and scalable web applications from scratch, tailored precisely to your business objectives."
        },
        {
            keywords: ["digital marketing", "seo", "marketing", "content marketing", "online visibility"],
            response: "Our Digital Marketing strategies are designed to boost your online presence and accelerate growth through targeted SEO, impactful social media campaigns, and compelling content."
        },
        {
            keywords: ["e-commerce", "online store", "shop", "sell online", "e-shop"],
            response: "Our E-commerce Solutions provide powerful, user-friendly online stores with secure payment integrations, designed to maximize your sales and streamline your digital storefront."
        },
        {
            keywords: ["contact", "reach out", "get in touch", "phone", "email", "address", "call us", "message", "connect", "support","talk","i need website"],
            response: "You can easily connect with Digital Horizon! <br><strong>Email:</strong> <a href='mailto:baathish9.com'> baathish9@gmail.com</a><br><strong>Phone:</strong>  +267 75 982 477<br>Or visit our Contact section for our full address. We're eager to hear from you!"
        },
        {
            keywords: ["pricing", "cost", "quote", "how much", "budget", "price","affordability"],
            response: "Our project costs are customized based on scope and complexity to ensure you get the best value. We offer transparent pricing after a detailed consultation. For a personalized quote, please reach out to us!"
        },
        {
            keywords: ["about us", "who are you", "your team", "history", "company","mission"],
            response: "Digital Horizon is a collective of passionate digital innovators. Our mission is to transform your vision into impactful online experiences through cutting-edge technology and a client-centric approach."
        },
        {
            keywords: ["portfolio", "work", "projects", "examples", "showcase","recent work","case studies"],
            response: "Explore our 'Recent Work' section on this website to see a diverse range of projects. It showcases how we've helped clients achieve their digital goals with our creative and technical prowess."
        },
        {
            keywords: ["thank you", "thanks", "appreciate it", "cheers","grateful"],
            response: "You're most welcome! I'm here to illuminate your path. Is there anything else about Digital Horizon you'd like to explore?"
        },
        {
            keywords: ["bye", "goodbye", "see ya", "farewell"],
            response: "Goodbye! We look forward to building your next digital success with Digital Horizon. Have a brilliant day!"
        }
    ];

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to latest message
    }

    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase().trim();
        for (const qa of chatbotKnowledge) {
            for (const keyword of qa.keywords) {
                if (lowerCaseMessage.includes(keyword)) {
                    return qa.response;
                }
            }
        }
        return "I'm not quite sure I follow. I can tell you about: <ul><li>Our Services (Web Design, Development, chat bot)</li><li>How to Contact us</li><li> Pricing details</li><li>Or what makes Digital Horizon unique.</li></ul>How can I assist you further?";
    }

    // Chatbot Toggle Logic
    if (chatbotButton && chatbotBox && closeChatbot && chatbotMessages && chatbotInput && chatbotSend) {
        chatbotButton.addEventListener('click', () => {
            const isHidden = chatbotBox.classList.contains('chatbot-hidden');
            if (isHidden) {
                chatbotBox.classList.remove('chatbot-hidden');
                chatbotBox.classList.add('chatbot-visible');
                chatbotButton.style.display = 'none'; // Temporarily hide button when box is open
                if (chatbotMessages.children.length === 0) {
                    addMessage(getBotResponse("hello"), "bot"); // Send initial greeting
                }
            } else {
                chatbotBox.classList.remove('chatbot-visible');
                chatbotBox.classList.add('chatbot-hidden');
                setTimeout(() => {
                    chatbotButton.style.display = 'flex'; // Show button after transition
                }, 300);
            }
        });

        closeChatbot.addEventListener('click', () => {
            chatbotBox.classList.remove('chatbot-visible');
            chatbotBox.classList.add('chatbot-hidden');
            setTimeout(() => {
                chatbotButton.style.display = 'flex';
            }, 300);
        });

        // Send Message Logic
        chatbotSend.addEventListener('click', () => {
            const userMessage = chatbotInput.value;
            if (userMessage.trim() !== '') {
                addMessage(userMessage, 'user');
                chatbotInput.value = ''; // Clear input
                setTimeout(() => {
                    const botResponse = getBotResponse(userMessage);
                    addMessage(botResponse, 'bot');
                }, 600); // Simulate bot typing delay
            }
        });

        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                chatbotSend.click();
            }
        });
    }

    // Scroll-triggered animations (basic example for .animate-in classes)
    const animatedElements = document.querySelectorAll('.animate-in');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // If you want the animation to play only once, uncomment next line:
                // observer.unobserve(entry.target);
            } else {
                // Optional: Reset animation if element scrolls out of view
                // entry.target.style.opacity = '0';
                // entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of element is visible

    animatedElements.forEach(element => {
        // Initial state for JS-triggered animations
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        animationObserver.observe(element);
    });

});
