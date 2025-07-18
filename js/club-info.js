document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("club-cards");
  const pagination = document.getElementById("pagination");

  const clubsPerPage = 6;
  let currentPage = 1;
  let clubsData = [];

  fetch("data/clubs.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load clubs");
      return res.json();
    })
    .then(data => {
      clubsData = data;
      renderPage(1);
      renderPagination();
    })
    .catch(err => {
      container.innerHTML = `<p>Error loading clubs: ${err.message}</p>`;
    });

  function renderPage(page) {
    const start = (page - 1) * clubsPerPage;
    const end = start + clubsPerPage;
    const clubsToShow = clubsData.slice(start, end);

    const html = clubsToShow.map(club => `
      <div class="club-card">
        <h3>${club.CLUB}</h3>
        <p><strong>Gender:</strong> ${club.GENDER}</p>
        <p><strong>Area:</strong> ${Array.isArray(club["GENERAL PRACTICE AREA"]) ? club["GENERAL PRACTICE AREA"].join(", ") : club["GENERAL PRACTICE AREA"]}</p>
        <p><strong>Ages:</strong> ${club.AGES}</p>
        <p><strong>Email:</strong> ${club["CLUB EMAIL"]}</p>
        <p><strong>Phone:</strong> ${club["CONTACT PHONE"]}</p>
      </div>
    `).join("");

    container.innerHTML = html;
  }

  function renderPagination() {
    const totalPages = Math.ceil(clubsData.length / clubsPerPage);
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderPage(currentPage);
        renderPagination();
      });
      pagination.appendChild(btn);
    }
  }
});
