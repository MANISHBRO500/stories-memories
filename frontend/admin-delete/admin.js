const API = "https://stories-memories.onrender.com";
const ADMIN_PASSWORD = "2026";

function login() {
  const pass = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (pass === ADMIN_PASSWORD) {
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
    loadStories();
  } else {
    error.textContent = "❌ Wrong password";
  }
}

function loadStories() {
  fetch(`${API}/stories`)
    .then(res => res.json())
    .then(stories => {
      const container = document.getElementById("stories");
      container.innerHTML = "";

      stories.forEach(story => {
        const div = document.createElement("div");
        div.className = "story";
        div.innerHTML = `
          <b>${story.title}</b> (${story.likes} ❤️)
          <br><br>
          <button class="delete">Delete</button>
        `;
        div.querySelector(".delete").onclick = () => deleteStory(story._id);
        container.appendChild(div);
      });
    });
}

function deleteStory(id) {
  if (!confirm("Are you sure you want to delete this story?")) return;

  fetch(`${API}/delete/${id}`, { method: "DELETE" })
    .then(() => loadStories());
}

