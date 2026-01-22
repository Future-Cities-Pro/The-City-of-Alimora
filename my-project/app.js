// Mobile Menu Toggle
const menu = document.getElementById('mobile-menu');
const menuLinks = document.querySelectorAll('.navbar__links');

if (menu) {
    menu.addEventListener('click', function() {
        const navMenu = document.querySelector('.navbar__menu');
        navMenu.classList.toggle('active');
        
        // Toggle bar animation
        this.classList.toggle('active');
    });
}

// Close menu when a link is clicked
menuLinks.forEach(link => {
    link.addEventListener('click', function() {
        const navMenu = document.querySelector('.navbar__menu');
        navMenu.classList.remove('active');
        if (menu) menu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    }
});

// Map functionality //
const locations = [
  {
    id: 1,
    name: "Exton Mall",
    coordinates: [40.0314, -75.6236],
    address: "260 Exton Square",
    city: "Exton",
    state: "PA, US",
    color: "blue"
  },
  {
    id: 2,
    name: "American Helicopter Museum",
    coordinates: [39.991863, -75.578867],
    address: "1220 American Blvd",
    city: "West Chester",
    state: "PA, US",
    color: "red"
  },
  {
    id: 3,
    name: "Exton Park",
    coordinates: [40.0380, -75.6124],
    address: "611 Swedesford Road",
    city: "Exton",
    state: "PA, US",
    color: "green"
  },
  {
    id: 4,
    name: "Church Farm School",
    coordinates: [40.0328, -75.5951],
    address: "1001 Lincoln Hwy",
    city: "Exton",
    state: "PA, US",
    color: "orange"
  }
];

let mapInstance = null;
let markersArray = [];

function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  // Fix for default marker icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });

  // Calculate center point
  const avgLat = locations.reduce((sum, loc) => sum + loc.coordinates[0], 0) / locations.length;
  const avgLng = locations.reduce((sum, loc) => sum + loc.coordinates[1], 0) / locations.length;

  // Create map
  mapInstance = L.map('map').setView([avgLat, avgLng], 11);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapInstance);

  // Create marker group
  const markerGroup = L.featureGroup();

  // Add markers
  locations.forEach((location) => {
    const markerColor = location.color || 'blue';
    const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${markerColor}.png`;
    const iconRetinaUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`;

    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconRetinaUrl: iconRetinaUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const marker = L.marker(location.coordinates, {
      icon: customIcon
    }).addTo(mapInstance);

    const colorMap = {
      'blue': '007bff',
      'red': 'dc3545',
      'green': '28a745',
      'orange': 'ffc107'
    };

    const borderColor = colorMap[markerColor] || '007bff';

    marker.bindPopup(`
      <div style="padding: 5px; min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 2px solid #${borderColor}; padding-bottom: 5px;">${location.name}</h3>
        <p style="margin: 5px 0;"><strong>Address:</strong> ${location.address}</p>
        <p style="margin: 5px 0;"><strong>City:</strong> ${location.city}</p>
        <p style="margin: 5px 0;"><strong>State:</strong> ${location.state}</p>
      </div>
    `);

    markersArray.push(marker);
    markerGroup.addLayer(marker);
  });

  // Fit bounds
  mapInstance.fitBounds(markerGroup.getBounds().pad(0.1));

  // Open first popup
  if (markersArray.length > 0) {
    markersArray[0].openPopup();
  }

  // Invalidate size
  setTimeout(() => {
    mapInstance.invalidateSize();
  }, 100);

  // Populate location cards
  const grid = document.getElementById('locations-grid');
  const count = document.getElementById('location-count');
  
  if (grid && count) {
    count.textContent = `Featured Locations (${locations.length})`;
    grid.innerHTML = locations.map((location) => `
      <div class="location-card" style="padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; border-top: 4px solid #${getColorHex(location.color)};" onclick="jumpToLocation(${location.id - 1})">
        <h4 style="margin: 0 0 0.5rem 0; color: #fff;">${location.name}</h4>
        <p style="margin: 0; font-size: 0.875rem; color: #666;">
          <strong>Address:</strong> ${location.address}<br />
          <strong>City:</strong> ${location.city}, ${location.state}
        </p>
      </div>
    `).join('');
  }
}

