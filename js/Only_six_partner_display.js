
document.addEventListener("DOMContentLoaded", function() {
  const container = document.querySelector(".partner_display_one");
  const partners = container.querySelectorAll(".sample_partner");

  if (partners.length > 6) {
    partners.forEach((partner, index) => {
      if (index >= 6) partner.style.display = "none";
    });

    // Wrap in full-width container for proper centering
    const fullWrapper = document.createElement("div");
    fullWrapper.style.width = "100%";
    fullWrapper.style.display = "flex";
    fullWrapper.style.justifyContent = "center";
    fullWrapper.style.margin = "20px 0";

    const icon = document.createElement("span");
    icon.id = "partner_toggle_icon";
    icon.innerHTML = "&#9660;"; // ▼

    fullWrapper.appendChild(icon);
    container.insertAdjacentElement("afterend", fullWrapper);

    const style = document.createElement("style");
    style.textContent = `
      #partner_toggle_icon {
        font-size: 42px;
        color: #efd800;
        cursor: pointer;
        transition: transform 0.3s ease, color 0.3s ease;
        margin-bottom:40px;
      }
      #partner_toggle_icon:hover {
        color: #d6c100;
      }
      #partner_toggle_icon.rotate {
        transform: rotate(180deg);
      }
    `;
    document.head.appendChild(style);

    let expanded = false;
    fullWrapper.addEventListener("click", function() {
      expanded = !expanded;
      partners.forEach((partner, index) => {
        if (index >= 6) partner.style.display = expanded ? "block" : "none";
      });
      icon.classList.toggle("rotate", expanded);
    });
  }
});