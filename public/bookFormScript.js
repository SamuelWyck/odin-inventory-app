const delbtn = document.querySelector(".del-btn");
const checkbox = document.querySelector("#del-checkbox");
const form = document.querySelector(".book-form");

if (delbtn) {
    delbtn.addEventListener("click", function(e) {
        e.preventDefault();
        checkbox.checked = true;
        form.submit();
    });
}