
// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(pageName, clickedButton) {

    const homePage =
        document.getElementById("home-page");

    const uploadPage =
        document.getElementById("upload-page");

    const buttons =
        document.querySelectorAll(".nav-button");

    // Hide all pages
    homePage.classList.remove("active-page");
    uploadPage.classList.remove("active-page");

    // Remove active state from all navigation buttons
    buttons.forEach(function(button) {
        button.classList.remove("active");
    });

    // Show selected page
    if (pageName === "home") {
        homePage.classList.add("active-page");
    }

    if (pageName === "upload") {
        uploadPage.classList.add("active-page");
    }

    // Highlight selected navigation button
    clickedButton.classList.add("active");
}


// ========================================
// MAIN MEMORY SECTION
// ========================================

function selectMemorySection(sectionName, clickedButton) {

    const buttons = document.querySelectorAll(
        ".memory-menu > .memory-button"
    );

    const photoMenu = document.getElementById("photo-menu");
    const memoryContent = document.getElementById("memory-section-content");
    const timelineIntro = document.getElementById("timeline-intro");
    const photoGallery = document.getElementById("photo-gallery");
    const memoryContainer = document.querySelector(".empty-memory");
    const memoryMenu = document.querySelector(".memory-menu");

    // Clear previous section content
    memoryContent.innerHTML = "";

    // Hide the Timeline welcome section when another section is selected
    if (timelineIntro) {
        timelineIntro.hidden = sectionName !== "timeline";
    }

    // Hide all photos
    photoGallery.querySelectorAll(".memory-photo").forEach(function(photo) {
        photo.style.display = "none";
    });

    // Clear selected photo category
    document.querySelectorAll(".photo-button").forEach(function(button) {
        button.classList.remove("active");
    });

    // Show the photo submenu only for Photos
    photoMenu.style.display =
        sectionName === "photos" ? "flex" : "none";

    // TIMELINE: Show welcome message and keep the Back button
    if (sectionName === "timeline") {

        buttons.forEach(function(button) {
            button.style.display = "none";
            button.classList.remove("active");
            button.classList.remove("selected-main-button");
        });

        clickedButton.style.display = "inline-block";
        clickedButton.classList.add("active");
        clickedButton.classList.add("selected-main-button");

        memoryMenu.style.maxWidth = "none";
        memoryMenu.style.width = "100%";
        memoryMenu.style.boxSizing = "border-box";

        clickedButton.style.gridColumn = "1 / -1";
        clickedButton.style.width = "100%";
        clickedButton.style.boxSizing = "border-box";
        clickedButton.style.justifySelf = "start";
        clickedButton.style.textAlign = "center";

        // Create the Back button
        const backButton = document.createElement("button");
        backButton.textContent = "← Go back";
        backButton.className = "memory-button memory-back-button";
        backButton.style.display = "block";
        backButton.style.margin = "0";
        backButton.style.position = "absolute";
        backButton.style.top = "38px";
        backButton.style.left = "30px";
        backButton.style.zIndex = "10";
        backButton.onclick = resetMemoryMenu;

        memoryContent.appendChild(backButton);

        // Show the Timeline welcome section already defined in index.html
        showTimelineIntro();

        return;
    }

    
    // FUN FACT: Open the animated romantic scene.
    // This branch runs before the other sections' existing logic.
    if (sectionName === "funfact") {
        const funFactStage =
            document.getElementById("fun-fact-stage");

        if (funFactStage) {
            funFactStage.hidden = false;
            startFunFactAnimation();
        }

        return;
    }


    // Hide all main menu buttons and clear selected styles
    buttons.forEach(function(button) {
        button.style.display = "none";
        button.classList.remove("active");
        button.classList.remove("selected-main-button");
        button.style.width = "";
        button.style.gridColumn = "";
        button.style.justifySelf = "";
        button.style.textAlign = "";
    });

    // Show only the clicked button
    clickedButton.style.display = "inline-block";
    clickedButton.classList.add("active");
    clickedButton.classList.add("selected-main-button");

    // Expand the menu across the full memory container
    memoryMenu.style.maxWidth = "none";
    memoryMenu.style.width = "100%";
    memoryMenu.style.boxSizing = "border-box";

    // Make the selected button full width
    clickedButton.style.gridColumn = "1 / -1";
    clickedButton.style.width = "100%";
    clickedButton.style.boxSizing = "border-box";
    clickedButton.style.justifySelf = "start";
    clickedButton.style.textAlign = "center";

    // Create the back button
    const backButton = document.createElement("button");
    backButton.textContent = "← Go back";
    backButton.className = "memory-button memory-back-button";
    backButton.style.display = "block";
    backButton.style.margin = "0";
    backButton.style.position = "absolute";
    backButton.style.top = "38px";
    backButton.style.left = "30px";
    backButton.style.zIndex = "10";
    backButton.onclick = resetMemoryMenu;

    memoryContent.appendChild(backButton);

    // Display uploaded videos or artwork
    if (sectionName === "videos" || sectionName === "artwork") {

        const storage =
            document.getElementById("uploaded-media-storage");

        const gallery = document.createElement("div");
        gallery.className = "media-gallery";

        const mediaType =
            sectionName === "videos" ? "Videos" : "Artwork";

        storage.querySelectorAll("[data-media-category]").forEach(function(media) {
            if (media.dataset.mediaCategory === mediaType) {
                const copy = media.cloneNode(true);
                gallery.appendChild(copy);
            }
        });

        if (gallery.children.length > 0) {
            memoryContent.appendChild(gallery);
        } else {
            const message = document.createElement("p");

            message.textContent =
                sectionName === "videos"
                    ? "No videos uploaded yet."
                    : "No artwork uploaded yet.";

            message.style.marginTop = "30px";
            memoryContent.appendChild(message);
        }
    }
}


