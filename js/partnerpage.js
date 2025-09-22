document.addEventListener("DOMContentLoaded", () => {
  // Fetch the partner page
  fetch('Partners.html') // adjust if Partners.html is in a subfolder
    .then(response => response.text())
    .then(htmlString => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      // Select all partner images from the source page
      const partnerImages = doc.querySelectorAll('.sample_partner .sample_patner_image');

      if (!partnerImages.length) {
        console.warn('No partner images found in Partners.html');
        return;
      }

      // Select the marquee container
      const marquee = document.querySelector('.marquee');
      if (!marquee) return;

      // Function to create partner items
      const createPartnerItem = (img) => {
        const li = document.createElement('div'); // using div inside marquee
        li.className = 'partner-item';
        let imgSrc = img.getAttribute('src');

        // Clean relative paths
        if (imgSrc.startsWith('./') || imgSrc.startsWith('../')) {
          imgSrc = imgSrc.replace(/^(\.\/|\.\.\/)+/, '');
        }

        li.innerHTML = `<img src="${imgSrc}" alt="${img.alt}" loading="lazy">`;
        return li;
      };

      // Append original logos
      partnerImages.forEach(img => {
        marquee.appendChild(createPartnerItem(img));
      });

      // Duplicate logos for seamless scrolling
      partnerImages.forEach(img => {
        marquee.appendChild(createPartnerItem(img));
      });

    })
    .catch(err => console.error('Error fetching partners:', err));
});
