// Check if environment variables are available, for boilerplate awareness.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- LECTURE DATA DEFINITION (Centralized Configuration) ---
const LECTURE_DATA = {};

// 1. Define custom structure and titles for Lecture 1
LECTURE_DATA[1] = {
    title: 'Introduction to C Programming',
    parts: {
        1: {
            name: "Part 1: Components of C Language - Comment Lines, Token, Variables and Keywords",
            // Custom titles for sub-parts 1.1.1 through 1.1.12
            questions: [
                'Question 1: What is a computer programming language?',
                'Question 2: The genesis of C',
                'Question 3: Life of a computer program',
                'Question 4: Modifying a C program',
                'Question 5: Token: Constants (Numeric)',
                'Question 6: Token: Constants (Char & String)',
                'Question 7: Token: Separators (Semicolon)',
                'Question 8: Token: Separators (Braces { })',
                'Question 9: Token: Operator (Assignment =)',
                'Question 10: Token: Operator (Arithmetic +)',
                'Question 11: Keyword: const (Defining Constant)',
                'Question 12: Token: Delimiter (Parentheses ())'
            ]
        },
        2: {
            name: "Part 2: Practice and Scenario Based Programs",
            // Custom titles for sub-parts 1.2.1 through 1.2.4
            questions: [
                'Practice Scenario 1: Read Two Integers and Print Separately',
                'Practice Scenario 2: Calculate Quotient and Remainder',
                'Practice Scenario 3: Swap Two Variables (Using Temporary)',
                'Practice Scenario 4: Calculate Average of Three Integers'
            ]
        }
    }
};

// 2. Define custom structure and titles for Lecture 2
LECTURE_DATA[2] = {
    title: 'Syntax of main() and Standard I/O in C',
    parts: {
        1: {
            name: "Part 1: Syntax of main() and Standard I/O in C - Scanf and printf",
            // 20 generic placeholders for L2 Part 1 (2.1.1 to 2.1.20)
             questions: [
                'Question 1: What is a computer programming language?',
                'Question 2: The genesis of C',
                'Question 3: Life of a computer program',
                'Question 4: Modifying a C program',
                'Question 5: Token: Constants (Numeric)',
                'Question 6: Token: Constants (Char & String)',
                'Question 7: Token: Separators (Semicolon)',
                'Question 8: Token: Separators (Braces { })',
                'Question 9: Token: Operator (Assignment =)',
                'Question 10: Token: Operator (Arithmetic +)',
                'Question 11: Keyword: const (Defining Constant)',
                'Question 12: Token: Delimiter (Parentheses ())'
            ]
        }, 
        2: {
            name: "Part 2: Practice and Scenario Based Programs",
            // 3 generic placeholders for L2 Part 2 (2.2.1 to 2.2.3)
            questions: [
                'Question 1: What is a computer programming language?',
                'Question 2: The genesis of C',
                'Question 3: Life of a computer program',
                'Question 4: Modifying a C program',
                'Question 5: Token: Constants (Numeric)',
                'Question 6: Token: Constants (Char & String)',
                'Question 7: Token: Separators (Semicolon)',
                'Question 8: Token: Separators (Braces { })',
                'Question 9: Token: Operator (Assignment =)',
                'Question 10: Token: Operator (Arithmetic +)',
                'Question 11: Keyword: const (Defining Constant)',
                'Question 12: Token: Delimiter (Parentheses ())'
            ]
        }
    }
};

// 3. Define generic structure for Lectures 3 through 42
for (let i = 3; i <= 42; i++) {
    LECTURE_DATA[i] = {
        title: `Lecture ${i}: Future Topic Placeholder`,
        parts: {
            1: {
                name: `Part 1: Core Concepts & Theory (Lecture ${i} Topics)`,
                // 12 generic placeholders
                questions: Array.from({ length: 12 }, (_, j) => `Core Concept / Topic ${j + 1}`)
            },
            2: {
                name: "Part 2: Practice and Scenario Based Programs",
                // 4 generic placeholders
                questions: Array.from({ length: 4 }, (_, j) => `Practice Scenario ${j + 1}`)
            }
        }
    };
}