function resetMemoryMenu() {

    const buttons = document.querySelectorAll(
        ".memory-menu > .memory-button"
    );

    const photoMenu = document.getElementById("photo-menu");
    const memoryContent = document.getElementById("memory-section-content");
    const timelineIntro = document.getElementById("timeline-intro");
    const photos = document.querySelectorAll(".memory-photo");
    const memoryMenu = document.querySelector(".memory-menu");

    // Restore all main buttons to their original appearance
    buttons.forEach(function(button) {
        button.style.display = "";
        button.classList.remove("active");
        button.classList.remove("selected-main-button");
        button.style.width = "";
        button.style.gridColumn = "";
        button.style.justifySelf = "";
        button.style.textAlign = "";
    });

    // Restore the original menu width and layout
    memoryMenu.style.maxWidth = "750px";
    memoryMenu.style.width = "";
    memoryMenu.style.boxSizing = "";

    // Hide the photo submenu and photos
    photoMenu.style.display = "none";

    photos.forEach(function(photo) {
        photo.style.display = "none";
    });

    // Clear section content, including the back button
    memoryContent.innerHTML = "";

    // Hide the Timeline welcome section when returning to all memories
    if (timelineIntro) {
        timelineIntro.hidden = true;
    }

    // Reset photo category selection
    document.querySelectorAll(".photo-button").forEach(function(button) {
        button.classList.remove("active");
    });
}


// ========================================
// PHOTO CATEGORY SELECTION
// ========================================

function selectPhotoCategory(category, clickedButton) {

    const buttons =
        document.querySelectorAll(".photo-button");

    const photos =
        document.querySelectorAll(".memory-photo");

    // Remove active state from all photo category buttons
    buttons.forEach(function(button) {
        button.classList.remove("active");
    });

    // Activate clicked category
    clickedButton.classList.add("active");

    // Show only photos belonging to selected category
    photos.forEach(function(photo) {

        if (photo.dataset.category === category) {
            photo.style.display = "block";
        } else {
            photo.style.display = "none";
        }

    });

    console.log(
        "Selected photo category:",
        category
    );
}


// ========================================
// UPLOAD CATEGORY
// ========================================

// Stores the category selected before choosing the file
let selectedUploadCategory = null;


// Open the Tiasha / Tonmoy / Combine menu
function openCategorySelector() {

    const categoryMenu =
        document.getElementById("upload-category-menu");

    categoryMenu.style.display = "flex";
}