function getColorHex(color) {
  const colorMap = {
    'blue': '007bff',
    'red': 'dc3545',
    'green': '28a745',
    'orange': 'ffc107'
  };
  return colorMap[color] || '007bff';
}

function jumpToLocation(index) {
  if (!mapInstance || !markersArray[index]) return;
  
  const location = locations[index];
  mapInstance.setView(location.coordinates, 15, {
    animate: true,
    duration: 1
  });

  setTimeout(() => {
    markersArray[index].openPopup();
  }, 500);
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);

// People Data
const peopleData = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Lead Engineer",
    history: "Sarah is the primary designer and engineer behind SafeDose. With 10 years of experience in medical device development, she identified the medication adherence problem and led the team to create an inclusive solution."
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    role: "Medical Advisor",
    history: "Dr. Rodriguez is a geriatric care specialist who provided medical expertise and user insights from his work with older patients. He emphasized the importance of multi-sensory alerts."
  },
  {
    id: 3,
    name: "James Park",
    role: "Software Developer",
    history: "James developed the SafeDose smartphone app with Bluetooth integration. His work enables caregivers to monitor medication adherence and receive emergency notifications when doses are missed."
  },
  {
    id: 4,
    name: "Emma Davis",
    role: "Accessibility Specialist",
    history: "Emma ensured SafeDose works for people with hearing and vision impairments. Her advocacy for the vibration alert system made SafeDose truly inclusive for all users."
  },
  {
    id: 5,
    name: "Alex Thompson",
    role: "Industrial Designer",
    history: "Alex designed SafeDose to be user-friendly and compact. His focus on clean design and intuitive interfaces makes it easy for anyone to use, regardless of technical skill."
  }
];

// Initialize people section with enhanced features
function initPeople() {
  const peopleGrid = document.getElementById('people-grid');
  if (!peopleGrid) return;

  peopleGrid.innerHTML = peopleData.map((person) => `
    <div class="people-card" data-name="${person.name}">
      <div class="people-card-content">
        <h3 class="card-title" style="color: #fff; margin-bottom: 0.5rem;">${person.name}</h3>
        <span class="badge" style="background-color: rgba(255, 128, 119, 0.3); color: #ffb199; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; display: inline-block; margin-bottom: 1rem;">${person.role}</span>
        <p class="card-text" style="color: #e0e0e0; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${person.history}</p>
      </div>
      <button class="details-btn" onclick="openPeopleModal(${person.id})">Learn More</button>
    </div>
  `).join('');
  
  setupPeopleEventListeners();
}

// Setup people search and sort functionality
function setupPeopleEventListeners() {
  const searchInput = document.getElementById('people-search');
  const sortBtn = document.getElementById('sort-btn');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterPeople);
  }
  
  if (sortBtn) {
    let sortAscending = true;
    sortBtn.addEventListener('click', function() {
      const cards = Array.from(document.querySelectorAll('.people-card'));
      sortAscending = !sortAscending;
      
      cards.sort((a, b) => {
        const nameA = a.dataset.name;
        const nameB = b.dataset.name;
        return sortAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
      
      const grid = document.getElementById('people-grid');
      cards.forEach(card => grid.appendChild(card));
      
      sortBtn.textContent = sortAscending ? 'Sort A-Z' : 'Sort Z-A';
      sortBtn.classList.toggle('sort-reversed');
    });
  }
}

function filterPeople() {
  const searchInput = document.getElementById('people-search');
  const searchTerm = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll('.people-card');
  
  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    if (name.includes(searchTerm)) {
      card.style.display = '';
      card.classList.add('fade-in');
    } else {
      card.style.display = 'none';
    }
  });
}

function openPeopleModal(id) {
  const person = peopleData.find(p => p.id === id);
  if (!person) return;
  
  document.getElementById('modal-name').textContent = person.name;
  document.getElementById('modal-role').textContent = person.role;
  document.getElementById('modal-history').textContent = person.history;
  
  const modal = document.getElementById('people-modal');
  modal.classList.add('show');
}

function closePeopleModal() {
  const modal = document.getElementById('people-modal');
  modal.classList.remove('show');
}

