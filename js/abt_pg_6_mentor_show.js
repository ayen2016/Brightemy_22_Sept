
document.addEventListener("DOMContentLoaded", function() {
  const container = document.querySelector(".team-members");
  const members = container.querySelectorAll(".team-member");

  if (members.length > 6) {
    // Hide all members after the 6th
    members.forEach((member, index) => {
      if (index >= 6) member.style.display = "none";
    });

    // Wrap in full-width container for proper centering
    const fullWrapper = document.createElement("div");
    fullWrapper.style.width = "100%";
    fullWrapper.style.display = "flex";
    fullWrapper.style.justifyContent = "center";
    fullWrapper.style.margin = "20px 0";

    const icon = document.createElement("span");
    icon.id = "mentors_toggle_icon";
    icon.innerHTML = "&#9660;"; // ▼

    fullWrapper.appendChild(icon);
    container.insertAdjacentElement("afterend", fullWrapper);

    // Add styling dynamically
    const style = document.createElement("style");
    style.textContent = `
      #mentors_toggle_icon {
        font-size: 42px;
        color: #efd800;
        cursor: pointer;
        transition: transform 0.3s ease, color 0.3s ease;
        margin-bottom: 40px;
      }
      #mentors_toggle_icon:hover {
        color: #d6c100;
      }
      #mentors_toggle_icon.rotate {
        transform: rotate(180deg);
      }
    `;
    document.head.appendChild(style);

    // Toggle functionality
    let expanded = false;
    fullWrapper.addEventListener("click", function() {
      expanded = !expanded;
      members.forEach((member, index) => {
        if (index >= 6) member.style.display = expanded ? "block" : "none";
      });
      icon.classList.toggle("rotate", expanded);
    });
  }
});