// Select Tiasha, Tonmoy or Combine
function chooseUploadCategory(category) {
    selectedUploadCategory = category;

    const categoryMenu =
        document.getElementById("upload-category-menu");

    const fileInput =
        document.getElementById("file-input");

    categoryMenu.style.display = "none";

    // Choose the correct file type for each category
    if (category === "Videos") {
        fileInput.accept = "video/*";
    } else {
        fileInput.accept = "image/*";
    }

    fileInput.click();
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    const fileName = document.getElementById("file-name");

    if (!file) {
        selectedUploadCategory = null;
        return;
    }

    if (!selectedUploadCategory) {
        fileName.textContent = "Please select a category first.";
        event.target.value = "";
        return;
    }

    const category = selectedUploadCategory;
    const isVideo = category === "Videos";
    const isImage = file.type.startsWith("image/");
    const isValidVideo = file.type.startsWith("video/");

    if (isVideo && !isValidVideo) {
        fileName.textContent = "Please choose a video file.";
        event.target.value = "";
        selectedUploadCategory = null;
        return;
    }

    if (!isVideo && !isImage) {
        fileName.textContent = "Please choose an image file.";
        event.target.value = "";
        selectedUploadCategory = null;
        return;
    }

    // Add the category before the file so the server
    // knows which of the five folders to use.
    const formData = new FormData();
    formData.append("category", category);
    formData.append("file", file);

    fileName.textContent = "Uploading...";

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Upload failed.");
        }

        displaySavedMedia(result.item);
        fileName.textContent = "Upload successful: " + file.name;
    } catch (error) {
        fileName.textContent = error.message;
        console.error("Upload failed:", error);
    } finally {
        event.target.value = "";
        selectedUploadCategory = null;
    }
}




function displaySavedMedia(item) {
    const photoGallery = document.getElementById("photo-gallery");
    const storage = document.getElementById("uploaded-media-storage");

    let media;

    if (item.category === "Videos") {
        media = document.createElement("video");
        media.controls = true;
        media.preload = "metadata";
        media.className = "memory-video";
        media.dataset.mediaCategory = "Videos";
        storage.appendChild(media);
    } else if (item.category === "Artwork") {
        media = document.createElement("img");
        media.alt = "Uploaded artwork";
        media.className = "memory-artwork";
        media.dataset.mediaCategory = "Artwork";
        storage.appendChild(media);
    } else {
        media = document.createElement("img");
        media.alt = item.category + " Memory";
        media.className = "memory-photo";
        media.dataset.category = item.category;
        media.style.display = "none";
        photoGallery.appendChild(media);
    }

    media.dataset.mediaId = String(item.id);
    media.src = item.url;
}

// Load saved media whenever the website opens or refreshes.
async function loadSavedMedia() {
    try {
        const response = await fetch("/api/media");

        if (!response.ok) {
            throw new Error("Could not load saved media.");
        }

        const data = await response.json();

        data.items.forEach(displaySavedMedia);
    } catch (error) {
        console.error("Media loading failed:", error);
    }
}



// ========================================
// QUIZ PROGRESS BAR STYLES
// These styles are injected by JavaScript.
// ========================================

