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

    // Expanded and refined Knowledge Base for general chat responses and service details
    const chatbotKnowledge = [
        {
            keywords: ["hello", "hi", "hey", "greetings"],
            response: "Hello there! I'm your Digital Horizon Assistant. I can help you with questions about our services (Web Design and Web Development), explain what a website is, provide contact details, or even help you book a meeting. What can I do for you?"
        },
        {
            keywords: ["services", "what do you do", "offerings"],
            response: "Digital Horizon specializes in providing top-notch **Web Design** and **Web Development** services. We create custom, high-performing websites tailored to your needs. Which service are you interested in learning more about?"
        },
        {
            keywords: ["web design", "design service"],
            response: "Our **Web Design** service crafts stunning, user-friendly, and responsive websites that look amazing on any device. We focus on UI/UX, visual appeal, and creating an intuitive experience for your visitors."
        },
        {
            keywords: ["web development", "build website", "coding"],
            response: "With **Web Development**, we bring your design to life using cutting-edge technologies and robust coding. This includes custom website builds, content management system (CMS) integration (like WordPress), and ensuring high performance and security."
        },
        {
            keywords: ["what is a website", "explain website"],
            response: "Simply put, a **website** is your business's digital home on the internet. It's a collection of pages, images, and content that people can access worldwide. It serves as your online presence for showcasing your services, products, or information, available 24/7!"
        },
        {
            keywords: ["responsive", "mobile friendly", "phone", "tablet", "laptop"],
            response: "A **responsive website** is designed to look and function perfectly across all devices – from small phones to large desktop screens. Text, images, and layout adjust automatically, providing an optimal and comfortable viewing experience for every user."
        },
        {
            keywords: ["pricing", "cost", "quote","how much"],
            response: "Our project costs are customized based on the unique needs and scope of each project. To get a precise quote for your specific requirements, please type 'send inquiry' or 'book meeting' to connect with our team!"
        },
        {
            keywords: ["contact", "phone", "email", "get in touch", "address"],
            response: "You can reach us directly! <br>📧 Email: **baathish9@gmail.com** <br>📞 Phone: **YOUR_PHONE_NUMBER** <br>We're here to help!"
        },
        {
            keywords: ["about us", "who are you", "company", "your company"],
            response: "Digital Horizon is a team of passionate web design and development experts dedicated to creating impactful online experiences. We focus on delivering tailored, high-quality digital solutions that truly drive results for businesses and individuals seeking a strong online presence. **[INSERT MORE SPECIFIC DETAILS ABOUT YOUR COMPANY HERE, e.g., 'Founded in [Year], we pride ourselves on [Key Values/Mission/Unique Selling Proposition], delivering projects that are [Quality Aspects].']**"
        },
        {
            keywords: ["portfolio", "work", "projects"],
            response: "To see our recent work and successful projects, please visit the 'Portfolio' section of our website. You'll find a diverse range of our creations there!"
        },
        {
            keywords: ["thank you", "thanks", "appreciate it"],
            response: "You are most welcome! Glad I could help. Is there anything else you need assistance with?"
        },
        {
            keywords: ["bye", "goodbye", "see ya"],
            response: "Goodbye! It was a pleasure assisting you. Have a fantastic day!"
        },
        {
            keywords: ["cancel"],
            response: "Okay, I've cancelled that request. Is there anything else I can help you with today?"
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
        return "I'm not quite sure I follow. You can ask about our services, what a website is, get our contact details, or type 'send inquiry' to send a message or 'book meeting' to schedule a call.";
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
                    // Send initial greeting proactively
                    addMessageToChat(getGeneralBotResponse("hello"), "bot");
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
                    botResponse = "Thanks for your email! Now, please type the message you'd like to send to our team. I'll forward it right away.";
                    botState = 'awaiting_message_inquiry';
                } else {
                    botResponse = "That doesn't look like a valid email. Please try again (e.g., yourname@example.com) or type 'cancel' to stop.";
                }
            } else if (botState === 'awaiting_message_inquiry') {
                inquiryDetails.message = userMessage;
                inquiryDetails.type = 'General Chatbot Inquiry';
                sendToFormSubmit = true;
                botResponse = "Sending your message to our team..."; // Placeholder, actual response comes after fetch
            }

            // --- Handle Meeting Booking Flow ---
            else if (botState === 'awaiting_meeting_date') {
                inquiryDetails.date = userMessage; // Basic capture, could add date validation
                botResponse = "Great! And what time would you prefer for the meeting? (e.g., 2 PM, 14:00 CAT)";
                botState = 'awaiting_meeting_time';
            } else if (botState === 'awaiting_meeting_time') {
                inquiryDetails.time = userMessage; // Basic capture, could add time validation
                botResponse = "Perfect. What is your full name for this meeting request?";
                botState = 'awaiting_meeting_name';
            } else if (botState === 'awaiting_meeting_name') {
                inquiryDetails.name = userMessage;
                botResponse = "Lastly, what's the best contact email or phone number for our team to reach you?";
                botState = 'awaiting_meeting_contact';
            } else if (botState === 'awaiting_meeting_contact') {
                inquiryDetails.contact = userMessage;
                inquiryDetails.type = 'Meeting Booking Request';
                sendToFormSubmit = true;
                botResponse = "Compiling your meeting request now..."; // Placeholder
            }

            // --- Handle Initial Triggers (when botState is 'idle') ---
            else if (botState === 'idle') {
                if (lowerCaseMessage.includes("send inquiry") || lowerCaseMessage.includes("contact support") || lowerCaseMessage === "contact us") {
                    botResponse = "Okay, I can help you send a direct message to our team. What is your email address?";
                    botState = 'awaiting_email_inquiry';
                } else if (lowerCaseMessage.includes("book meeting") || lowerCaseMessage.includes("schedule call") || lowerCaseMessage.includes("appointment")) {
                    botResponse = "I can help you arrange a meeting with our team! Please tell me your preferred date. (e.g., May 25th, next Tuesday)";
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
                    subject = `New Chatbot Inquiry: ${inquiryDetails.email || 'Unknown'}`;
                    formData.append('_replyto', inquiryDetails.email);
                    formData.append('Email', inquiryDetails.email); // Explicit field for email
                    formData.append('Message', inquiryDetails.message);
                } else if (inquiryDetails.type === 'Meeting Booking Request') {
                    subject = `Meeting Request: ${inquiryDetails.name || 'Unknown'} - ${inquiryDetails.date || 'N/A'} at ${inquiryDetails.time || 'N/A'}`;
                    formData.append('_replyto', inquiryDetails.contact); // Assuming contact is email or phone for reply
                    formData.append('Name', inquiryDetails.name);
                    formData.append('Contact_Info', inquiryDetails.contact);
                    formData.append('Preferred_Date', inquiryDetails.date);
                    formData.append('Preferred_Time', inquiryDetails.time);
                    messageBody = `This is a meeting request submitted via the chatbot. Our team should contact ${inquiryDetails.name} at ${inquiryDetails.contact} to confirm.`;
                    formData.append('Notes', messageBody); // Add a notes field for the summary
                }

                formData.append('_subject', subject);
                // Ensure messageBody is explicitly added if it's not covered by other named fields
                if (messageBody && !formData.has('message')) { // Avoid duplication if 'message' is already there
                    formData.append('message', messageBody);
                }


                try {
                    const response = await fetch('https://formsubmit.co/baathish9@email.com', { // Ensure your email is here
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        if (inquiryDetails.type === 'General Chatbot Inquiry') {
                            addMessageToChat("Success! Your message has been sent to our team. We'll get back to you soon.", 'bot');
                        } else if (inquiryDetails.type === 'Meeting Booking Request') {
                            addMessageToChat("Thank you! Your meeting request has been successfully sent to our team. We will review the details and get in touch with you shortly to confirm your booking. Please expect a confirmation within 1 business day.", 'bot');
                        }
                    } else {
                        const errorText = await response.text();
                        console.error('FormSubmit.co response error:', response.status, errorText);
                        addMessageToChat("Oops! There was an issue sending your request. Please try again later or contact us directly.", 'bot');
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
