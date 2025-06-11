(function() {
    const openBtn = document.querySelector(".category-bar-open-btn");
    const sideBar = document.querySelector(".category-bar");


    openBtn.addEventListener("click", function(event) {
        toggleBar();
        event.stopPropagation();
    });

    sideBar.addEventListener("click", function(event) {
        const target = event.target;
        if (!target.matches(".close-bar-btn")) {
            event.stopPropagation();
            return;
        }

        toggleBar();
        event.stopPropagation();
    });

    document.addEventListener("click", function(event) {
        const target = event.target;
        if (target.matches(".category-bar-open-btn") || !openBtn.classList.contains("hidden")) {
            return;
        }

        toggleBar();
    });


    function toggleBar() {
        openBtn.classList.toggle("hidden");
        sideBar.classList.toggle("hidden");
    };
})();