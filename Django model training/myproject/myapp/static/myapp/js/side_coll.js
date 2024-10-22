function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (sidebar.style.width === "0px" || sidebar.style.width === "") {
        sidebar.style.width = "500px"; // Show sidebar
        main.style.marginLeft = "500px"; // Push main content to the right
    } else {
        sidebar.style.width = "0"; // Hide sidebar
        main.style.marginLeft = "0"; // Reset main content position
    }
}
