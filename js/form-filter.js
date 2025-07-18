document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("club-filter-form");
  const resultsDiv = document.getElementById("results");

  let clubsData = [];

  fetch("data/clubs.json")
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      clubsData = data;
    })
    .catch(error => {
      resultsDiv.innerHTML = `<p>Error loading clubs data: ${error.message}</p>`;
    });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const gender = form.querySelector("input[name='gender']:checked");
    const area = form.area.value.trim();
    const age = form.age.value.trim();

    resultsDiv.innerHTML = "";

    if (!gender) {
      resultsDiv.innerHTML = `<p style="color:red;">Please select a gender</p>`;
      return;
    }

    const selectedGender = gender.value;

    const filteredClubs = clubsData.filter(club => {
      if (club.GENDER !== selectedGender) return false;

      if (area) {
        const areas = Array.isArray(club["GENERAL PRACTICE AREA"])
          ? club["GENERAL PRACTICE AREA"]
          : [club["GENERAL PRACTICE AREA"]];
        if (!areas.includes(area)) return false;
      }

      if (age) {
        const individualAges = club["INDIVIDUAL AGES"] || [];
        if (!individualAges.includes(age)) return false;
      }

      return true;
    });

    if (filteredClubs.length === 0) {
      resultsDiv.innerHTML = "<p>No clubs found matching your criteria. Try searching for a club on the Locations or Club Info page :) </p>";
    } else {
      const resultHTML = filteredClubs.map(club => `
        <div class="club-card">
          <h3>${club.CLUB}</h3>
          <p><strong>Gender:</strong> ${club.GENDER}</p>
          <p><strong>Area:</strong> ${Array.isArray(club["GENERAL PRACTICE AREA"]) ? club["GENERAL PRACTICE AREA"].join(", ") : club["GENERAL PRACTICE AREA"]}</p>
          <p><strong>Ages:</strong> ${club.AGES}</p>
          <p><strong>Contact:</strong> ${club["CLUB EMAIL"]}</p>
          <p><strong>Phone:</strong> ${club["CONTACT PHONE"]}</p>
        </div>
      `).join("");
      resultsDiv.innerHTML = resultHTML;
    }
  });

  // === SLIDESHOW ===
  const slides = document.querySelectorAll('.slide');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active-dot', i === index);
    });
  }

  nextBtn?.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  prevBtn?.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.slide);
      currentSlide = index;
      showSlide(index);
    });
  });

  showSlide(currentSlide);
});