/**
 * Generic function to toggle collapsible content.
 * **Enhanced for Mobile:** Ensures only one top-level item (Lecture or Course) is open at a time.
 * @param {HTMLElement} button - The button that triggers the toggle.
 */
function toggleSection(button) {
    const targetId = button.getAttribute('data-target');
    const content = document.getElementById(targetId);
    const arrow = button.querySelector('.toggle-arrow');

    if (content && arrow) {
        const isCurrentlyOpen = content.classList.contains('open');
        const parentTabContent = button.closest('.tab-content');
        const isTopLevelToggle = !button.closest('.collapsible-content'); // Is it a Lecture/Course header?

        // Logic to close other top-level open accordions (Better for mobile vertical space)
        if (isTopLevelToggle && parentTabContent) {
            // Select all lecture card buttons within the current tab section
            document.querySelectorAll(`#${parentTabContent.id} section:last-child > .lecture-card > button[data-target]`).forEach(otherButton => {
                const otherContent = document.getElementById(otherButton.getAttribute('data-target'));
                if (otherContent && otherContent !== content && otherContent.classList.contains('open')) {
                    otherContent.classList.remove('open');
                    otherButton.querySelector('.toggle-arrow')?.classList.remove('rotate');
                    // Also close any nested parts within the newly closed lecture/course
                    otherContent.querySelectorAll('.collapsible-content.open').forEach(childContent => {
                        childContent.classList.remove('open');
                        childContent.previousElementSibling.querySelector('.toggle-arrow')?.classList.remove('rotate');
                    });
                }
            });
        }

        // Toggle the clicked section
        content.classList.toggle('open');
        arrow.classList.toggle('rotate');

        // If a section is closed, also close its children (for Part 1/Part 2)
        if (isCurrentlyOpen) {
            content.querySelectorAll('.collapsible-content.open').forEach(childContent => {
                childContent.classList.remove('open');
                childContent.previousElementSibling.querySelector('.toggle-arrow')?.classList.remove('rotate');
            });
        }
    } else {
        console.error(`Toggle target not found for button: ${targetId}`);
    }
}

/**
 * Generates the sub-part links for a specific part of a lecture using LECTURE_DATA.
 * The linking path is dynamically created as 'c_programming/lecture_[N].html#N.P.Q'
 *
 * @param {number} lectureNum - The current lecture number (1 to 42).
 * @param {number} partNum - The part number (1 or 2).
 * @param {string[]} questions - Array of custom question titles.
 * @returns {string} HTML string containing sub-part links.
 */
function generatePartContent(lectureNum, partNum, questions) {
    let html = '';
    const partPrefix = `${lectureNum}.${partNum}`;
    
    // Dynamically determines the lecture file path, future-proofed for lecture_43.html etc.
    const lectureFilePath = `c_programming/lecture_${lectureNum}.html`; 

    questions.forEach((title, index) => {
        const subPartIndex = index + 1;
        const subPartId = `${partPrefix}.${subPartIndex}`;
        const linkHref = `${lectureFilePath}#${subPartId}`;

        html += `
            <a href="${linkHref}" class="flex items-center justify-between text-sm sm:text-base font-medium text-gray-700 hover:text-yellow-800 transition duration-150 py-2 px-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 shadow-inner">
                <span class="font-mono text-xs sm:text-sm mr-2 w-8 sm:w-10">${subPartId}</span>
                <span class="flex-grow">${title}</span>
                <svg class="w-4 h-4 ml-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
        `;
    });
    return html;
}

/**
 * 1. Dynamic Lecture Generation with Nested Accordions (C Programming)
 * Iterates through the centralized LECTURE_DATA.
 * @param {string} containerId - The ID of the container element (e.g., 'lecture-list').
 */
