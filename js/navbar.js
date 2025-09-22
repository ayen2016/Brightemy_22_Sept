// ----------------------------
// Hamburger Menu
// ----------------------------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchButton = document.getElementById('search-button');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  searchResults.style.display = 'none';
});

// ----------------------------
// List of pages to search
// ----------------------------
const pages = [
  'index.html',
  'Courses.html',
  'Partners.html',
  'About-Brightemy.html',
  'Blog.html',
  'Contact.html',
  'Sponsor.html',
  'Web-Development-Course.html',
  'Cyber-Security-&-Online-Saftey-Course.html',
  'Microsoft-Office-365-Course.html',
  'Graphic-Design-Course.html',
  'Digital-Marketing-Course.html',
  'Video-Editing-Course.html',
  'Privacy-Policy.html',
  'Partner-Voktis-Group',
  'Partner-Sixteen-Foundation',
  'Terms-&-Conditions.html'
];

let navData = [];

// ----------------------------
// Build search index dynamically by fetching HTML pages
// ----------------------------
async function buildSearchIndex() {
  const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

  for (const page of pages) {
    try {
      const absoluteUrl = window.location.origin + basePath + page;
      const res = await fetch(absoluteUrl);
      const html = await res.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const title = tempDiv.querySelector('title')?.innerText || page;
      const content = tempDiv.innerText;

      navData.push({ title, link: page, content });
    } catch (err) {
      console.warn(`Could not fetch ${page}:`, err);
    }
  }

  console.log('✅ Search index built:', navData);
}

// ----------------------------
// Highlight functions
// ----------------------------
function removeHighlights() {
  document.querySelectorAll('mark.search-highlight').forEach(mark => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

function highlightText(searchTerm) {
  if (!searchTerm) return;
  removeHighlights();

  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedTerm})`, 'gi');

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: node => {
        if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE' || node.closest('#search-results')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    const text = node.textContent;
    if (regex.test(text)) {
      const span = document.createElement('span');
      span.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
      node.parentNode.replaceChild(span, node);
    }
  });

  const firstHighlight = document.querySelector('mark.search-highlight');
  if (firstHighlight) firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ----------------------------
// Search functions (prediction vs exact search)
// ----------------------------
function getSearchResults(query, isPrediction = false) {
  if (!query) return [];
  query = query.toLowerCase();

  const wordRegex = new RegExp(`\\b${query}\\b`, 'i');   // exact word
  const partialRegex = new RegExp(query, 'i');           // partial match

  return navData
    .map(item => {
      let score = 0;
      const filename = item.link.replace('.html', '').toLowerCase();
      const title = item.title.toLowerCase();
      const content = item.content.toLowerCase();

      if (isPrediction) {
        // Prediction mode → partial matches allowed
        if (partialRegex.test(filename)) score += 4;
        if (partialRegex.test(title)) score += 3;
        if (partialRegex.test(content)) score += 1;
      } else {
        // Final search → only exact matches
        if (wordRegex.test(filename)) score += 3;
        if (wordRegex.test(title)) score += 2;
        if (wordRegex.test(content)) score += 1;
      }

      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ----------------------------
// Display dropdown results
// ----------------------------
function displaySearchResults(results) {
  searchResults.innerHTML = '';
  if (results.length === 0) {
    searchResults.style.display = 'none';
    return;
  }

  results.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${item.link}">${item.title}</a>`;
    searchResults.appendChild(li);
  });

  searchResults.style.display = 'block';
}

// ----------------------------
// Handle search input & button
// ----------------------------
function handleSearchInput() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) { 
    searchResults.style.display = 'none'; 
    removeHighlights();
    return; 
  }

  // Prediction mode while typing
  const results = getSearchResults(query, true);
  displaySearchResults(results);
}

function handleSearchButtonClick() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) return;
  const results = getSearchResults(query, false); // exact match
  if (results.length > 0) {
    const linkWithSearch = `${results[0].link}?search=${encodeURIComponent(query)}`;
    window.location.href = linkWithSearch;
  } else {
    displaySearchResults(results);
  }
}

// ----------------------------
// Event listeners
// ----------------------------
searchInput.addEventListener('input', handleSearchInput);
searchButton.addEventListener('click', handleSearchButtonClick);
document.addEventListener('click', e => {
  if (!document.getElementById('search-container').contains(e.target)) searchResults.style.display = 'none';
});
window.addEventListener('resize', () => { searchResults.style.display = 'none'; });

// ----------------------------
// Initialize
// ----------------------------
document.addEventListener('DOMContentLoaded', async () => {
  await buildSearchIndex();

  // Highlight term if search parameter exists
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');
  if (searchTerm) {
    searchInput.value = searchTerm;
    highlightText(searchTerm);
  }
});