// Modal close button and background click
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('people-modal');
  if (modal) {
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', closePeopleModal);
    }
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closePeopleModal();
      }
    });
  }
});

// Fun Facts Data
const funFacts = [
  {
    question: "How far can the LED lights be seen?",
    answer: "Up to 20 feet away, making the alert visible even from across the room"
  },
  {
    question: "How many alert methods does SafeDose have?",
    answer: "Three: Bright LED lights, loud buzzer, and vibration with strap for tactile feedback"
  },
  {
    question: "How many batteries can SafeDose use?",
    answer: "Up to 4 'C' batteries for extended operation and reliability"
  },
  {
    question: "What does S.A.F.E. stand for?",
    answer: "Scheduled, Accessible, Flashing lights & sound, Easy to use"
  },
  {
    question: "What does V.I.B.E. stand for?",
    answer: "Vibration alerts, Inclusive design, Bright lights, Effective"
  },
  {
    question: "Can SafeDose connect to a smartphone?",
    answer: "Yes! Optional Bluetooth app allows dose tracking, emergency contacts, and adherence monitoring"
  }
];

// Initialize fun facts with enhanced interactivity
function initFunFacts() {
  const container = document.getElementById('facts-container');
  if (!container) return;

  container.innerHTML = funFacts.map((fact, index) => `
    <div class="fact-card" onclick="toggleFact(this)" data-index="${index}">
      <div class="fact-front">
        <span class="fact-question">${fact.question}</span>
        <span class="flip-hint">Click to reveal</span>
      </div>
      <div class="fact-back">
        <span class="fact-answer">${fact.answer}</span>
      </div>
    </div>
  `).join('');
}

function toggleFact(element) {
  element.classList.toggle('flipped');
}

// Animated Counter for Stats
function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const hasPlus = target > 100;
  const increment = target / 60;
  let current = 0;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (hasPlus ? '+' : '');
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
    }
  }, 20);
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Animate counters when stat cards come into view
        if (entry.target.classList.contains('stat-card')) {
          const statNumber = entry.target.querySelector('.stat-number');
          if (statNumber && !statNumber.hasAttribute('data-animated')) {
            statNumber.setAttribute('data-animated', 'true');
            animateCounter(statNumber);
          }
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.services__card, .stat-card, .fact-card').forEach(el => {
    observer.observe(el);
  });
}

// Timeline filtering functionality
function setupTimelineFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (filterBtns.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter timeline items
      timelineItems.forEach(item => {
        if (filter === 'all') {
          item.style.opacity = '1';
          item.style.pointerEvents = 'auto';
        } else {
          const year = item.querySelector('h3').textContent;
          if (year.includes(filter)) {
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
          } else {
            item.style.opacity = '0.3';
            item.style.pointerEvents = 'none';
          }
        }
      });
    });
  });
}

// Map location filtering and search
function setupMapFilters() {
  const searchInput = document.getElementById('location-search');
  const filterBtns = document.querySelectorAll('.map-controls .filter-btn');
  
  if (!searchInput && filterBtns.length === 0) return;

  // Update locations data with categories
  const locationsWithCategories = [
    { ...locations[0], category: 'shopping' },
    { ...locations[1], category: 'recreation' },
    { ...locations[2], category: 'recreation' },
    { ...locations[3], category: 'education' }
  ];

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const cards = document.querySelectorAll('.location-card');
      
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          card.style.display = '';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const cards = document.querySelectorAll('.location-card');
        cards.forEach(card => {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            // For now, show all if filtered (you can enhance this based on location data)
            card.style.display = '';
          }
        });
      });
    });
  }
}

// Parallax effect for hero sections
function setupParallax() {
  const heroImages = document.querySelectorAll('#main__img');
  
  window.addEventListener('scroll', () => {
    heroImages.forEach(img => {
      const scrollPos = window.scrollY;
      img.style.transform = `translateY(${scrollPos * 0.5}px)`;
    });
  });
}

// Update the DOMContentLoaded to initialize all new features
document.addEventListener('DOMContentLoaded', function() {
  initMap();
  initPeople();
  initFunFacts();
  setupScrollAnimations();
  setupTimelineFilters();
  setupMapFilters();
});