function generateLectures(containerId) {
    const lectureList = document.getElementById(containerId);
    if (!lectureList) return;
    lectureList.innerHTML = ''; // Clear previous content

    // Iterate through all lectures defined in the centralized data
    Object.keys(LECTURE_DATA).forEach(i_str => {
        const i = parseInt(i_str, 10);
        const lecture = LECTURE_DATA[i];
        
        const lectureId = `${containerId}-lecture-${i}`;
        const part1Id = `${lectureId}-p1`;
        const part2Id = `${lectureId}-p2`;
        
        const title = lecture.title;

        // Use the question arrays from LECTURE_DATA
        const part1Questions = lecture.parts[1].questions;
        const part2Questions = lecture.parts[2].questions;
        
        const part1Content = generatePartContent(i, 1, part1Questions);
        const part2Content = generatePartContent(i, 2, part2Questions);

        const part1Name = lecture.parts[1].name;
        const part2Name = lecture.parts[2].name;


        const lectureCard = document.createElement('div');
        lectureCard.className = 'lecture-card bg-white rounded-xl shadow-md transition duration-300 ease-in-out card-hover-effect border border-yellow-200/50 overflow-hidden';
        
        lectureCard.innerHTML = `
            <!-- Level 1: Lecture Header -->
            <button id="c-lecture-${i}-toggle" class="p-4 sm:p-6 flex justify-between items-center w-full text-left focus:outline-none bg-white hover:bg-yellow-50 transition duration-150" data-target="${lectureId}-content" onclick="toggleSection(this)">
                <div>
                    <h4 class="text-lg sm:text-2xl font-bold text-yellow-700 mb-1">${title}</h4>
                    <p class="text-gray-500 text-xs sm:text-sm">Lecture ${i} Breakdown</p>
                </div>
                <svg class="w-6 h-6 text-gray-500 toggle-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            <!-- Level 1: Lecture Content Container -->
            <div id="${lectureId}-content" class="collapsible-content bg-gray-50 border-t border-yellow-100 p-0 space-y-4">
                <div class="p-4 sm:p-6 space-y-4">
                    
                    <!-- Level 2: Part 1 Section -->
                    <div class="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
                        <button class="p-3 sm:p-4 flex justify-between items-center w-full text-left text-md sm:text-lg font-semibold text-gray-700 hover:bg-yellow-100 transition duration-150" data-target="${part1Id}-content" onclick="toggleSection(this)">
                            <span class="text-sm sm:text-md">${part1Name} (${i}.1.x)</span>
                            <svg class="w-5 h-5 text-yellow-600 toggle-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <div id="${part1Id}-content" class="collapsible-content">
                            <div class="py-3 px-4 space-y-1">
                                ${part1Content}
                            </div>
                        </div>
                    </div>

                    <!-- Level 2: Part 2 Section -->
                    <div class="bg-white rounded-lg shadow-sm border border-yellow-100 overflow-hidden">
                        <button class="p-3 sm:p-4 flex justify-between items-center w-full text-left text-md sm:text-lg font-semibold text-gray-700 hover:bg-yellow-100 transition duration-150" data-target="${part2Id}-content" onclick="toggleSection(this)">
                            <span class="text-sm sm:text-md">${part2Name} (${i}.2.x)</span>
                            <svg class="w-5 h-5 text-yellow-600 toggle-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <div id="${part2Id}-content" class="collapsible-content">
                            <div class="py-3 px-4 space-y-1">
                                ${part2Content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        lectureList.appendChild(lectureCard);
    });
}

/**
 * Generates a summary card for the active C Programming course, used only in the Home tab.
 */
function generateActiveCourseSummary() {
    const container = document.getElementById('home-active-course-summary');
    if (!container) return;
    container.innerHTML = `
        <div class="lecture-card bg-white rounded-xl shadow-lg transition duration-300 ease-in-out card-hover-effect border border-yellow-400/50 overflow-hidden p-6 active-course-glow">
            <div class="flex items-center justify-between flex-wrap">
                <div class="mb-4 sm:mb-0">
                    <h4 class="text-2xl sm:text-3xl font-bold text-yellow-800 mb-1">C Programming Language</h4>
                    <p class="text-gray-600 text-md sm:text-lg">42 Lectures | 84 Sub-Parts Each Mapped</p>
                </div>
                <span class="text-md sm:text-lg font-bold text-white bg-yellow-600 px-4 py-2 rounded-full shadow-md transform hover:scale-105 transition duration-200">ACTIVE</span>
            </div>
            <p class="text-md text-gray-500 mt-4 border-t border-yellow-100 pt-4">
                This is the currently mapped course. Find the detailed lecture-by-lecture solutions with problem statements and code implementation.
            </p>
            <a href="#" onclick="openTab('c-programming-tab'); return false;" class="mt-4 inline-block text-yellow-700 font-semibold hover:text-yellow-900 transition duration-150">
                View Full Lecture List &rarr;
            </a>
        </div>
    `;
}

/**
 * 2. Dynamic Course Generation with Nested Accordions (Future Courses)
 * @param {string} containerId - The ID of the container element (e.g., 'future-course-list' or 'home-future-course-list').
 */
function generateFutureCourses(containerId) {
    const courseList = document.getElementById(containerId);
    if (!courseList) return;
    courseList.innerHTML = ''; // Clear previous content

    const futureCourses = [
        { id: 'ds', name: 'Data Structures', status: 'Proposed Phase', color: 'blue', tagColor: 'blue', content: [
            { title: 'Status & Timeline', detail: 'Currently gathering student requests and prioritizing resources. Start date TBD.' },
            { title: 'Planned Topics', detail: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting & Searching Algorithms.' }
        ]},
        { id: 'java', name: 'Java Programming', status: 'Proposed Phase', color: 'purple', tagColor: 'purple', content: [
            { title: 'Status & Timeline', detail: 'Currently gathering student requests and prioritizing resources. Start date TBD.' },
            { title: 'Planned Topics', detail: 'OOPS Concepts, Inheritance, Polymorphism, Collections, Exception Handling.' }
        ]},
        { id: 'python', name: 'Python for Data Science', status: 'Proposed Phase', color: 'green', tagColor: 'green', content: [
            { title: 'Status & Timeline', detail: 'Currently gathering student requests and prioritizing resources. Start date TBD.' },
            { title: 'Planned Topics', detail: 'Numpy, Pandas, Matplotlib, Data Cleaning, and Basic ML concepts.' }
        ]}
    ];

    futureCourses.forEach((course) => {
        const courseId = `${containerId}-course-${course.id}`;
        
        let courseInnerContent = '';
        course.content.forEach((item, index) => {
            const itemId = `${courseId}-item-${index}`;
            courseInnerContent += `
                <!-- Level 2: Status/Topic Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <button class="p-3 sm:p-4 flex justify-between items-center w-full text-left text-md sm:text-lg font-semibold text-gray-700 hover:bg-gray-100 transition duration-150" data-target="${itemId}-content" onclick="toggleSection(this)">
                        <span>${item.title}</span>
                        <svg class="w-5 h-5 text-${course.tagColor}-600 toggle-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <div id="${itemId}-content" class="collapsible-content">
                        <div class="py-3 px-4 space-y-1 bg-gray-50/50">
                            <p class="text-gray-600 text-sm p-2">${item.detail}</p>
                        </div>
                    </div>
                </div>
            `;
        });


        const courseCard = document.createElement('div');
        courseCard.className = `lecture-card bg-white rounded-xl shadow-md transition duration-300 ease-in-out card-hover-effect border border-${course.tagColor}-200/50 overflow-hidden future-glow`;
        
        courseCard.innerHTML = `
            <!-- Level 1: Course Header -->
            <button class="p-4 sm:p-6 flex justify-between items-center w-full text-left focus:outline-none bg-white hover:bg-gray-50 transition duration-150" data-target="${courseId}-content" onclick="toggleSection(this)">
                <div>
                    <h4 class="text-xl sm:text-2xl font-bold text-${course.tagColor}-700 mb-1">${course.name}</h4>
                    <p class="text-gray-500 text-xs sm:text-sm">${course.status}</p>
                </div>
                <svg class="w-6 h-6 text-gray-500 toggle-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            <!-- Level 1: Course Content Container -->
            <div id="${courseId}-content" class="collapsible-content bg-gray-50 border-t border-gray-100 p-0 space-y-4">
                <div class="p-4 sm:p-6 space-y-4">
                    ${courseInnerContent}
                </div>
            </div>
        `;
        courseList.appendChild(courseCard);
    });
}

// --- 3. Tab Functionality ---
function openTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
        // Close all accordions when switching tabs
        content.querySelectorAll('.collapsible-content.open').forEach(c => {
            c.classList.remove('open');
            const btn = c.previousElementSibling;
            if(btn && btn.querySelector('.toggle-arrow')) {
                btn.querySelector('.toggle-arrow').classList.remove('rotate');
            }
        });
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('border-yellow-500', 'text-yellow-700', 'home-tab-glow');
        button.classList.add('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
    });

    // Show the selected tab content
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
        // Re-run scroll reveal to animate newly visible cards
        setupScrollReveal(tabId);
    }

    // Activate the selected tab button and apply specific styles/glow
    const buttonId = tabId === 'c-programming-tab' ? 'tab-c-programming-button' : null;
    
    if (buttonId) {
        const selectedButton = document.getElementById(buttonId);
        if (selectedButton) {
            selectedButton.classList.add('border-yellow-500', 'text-yellow-700');
            selectedButton.classList.remove('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
        }
    }
}

// --- NEW MOBILE FEATURE: Hamburger Menu Logic ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.add('hidden');
}

// --- NEW MOBILE FEATURE: Scroll to Top Logic ---
function setupScrollToTopButton() {
    const button = document.getElementById('scroll-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show after scrolling 300px
            button.classList.remove('hidden');
            setTimeout(() => button.classList.add('opacity-100'), 10);
        } else {
            button.classList.remove('opacity-100');
            setTimeout(() => button.classList.add('hidden'), 300); // Wait for fade out
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// --- 4. Scroll Reveal Animation Logic (Unchanged) ---
function setupScrollReveal(tabId) {
    let selector = '';
    if (tabId === 'c-programming-tab') {
        selector = '#lecture-list .lecture-card';
    } else if (tabId === 'future-courses-tab') {
        selector = '#future-course-list .lecture-card';
    } else if (tabId === 'home-tab') {
        selector = '#home-active-course-summary .lecture-card, #home-future-course-list .lecture-card';
    }
    
    const cards = document.querySelectorAll(selector);

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };

    if (window.cardObserver) {
        window.cardObserver.disconnect();
    }

    window.cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.classList.remove('visible');
        window.cardObserver.observe(card);
    });
}

// --- 5. Header Shadow on Scroll Logic (Unchanged) ---
function setupHeaderScrollShadow() {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Initialize all effects when the window loads
window.onload = function() {
    // Mobile menu listener
    document.getElementById('mobile-menu-button')?.addEventListener('click', toggleMobileMenu);

    // Generate content for dedicated tabs
    generateLectures('lecture-list');
    generateFutureCourses('future-course-list');
    
    // Generate summary card and future course list for Home tab
    generateActiveCourseSummary(); 
    generateFutureCourses('home-future-course-list');

    setupHeaderScrollShadow();
    setupScrollToTopButton(); // NEW MOBILE FEATURE INITIALIZATION
    
    // Logic to open the correct tab based on URL hash (or default to home)
    const initialHash = window.location.hash.substring(1); // Remove '#'
    const defaultTab = 'home-tab';
    const validTabs = ['home-tab', 'c-programming-tab', 'future-courses-tab'];
    const tabToOpen = validTabs.includes(initialHash) ? initialHash : defaultTab;
    
    openTab(tabToOpen); 
};

// Fallback for environment check in console
console.log(`CodeTantra Solution App Initialized. App ID: ${appId}`);