(function addQuizProgressStyles() {

    if (document.getElementById("quiz-progress-dynamic-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "quiz-progress-dynamic-styles";

    style.textContent = `
        #quiz-modal .quiz-progress-panel {
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
            overscroll-behavior: contain;
        }

        #quiz-modal .quiz-sticky-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            width: 100%;
            min-height: 64px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding: 10px 20px;
            background: #ffffff;
            border-bottom: 1px solid #e8edf2;
        }

        #quiz-modal .quiz-sticky-header .quiz-back-button {
            position: relative;
            z-index: 2;
            flex: 0 0 42px;
            width: 42px;
            height: 42px;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 50%;
            background: #000000;
            color: #ffffff;
            font-size: 20px;
            font-weight: 900;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-sizing: border-box;
        }

        #quiz-modal .quiz-sticky-header .quiz-back-button:hover {
            background: #222222;
        }

        #quiz-modal .quiz-progress-area {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: min(55%, 360px);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }

        #quiz-modal #quiz-progress-text {
            color: #34434c;
            font-size: 13px;
            font-weight: 700;
            line-height: 1.2;
        }

        #quiz-modal .quiz-progress-bar {
            width: 100%;
            height: 9px;
            display: grid;
            grid-template-columns: repeat(10, minmax(0, 1fr));
            gap: 3px;
        }

        #quiz-modal .quiz-progress-segment {
            min-width: 0;
            background: #e5eaf0;
            border-radius: 5px;
            transition: background 0.25s ease;
        }

        #quiz-modal .quiz-progress-segment.filled {
            background: #72c9ed;
        }

        @media (max-width: 480px) {
            #quiz-modal .quiz-sticky-header {
                padding: 10px 12px;
            }

            #quiz-modal .quiz-progress-area {
                width: 52%;
            }
        }
    `;

    document.head.appendChild(style);

})();


// ========================================
// QUIZ POPUP
// ========================================

function openQuiz(clickedButton) {

    selectMemorySection("quiz", clickedButton);

    const quizModal =
        document.getElementById("quiz-modal");

    quizModal.style.display = "flex";

    // Locate the popup panel so its header can remain sticky.
    const quizPanel =
        quizModal.querySelector(
            ".quiz-popup, .quiz-content, .quiz-box, .quiz-container, .modal-content"
        ) ||
        quizModal.firstElementChild ||
        quizModal;

    quizPanel.classList.add("quiz-progress-panel");

    // Find the existing back button so it is reused, not duplicated.
    let quizBackButton =
        quizModal.querySelector(".quiz-back-button");

    if (quizBackButton) {
        quizBackButton.textContent = "←";
        quizBackButton.setAttribute("aria-label", "Back");
        quizBackButton.type = "button";
    }

    // Create the sticky header only once.
    let stickyHeader =
        quizModal.querySelector(".quiz-sticky-header");

    if (!stickyHeader) {

        stickyHeader = document.createElement("div");
        stickyHeader.className = "quiz-sticky-header";

        const progressArea = document.createElement("div");
        progressArea.className = "quiz-progress-area";

        const progressText = document.createElement("span");
        progressText.id = "quiz-progress-text";
        progressText.textContent = "0/10";

        const progressBar = document.createElement("div");
        progressBar.className = "quiz-progress-bar";
        progressBar.setAttribute("role", "progressbar");
        progressBar.setAttribute("aria-label", "Quiz progress");
        progressBar.setAttribute("aria-valuemin", "0");
        progressBar.setAttribute("aria-valuemax", "10");
        progressBar.setAttribute("aria-valuenow", "0");

        // Create 10 progress segments.
        for (let i = 0; i < 10; i++) {
            const segment = document.createElement("div");
            segment.className = "quiz-progress-segment";
            progressBar.appendChild(segment);
        }

        progressArea.appendChild(progressText);
        progressArea.appendChild(progressBar);
        stickyHeader.appendChild(progressArea);
    }

    // Keep the existing back button on the left side.
    if (
        quizBackButton &&
        quizBackButton.parentElement !== stickyHeader
    ) {
        stickyHeader.insertBefore(
            quizBackButton,
            stickyHeader.firstChild
        );
    }

    // Place the header at the top of the quiz panel.
    if (stickyHeader.parentElement !== quizPanel) {
        quizPanel.insertBefore(
            stickyHeader,
            quizPanel.firstChild
        );
    }

    // Reset quiz and progress whenever it opens.
    resetQuiz();
}


function closeQuiz() {

    const quizModal =
        document.getElementById("quiz-modal");

    quizModal.style.display = "none";

    resetMemoryMenu();
}


// ========================================
// QUIZ ANSWERS AND PROGRESS
// ========================================

let quizScore = 0;

let answeredQuestions = 0;


// Update the 10-segment progress bar.
function updateQuizProgress() {

    const quizModal =
        document.getElementById("quiz-modal");

    if (!quizModal) {
        return;
    }

    // The progress bar is designed for 10 questions.
    const totalForProgress = 10;

    const count = Math.max(
        0,
        Math.min(totalForProgress, answeredQuestions)
    );

    const progressText =
        quizModal.querySelector("#quiz-progress-text");

    const progressBar =
        quizModal.querySelector(".quiz-progress-bar");

    const segments =
        quizModal.querySelectorAll(".quiz-progress-segment");

    // Update the number, such as 0/10, 1/10, 2/10.
    if (progressText) {
        progressText.textContent = count + "/10";
    }

    // Update accessible progress value.
    if (progressBar) {
        progressBar.setAttribute(
            "aria-valuenow",
            String(count)
        );
    }

    // Fill one segment for each answered question.
    segments.forEach(function(segment, index) {

        segment.classList.toggle(
            "filled",
            index < count
        );

    });
}


// Add click event to every quiz option.
document.querySelectorAll(".quiz-option").forEach(function(option) {

    option.addEventListener("click", function() {

        const question =
            this.closest(".quiz-question");

        if (!question) {
            return;
        }

        const options =
            question.querySelectorAll(".quiz-option");

        // Do not allow answering the same question twice.
        if (question.dataset.answered === "true") {
            return;
        }

        const correctAnswer =
            question.dataset.answer;

        const selectedAnswer =
            this.dataset.option;

        // Mark the question as answered.
        question.dataset.answered = "true";

        answeredQuestions++;

        // Update progress exactly once for this question.
        updateQuizProgress();

        // Check answer.
        if (selectedAnswer === correctAnswer) {

            this.classList.add("correct");

            quizScore++;

        } else {

            this.classList.add("wrong");

            // Show the correct answer.
            options.forEach(function(option) {

                if (option.dataset.option === correctAnswer) {
                    option.classList.add("correct");
                }

            });
        }

        // Disable all options for this question.
        options.forEach(function(option) {
            option.classList.add("disabled");
        });

    });

});


// ========================================
// SUBMIT QUIZ
// ========================================

function submitQuiz() {

    const totalQuestions =
        document.querySelectorAll(".quiz-question").length;

    const result =
        document.getElementById("quiz-result");

    const submitButton =
        document.querySelector(".quiz-submit-button");

    // Check whether all questions have been answered.
    if (answeredQuestions < totalQuestions) {

        result.textContent =
            "Please answer all " +
            totalQuestions +
            " questions first.";

        return;
    }

    // Show final score.
    result.textContent =
        "Your Score: " +
        quizScore +
        " / " +
        totalQuestions +
        " 🎉";

    // Hide Submit Quiz button.
    if (submitButton) {
        submitButton.style.display = "none";
    }
}


// ========================================
// RESET QUIZ
// ========================================

function resetQuiz() {

    quizScore = 0;

    answeredQuestions = 0;

    // Reset progress to 0/10.
    updateQuizProgress();

    const questions =
        document.querySelectorAll(".quiz-question");

    questions.forEach(function(question) {

        question.dataset.answered = "false";

        const options =
            question.querySelectorAll(".quiz-option");

        options.forEach(function(option) {

            option.classList.remove("correct");
            option.classList.remove("wrong");
            option.classList.remove("disabled");

        });

    });

    const result =
        document.getElementById("quiz-result");

    if (result) {
        result.textContent = "";
    }

    // Show Submit Quiz button again after resetting.
    const submitButton =
        document.querySelector(".quiz-submit-button");

    if (submitButton) {
        submitButton.style.display = "";
    }
}


// ========================================
// TIMELINE
// ========================================


function showTimelineIntro() {
    // Use the welcome section already present in index.html.
    const timelineIntro = document.getElementById("timeline-intro");

    if (timelineIntro) {
        timelineIntro.hidden = false;
    }
}


function openTimelinePopup() {
    const popup = document.getElementById("timeline-popup-overlay");
    const quiz = document.getElementById("timeline-year-quiz");
    const feedback = document.getElementById("timeline-year-feedback");

    if (!popup || !quiz || !feedback) {
        console.error("Timeline HTML is missing required elements.");
        return;
    }

    // Reset the question whenever the popup opens.
    quiz.hidden = false;
    quiz.dataset.unlocked = "false";

    feedback.textContent = "";
    feedback.className = "timeline-year-feedback";

    quiz.querySelectorAll(".timeline-year-option").forEach(function(option) {
        option.disabled = false;
    });

    // Keep the next two cards locked until the correct answer.
    popup.querySelectorAll(".timeline-locked-card").forEach(function(card) {
        card.hidden = true;
        card.classList.remove("timeline-card-reveal");
    });

    // Reset the chat-history prompt and fourth card.
    const chatPrompt = document.getElementById("timeline-chat-prompt");
    const fourthCard = document.getElementById("timeline-fourth-card");

    if (chatPrompt) {
        chatPrompt.hidden = true;
    }

    if (fourthCard) {
        fourthCard.hidden = true;
        fourthCard.classList.remove("timeline-card-reveal");
    }

    // Reset the recent meetup button and cards 5–6.
    const meetupPrompt =
        document.getElementById("timeline-meetup-prompt");

    const fifthCard =
        document.getElementById("timeline-fifth-card");

    const sixthCard =
        document.getElementById("timeline-sixth-card");

    if (meetupPrompt) {
        meetupPrompt.hidden = true;
    }

    [fifthCard, sixthCard].forEach(function(card) {
        if (card) {
            card.hidden = true;
            card.classList.remove("timeline-card-reveal");
        }
    });

    const hardTimesPrompt =
        document.getElementById("timeline-hardtimes-prompt");
    const seventhCard =
        document.getElementById("timeline-seventh-card");
    const eighthCard =
        document.getElementById("timeline-eighth-card");
    
    if (hardTimesPrompt) {
        hardTimesPrompt.hidden = true;
    }
    
    [seventhCard, eighthCard].forEach(function(card) {
        if (card) {
            card.hidden = true;
            card.classList.remove("timeline-card-reveal");
        }
    });

    
    // Reset the two new final cards when reopening Timeline.
    ["timeline-ninth-card", "timeline-tenth-card"].forEach(
        function(cardId) {
            const card = document.getElementById(cardId);

            if (card) {
                card.hidden = true;
                card.classList.remove("timeline-card-reveal");
            }
        }
    );

    
    popup.hidden = false;
}


function checkTimelineYear(button) {
    const quiz = document.getElementById("timeline-year-quiz");
    const feedback = document.getElementById("timeline-year-feedback");
    const popup = document.getElementById("timeline-popup-overlay");

    if (!quiz || !feedback || !popup || quiz.dataset.unlocked === "true") {
        return;
    }

    const selectedYear = button.dataset.year;
    const correctYear = quiz.dataset.correctAnswer;

    // Wrong answer: show a message and allow another attempt.
    if (selectedYear !== correctYear) {
        feedback.textContent =
            "Sorry Tiasha 😔 you picked the wrong answer, please try again";

        feedback.className = "timeline-year-feedback wrong";
        return;
    }

    // Correct answer: hide the question.
    quiz.dataset.unlocked = "true";
    quiz.hidden = true;

    // Reveal the second and third cards.
    popup.querySelectorAll(".timeline-locked-card").forEach(function(card) {
        card.hidden = false;
        card.classList.add("timeline-card-reveal");
    });

    // Show the chat-history prompt after the cards have time to appear.
    const chatPrompt = document.getElementById("timeline-chat-prompt");

    if (chatPrompt) {
        setTimeout(function() {
            if (quiz.dataset.unlocked === "true" && !popup.hidden) {
                chatPrompt.hidden = false;
            }
        }, 1000);
    }   
}

function showFourthTimelineCard() {
    const quiz =
        document.getElementById("timeline-year-quiz");

    const prompt =
        document.getElementById("timeline-chat-prompt");

    const fourthCard =
        document.getElementById("timeline-fourth-card");

    const meetupPrompt =
        document.getElementById("timeline-meetup-prompt");

    const popup =
        document.getElementById("timeline-popup-overlay");

    if (
        !quiz ||
        !prompt ||
        !fourthCard ||
        !meetupPrompt ||
        !popup ||
        quiz.dataset.unlocked !== "true"
    ) {
        return;
    }

    // Hide the existing chat-history prompt.
    prompt.hidden = true;

    // Reveal the fourth card.
    fourthCard.hidden = false;
    fourthCard.classList.add("timeline-card-reveal");

    // Show the recent meetup button after card 4 appears.
    window.setTimeout(function() {
        if (!popup.hidden && !fourthCard.hidden) {
            meetupPrompt.hidden = false;
        }
    }, 1000);
}


function showMeetupTimelineCards() {
    const quiz =
        document.getElementById("timeline-year-quiz");
    const meetupPrompt =
        document.getElementById("timeline-meetup-prompt");
    const fifthCard =
        document.getElementById("timeline-fifth-card");
    const sixthCard =
        document.getElementById("timeline-sixth-card");
    const hardTimesPrompt =
        document.getElementById("timeline-hardtimes-prompt");
    const popup =
        document.getElementById("timeline-popup-overlay");

    if (
        !quiz ||
        !meetupPrompt ||
        !fifthCard ||
        !sixthCard ||
        !hardTimesPrompt ||
        !popup ||
        quiz.dataset.unlocked !== "true"
    ) {
        return;
    }

    meetupPrompt.hidden = true;
    hardTimesPrompt.hidden = true;

    [fifthCard, sixthCard].forEach(function(card) {
        card.hidden = false;
        card.classList.remove("timeline-card-reveal");
        void card.offsetWidth;
        card.classList.add("timeline-card-reveal");
    });

    // Show the hard-times message after both cards reveal.
    window.setTimeout(function() {
        if (
            !popup.hidden &&
            !fifthCard.hidden &&
            !sixthCard.hidden
        ) {
            hardTimesPrompt.hidden = false;
        }
    }, 1000);
}

function showHardTimesTimelineCards() {
    const prompt = document.getElementById(
        "timeline-hardtimes-prompt"
    );

    // Hide the hard-times prompt.
    if (prompt) {
        prompt.hidden = true;
    }

    // Reveal cards 7, 8, 9, and 10 together.
    const finalTimelineCards = [
        "timeline-seventh-card",
        "timeline-eighth-card",
        "timeline-ninth-card",
        "timeline-tenth-card"
    ];

    finalTimelineCards.forEach(function(cardId) {
        const card = document.getElementById(cardId);

        if (card) {
            card.hidden = false;
            card.classList.add("timeline-card-reveal");
        }
    });
}


function returnToMainMenu() {
    // Close the Timeline popup.
    closeTimelinePopup();

    // Restore all six existing main menu options.
    resetMemoryMenu();
}


function closeTimelinePopup() {
    const popup = document.getElementById("timeline-popup-overlay");

    if (popup) {
        popup.hidden = true;
    }
}


/* ========================================
   FUN FACT ANIMATION CONTROLS
======================================== */

function startFunFactAnimation() {
    const stage = document.getElementById("fun-fact-stage");
    const boy = document.getElementById("fun-fact-boy");
    const girl = document.getElementById("fun-fact-girl");
    const homeButton = document.getElementById("fun-fact-home-button");

    if (!stage || !boy || !girl || !homeButton) {
        return;
    }

    // Hide Home until both characters have arrived.
    homeButton.hidden = true;

    // Reset the scene so the animation can replay every time.
    stage.classList.remove("fun-fact-playing", "fun-fact-ready");

    // Reset character positions and restart their CSS animations.
    void stage.offsetWidth;

    // Count the two animation completions.
    const finishedCharacters = new Set();

    [boy, girl].forEach(function(character) {
        character.onanimationend = function(event) {
            if (event.target !== character) {
                return;
            }

            finishedCharacters.add(character.id);

            // Show Home only after BOTH characters have arrived.
            if (finishedCharacters.size === 2) {
                stage.classList.add("fun-fact-ready");
                homeButton.hidden = false;
            }
        };
    });

    stage.classList.add("fun-fact-playing");
}


/* Return to the original six-option main menu. */

function closeFunFactAndReturnHome() {
    const stage = document.getElementById("fun-fact-stage");

    if (stage) {
        stage.hidden = true;
        stage.classList.remove("fun-fact-playing", "fun-fact-ready");
    }

    // Reuse your existing main-menu reset function.
    resetMemoryMenu();
}

loadSavedMedia();


async function removeDeletedMediaFromPage() {
    try {
        const response = await fetch("/api/media");

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        const existingIds = new Set(
            data.items.map(item => String(item.id))
        );

        // Remove missing media from every visible section
        // and from the hidden media storage.
        document.querySelectorAll("[data-media-id]").forEach(
            function(media) {
                if (!existingIds.has(media.dataset.mediaId)) {
                    media.remove();
                }
            }
        );
    } catch (error) {
        console.error(
            "Could not synchronize deleted media:",
            error
        );
    }
}

// Check for deleted files immediately and every 5 seconds.
removeDeletedMediaFromPage();

window.setInterval(removeDeletedMediaFromPage, 5000);


/* =========================
   FEATURING TEXT: ANIMATE EVERY VISIT
========================= */

document.addEventListener("DOMContentLoaded", function () {
    const featuringNames = document.querySelector(".featuring-names");

    if (!featuringNames) return;

    // Restart the existing slide-in animation every time the page loads
    featuringNames.style.animation = "none";
    featuringNames.style.opacity = "0";
    featuringNames.style.transform = "translateX(55px)";

    // Reflow the element so the animation restarts reliably
    void featuringNames.offsetWidth;

    featuringNames.style.animation = "";
});

/* =====================================
   PERSONAL IDENTITY POPUP
===================================== */

(function initIdentityPopup() {
    function setupIdentityPopup() {
        const modal = document.getElementById("identity-modal");
        const photo = document.getElementById("identity-photo");
        const title = document.getElementById("identity-title");
        const description = document.getElementById(
            "identity-description"
        );
        const closeButton = document.getElementById("identity-close");

        if (
            !modal ||
            !photo ||
            !title ||
            !description ||
            !closeButton
        ) {
            return;
        }

        // Edit these details and image paths whenever you like.
        const identities = {
            tiasha: {
                name: "Ashmita Roy Tiasha",
                image: "Images/tiasha.jpeg",
                alt: "Tiasha's portrait",
                description:
                    "Tiasha was born on January 6, 2011 in Rajshahi. She is a very talented girl since her childhood. Currently she is studying at class 9. Her hobby is to become a Great Dancer and from her childhood she loves dance very much. Her expression, dance movements and overall dance performance is outstanding and eye soothing. She is also a very beautiful and sweet girl and very much friendly to everyone. She is also very good at art."
            },

            tonmoy: {
                name: "Tonmoy Goon",
                image: "Images/tonmoy.jpeg",
                alt: "Tonmoy's portrait",
                description:
                    "Tonmoy was born on June 6, 1999 in Rajshahi. He is a graduate Engineer from Bangladesh University of Textiles. After completing graduation, he worked in Fabric R&D department as an Executive Officer at Interstoff Apparels Ltd. He is a talented guy and studied in some of the renowned instituitions in Bangladesh like B.L. Govt. High School, Notre Dame College and currently IBA JU. His hobby is programming and problem solving."
            }
        };

        let previousFocus = null;

        function openIdentity(identityKey, clickedButton) {
            const person = identities[identityKey];

            if (!person) return;

            previousFocus = clickedButton;

            title.textContent = person.name;
            title.style.textAlign = "center";
            title.style.width = "100%";
            photo.src = person.image;
            photo.alt = person.alt;
            description.textContent = person.description;

            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("identity-popup-open");

            closeButton.focus();
        }

        function closeIdentity() {
            if (!modal.classList.contains("is-open")) return;

            modal.classList.remove("is-open");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("identity-popup-open");

            if (previousFocus && previousFocus.isConnected) {
                previousFocus.focus();
            }
        }

        // Handle clicks on either name.
        document.querySelectorAll(".identity-name").forEach(button => {
            button.addEventListener("click", function () {
                openIdentity(this.dataset.identity, this);
            });
        });

        closeButton.addEventListener("click", closeIdentity);

        // Clicking the dark background closes the popup.
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeIdentity();
            }
        });

        // Escape key closes the popup.
        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                modal.classList.contains("is-open")
            ) {
                closeIdentity();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            setupIdentityPopup,
            { once: true }
        );
    } else {
        setupIdentityPopup();
    }
})();

