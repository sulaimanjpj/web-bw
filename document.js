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


    // --- Custom Chatbot Widget Functionality ---
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotBox = document.getElementById('chatbot-box');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    // Bot state to manage inquiry and meeting booking flow
    let botState = 'idle'; // Can be 'idle', 'awaiting_email_inquiry', 'awaiting_message_inquiry', 'awaiting_meeting_date', 'awaiting_meeting_time', 'awaiting_meeting_name', 'awaiting_meeting_contact'
    let inquiryDetails = {}; // Stores details for general inquiry or meeting booking

    // Expanded Knowledge Base for general chat responses and service details
    const chatbotKnowledge = [
        {
            keywords: ["hello", "hi", "hey", "greetings"],
            response: "Hello! I'm your Digital Horizon assistant. How can I help you today? You can ask about our services, what a website is, or type 'send inquiry' to send a message or 'book meeting' to schedule a call."
        },
        {
            keywords: ["services", "what do you do", "offerings"],
            response: "Digital Horizon offers comprehensive services to elevate your online presence. We specialize in **Web Design**, **Web Development**, **Digital Marketing**, and **E-commerce Solutions**. Which one would you like to know more about?"
        },
        {
            keywords: ["web design", "design service"],
            response: "Our **Web Design** service focuses on creating visually stunning, user-friendly, and responsive websites. We ensure your site looks great on any device and provides an intuitive experience for your visitors. We cover UI/UX design, graphic integration, and overall site aesthetics."
        },
        {
            keywords: ["web development", "build website", "coding"],
            response: "With **Web Development**, we bring your design to life using the latest coding standards and robust technologies. This includes custom website builds, content management system (CMS) integration (like WordPress), and ensuring high performance and security."
        },
        {
            keywords: ["digital marketing", "seo", "marketing"],
            response: "**Digital Marketing** at Digital Horizon helps you reach your target audience and grow your brand online. Our services include Search Engine Optimization (SEO) to improve visibility, Social Media Marketing, Content Marketing, and Paid Advertising (PPC) campaigns."
        },
        {
            keywords: ["e-commerce", "online store", "sell online"],
            response: "Our **E-commerce Solutions** are designed to build powerful online stores that convert visitors into customers. We specialize in platforms like Shopify and WooCommerce, secure payment gateway integration, product catalog management, and seamless shopping experiences."
        },
        {
            keywords: ["what is a website", "explain website"],
            response: "A **website** is a collection of related web pages, images, videos, and other digital assets hosted on a server and accessible via the internet. It serves as your digital storefront, portfolio, or information hub, allowing people worldwide to find and interact with your business or content. Think of it as your virtual office or brochure, available 24/7!"
        },
        {
            keywords: ["responsive", "mobile friendly", "phone", "tablet"],
            response: "A **responsive website** is designed to adapt and display beautifully on any device size – whether it's a desktop computer, a tablet, or a smartphone. This means text, images, and layout automatically adjust so users always have an optimal viewing and interaction experience without awkward zooming or scrolling."
        },
        {
            keywords: ["about us", "who are you", "company"],
            response: "Digital Horizon is a team of passionate digital innovators, transforming visions into impactful online experiences. We focus on delivering tailored solutions that drive results for businesses."
        },
        {
            keywords: ["portfolio", "work", "projects"],
            response: "Explore our 'Recent Work' section on this website to see a diverse range of projects and the quality of our digital solutions!"
        },
        {
            keywords: ["pricing", "cost", "quote"],
            response: "Our project costs are customized based on the scope, complexity, and specific requirements of your project. For a personalized quote, please type 'send inquiry' or 'book meeting' to discuss your needs with our team."
        },
        {
            keywords: ["thank you", "thanks"],
            response: "You're most welcome! Is there anything else I can help you with?"
        },
        {
            keywords: ["bye", "goodbye"],
            response: "Goodbye! We look forward to building your next digital success. Have a brilliant day!"
        },
        {
            keywords: ["cancel"],
            response: "Okay, I've cancelled that request. How else can I help you today?"
        }
    ];

    // Function to add messages to the chat interface
    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.innerHTML = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to latest message
    }

    // Get a general bot response from knowledge base
    function getGeneralBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase().trim();
        for (const qa of chatbotKnowledge) {
            for (const keyword of qa.keywords) {
                if (lowerCaseMessage.includes(keyword)) {
                    return qa.response;
                }
            }
        }
        return "I'm not quite sure I follow. You can ask about our services, what a website is, or type 'send inquiry' to send a message or 'book meeting' to schedule a call.";
    }

    // Chatbot Toggle Logic
    if (chatbotButton && chatbotBox && closeChatbot && chatbotMessages && chatbotInput && chatbotSend) {
        // Initial welcome message when chatbot opens
        chatbotButton.addEventListener('click', () => {
            const isHidden = chatbotBox.classList.contains('chatbot-hidden');
            if (isHidden) {
                chatbotBox.classList.remove('chatbot-hidden');
                chatbotBox.classList.add('chatbot-visible');
                chatbotButton.style.display = 'none'; // Temporarily hide button when box is open
                if (chatbotMessages.children.length === 0) {
                    addMessageToChat(getGeneralBotResponse("hello"), "bot"); // Send initial greeting
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

        // Send Message Logic (handles both general chat and inquiry/booking flow)
        chatbotSend.addEventListener('click', async () => { // Made async to await fetch
            const userMessage = chatbotInput.value;
            if (userMessage.trim() === '') {
                return; // Don't send empty messages
            }

            addMessageToChat(userMessage, 'user');
            chatbotInput.value = ''; // Clear input

            const lowerCaseMessage = userMessage.toLowerCase().trim();

            let botResponse = '';
            let sendToFormSubmit = false; // Flag to indicate if we need to send data to FormSubmit

            // Handle 'cancel' universally for ongoing flows
            if (lowerCaseMessage === 'cancel') {
                botResponse = getGeneralBotResponse('cancel');
                botState = 'idle';
                inquiryDetails = {}; // Clear any pending details
                addMessageToChat(botResponse, 'bot');
                return;
            }

            // --- Handle Inquiry Flow ---
            if (botState === 'awaiting_email_inquiry') {
                if (lowerCaseMessage.includes('@') && lowerCaseMessage.includes('.')) {
                    inquiryDetails.email = lowerCaseMessage;
                    botResponse = "Thanks! Now, please type the message you'd like to send to our team.";
                    botState = 'awaiting_message_inquiry';
                } else {
                    botResponse = "That doesn't look like a valid email. Please try again or type 'cancel' to stop.";
                }
            } else if (botState === 'awaiting_message_inquiry') {
                inquiryDetails.message = userMessage;
                inquiryDetails.type = 'General Chatbot Inquiry';
                sendToFormSubmit = true;
                botResponse = "Processing your message..."; // Placeholder, actual response comes after fetch
            }

            // --- Handle Meeting Booking Flow ---
            else if (botState === 'awaiting_meeting_date') {
                inquiryDetails.date = userMessage; // Basic capture, could add date validation
                botResponse = "Got it! And what time would you prefer for the meeting? (e.g., 2 PM, 14:00)";
                botState = 'awaiting_meeting_time';
            } else if (botState === 'awaiting_meeting_time') {
                inquiryDetails.time = userMessage; // Basic capture, could add time validation
                botResponse = "Okay, what is your name for the meeting?";
                botState = 'awaiting_meeting_name';
            } else if (botState === 'awaiting_meeting_name') {
                inquiryDetails.name = userMessage;
                botResponse = "And what is your best contact number or email?";
                botState = 'awaiting_meeting_contact';
            } else if (botState === 'awaiting_meeting_contact') {
                inquiryDetails.contact = userMessage;
                inquiryDetails.type = 'Meeting Booking Request';
                sendToFormSubmit = true;
                botResponse = "Thank you! Processing your meeting request..."; // Placeholder
            }

            // --- Handle Initial Triggers (when botState is 'idle') ---
            else if (botState === 'idle') {
                if (lowerCaseMessage.includes("send inquiry") || lowerCaseMessage.includes("contact support") || lowerCaseMessage === "contact us") {
                    botResponse = "Okay, I can help you send a message to our team. What is your email address?";
                    botState = 'awaiting_email_inquiry';
                } else if (lowerCaseMessage.includes("book meeting") || lowerCaseMessage.includes("schedule call") || lowerCaseMessage.includes("appointment")) {
                    botResponse = "I can help you arrange a meeting. What is your preferred date for the meeting? (e.g., 25th May)";
                    botState = 'awaiting_meeting_date';
                    inquiryDetails = {}; // Clear previous details for new booking
                } else {
                    // General chat response if no specific flow is triggered
                    botResponse = getGeneralBotResponse(userMessage);
                }
            }

            // Add bot response to chat
            if (botResponse) {
                setTimeout(() => {
                    addMessageToChat(botResponse, 'bot');
                }, 600); // Simulate bot typing delay
            }

            // --- Send data to FormSubmit.co if flagged ---
            if (sendToFormSubmit) {
                const formData = new FormData();
                let subject = '';
                let messageBody = '';

                if (inquiryDetails.type === 'General Chatbot Inquiry') {
                    subject = `General Chatbot Inquiry from ${inquiryDetails.email || 'Unknown'}`;
                    formData.append('_replyto', inquiryDetails.email);
                    messageBody = `User Email: ${inquiryDetails.email}\nMessage: ${inquiryDetails.message}`;
                } else if (inquiryDetails.type === 'Meeting Booking Request') {
                    subject = `New Meeting Request from Chatbot - ${inquiryDetails.name || 'Unknown'}`;
                    formData.append('_replyto', inquiryDetails.contact); // Assuming contact is email or phone for reply
                    messageBody = `Meeting Request Details:\n` +
                                  `Name: ${inquiryDetails.name || 'N/A'}\n` +
                                  `Contact: ${inquiryDetails.contact || 'N/A'}\n` +
                                  `Preferred Date: ${inquiryDetails.date || 'N/A'}\n` +
                                  `Preferred Time: ${inquiryDetails.time || 'N/A'}\n` +
                                  `This is a request, please confirm directly with the client.`;
                }

                formData.append('_subject', subject);
                formData.append('message', messageBody); // The main message content

                try {
                    const response = await fetch('https://formsubmit.co/baathish9@gmail.com', {
                        method: 'POST',
                        body: formData
                    });

                    // FormSubmit.co usually returns a 200 OK and might redirect on success
                    if (response.ok) {
                        if (inquiryDetails.type === 'General Chatbot Inquiry') {
                            addMessageToChat("Your message has been sent to our team. We'll get back to you soon!", 'bot');
                        } else if (inquiryDetails.type === 'Meeting Booking Request') {
                            addMessageToChat("Your meeting request has been sent! Our team will contact you shortly to confirm the details. Thank you!", 'bot');
                        }
                    } else {
                        // Attempt to parse JSON error if available, otherwise general error
                        const errorText = await response.text(); // Get raw text for inspection
                        console.error('FormSubmit.co response error:', response.status, errorText);
                        addMessageToChat("Oops! There was an error sending your request. Please try again later, or contact us directly.", 'bot');
                    }
                } catch (error) {
                    console.error('Network or FormSubmit.co submission error:', error);
                    addMessageToChat("A network error occurred. Please check your connection and try again.", 'bot');
                } finally {
                    botState = 'idle'; // Reset state after sending or error
                    inquiryDetails = {}; // Clear details
                }
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
