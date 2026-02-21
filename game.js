document.addEventListener("DOMContentLoaded", () => {
    // --------- Utilities ----------
    function parseNames(raw) {
        return raw
            .split(/[\n,]/g)
            .map(s => s.trim())
            .filter(Boolean);
    }

    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function makePlaceholderName(i) {
        return `Player ${i + 1}`;
    }

    function clampInt(value, min, max) {
        const n = Math.floor(Number(value));
        if (!Number.isFinite(n)) return min;
        return Math.max(min, Math.min(max, n));
    }

    // --------- State ----------
    let boardNames = [];
    let secretName = null;

    // --------- DOM ----------
    const boardEl = document.getElementById("board");
    const namesInputEl = document.getElementById("namesInput");
    const cardCountEl = document.getElementById("cardCount");
    const statusEl = document.getElementById("status");
    const secretEl = document.getElementById("secret");

    const buildBtn = document.getElementById("buildBtn");
    const resetFlipsBtn = document.getElementById("resetFlipsBtn");
    const pickSecretBtn = document.getElementById("pickSecretBtn");

    // --------- Board Building ----------
    function buildBoard() {
        const count = clampInt(cardCountEl.value, 2, 120);
        cardCountEl.value = count;

        const customNames = parseNames(namesInputEl.value);
        const used = customNames.slice(0, count);

        while (used.length < count) {
            used.push(makePlaceholderName(used.length));
        }

        boardNames = shuffle(used);
        secretName = null;
        secretEl.textContent = "";

        renderBoard();
        statusEl.textContent = `Board built with ${count} cards. Click cards to flip.`;
    }

    function renderBoard() {
        boardEl.innerHTML = "";

        boardNames.forEach((name) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "gw-card";
            card.setAttribute("aria-pressed", "false");

            const nameDiv = document.createElement("div");
            nameDiv.className = "gw-name";
            nameDiv.textContent = name;

            const overlay = document.createElement("div");
            overlay.className = "gw-overlay";
            overlay.textContent = "FLIPPED";

            card.appendChild(nameDiv);
            card.appendChild(overlay);

            card.addEventListener("click", () => {
                const flipped = card.classList.toggle("is-flipped");
                card.setAttribute("aria-pressed", flipped ? "true" : "false");
            });

            boardEl.appendChild(card);
        });
    }

    function resetFlips() {
        const cards = boardEl.querySelectorAll(".gw-card");
        cards.forEach(c => {
            c.classList.remove("is-flipped");
            c.setAttribute("aria-pressed", "false");
        });
        statusEl.textContent = "All cards reset (unflipped).";
    }

    function pickSecret() {
        if (boardNames.length === 0) {
            statusEl.textContent = "Build the board first.";
            return;
        }
        secretName = boardNames[Math.floor(Math.random() * boardNames.length)];
        secretEl.textContent = `Secret (for the host): ${secretName}`;
        statusEl.textContent = "Secret chosen. (Hide this from players!)";
    }

    // --------- Events ----------
    buildBtn.addEventListener("click", buildBoard);
    resetFlipsBtn.addEventListener("click", resetFlips);
    pickSecretBtn.addEventListener("click", pickSecret);

    // --------- Default names + start ----------
    namesInputEl.value =
        "miranda, sanya, alaa, ritish, jerrick, liz, carter, adam, maya, joban, sarah, matt, justin, owen, simrit, barb, kevin, dino, sadiq, scarlet, kyla, isaac, murray";

    buildBoard();
});