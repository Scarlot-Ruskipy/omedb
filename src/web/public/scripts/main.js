const Styles = [
    "/public/styles/main.css",
];

const EnsureCss = async (path) => {
    if (document.querySelector(`[omedb-imported-css]`)) return;

    const code = await fetch(path).then(res => res.text());

    const style = document.createElement("style");
    style.setAttribute("omedb-imported-css", "");
    style.innerHTML = code;

    document.head.appendChild(style);

    if (Styles.indexOf(path) === Styles.length - 1) {
        document.querySelectorAll(`[omedb-loader]`).forEach(loader => loader.remove());
    }
};

Styles.forEach(EnsureCss);

//==== Navbar ====\\
const waitForNavbar = async () => {
    while (!document.querySelector(`[omedb-navbar]`)) {
        console.log("Waiting for Navbar");
        await new Promise(resolve => requestAnimationFrame(resolve));
    }

    const Navbar = document.querySelector(`[omedb-navbar]`);

    if (Navbar) {
        function OpenHome() {
            document.querySelector("[omedb-page-home]").hidden = false;
            document.querySelector("[omedb-page-content]").hidden = true;
        }

        window.OpenHome = OpenHome;

        const OpenTabs = window.localStorage.getItem("omedb-open-tabs");

        if (OpenTabs) {
            const Tabs = JSON.parse(OpenTabs);

            Tabs.forEach(tab => {
                console.log(tab);

                if (tab.current && tab.name === "Home") {
                    OpenHome();
                }
            });
        } else {
            OpenHome();
        }
    }
};

waitForNavbar();