document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const menuButton = document.querySelector('.menu-button-2');
    const navMenu = document.querySelector('.nav-menu-2');
    const navOverlay = document.querySelector('.w-nav-overlay');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', function () {
            this.classList.toggle('w--open');
            navMenu.classList.toggle('w--nav-menu-open');

            // Handle overlay if needed (optional based on CSS)
            if (navOverlay) {
                navOverlay.style.display = navMenu.classList.contains('w--nav-menu-open') ? 'block' : 'none';
            }
        });
    }

    // Dropdowns
    const dropdowns = document.querySelectorAll('.w-dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.w-dropdown-toggle');
        const list = dropdown.querySelector('.w-dropdown-list');
        let timeout;

        // Desktop Hover
        dropdown.addEventListener('mouseenter', function () {
            if (window.innerWidth > 991) {
                clearTimeout(timeout);
                toggle.classList.add('w--open');
                list.classList.add('w--open');
            }
        });

        dropdown.addEventListener('mouseleave', function () {
            if (window.innerWidth > 991) {
                timeout = setTimeout(() => {
                    toggle.classList.remove('w--open');
                    list.classList.remove('w--open');
                }, 200); // Small delay for better UX
            }
        });

        // Mobile Click / Touch
        toggle.addEventListener('click', function (e) {
            if (window.innerWidth <= 991) {
                e.preventDefault(); // Prevent default link behavior if it's a link
                toggle.classList.toggle('w--open');
                list.classList.toggle('w--open');
            }
        });
    });

    // Search Box Toggle
    const searchIcon = document.querySelector('.search-icon');
    const searchWrapper = document.querySelector('.searchbox-wrapper');

    if (searchIcon && searchWrapper) {
        searchIcon.addEventListener('click', function (e) {
            e.preventDefault();
            searchWrapper.classList.toggle('current');
        });
    }

    // Search Functionality (Mock)
    window.SearchSite = function () {
        const input = document.getElementById('resinput');
        if (input && input.value) {
            window.location.href = "https://webs-stellar-site-9d0609.webflow.io/search?query=" + encodeURIComponent(input.value);
        }
    };
});
