document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that we want to reveal on scroll
    const sections = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        root: null, // viewport
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class to animate in
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed (if you only want it to animate once)
                // observer.unobserve(entry.target); 
            } else {
                // Optional: Remove class if you want it to animate out when scrolling back up
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for the "Descubre más" button
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if(scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const firstSection = document.querySelector('.gallery-container');
            if(firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
