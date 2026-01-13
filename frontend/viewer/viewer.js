const API = "https://stories-memories.onrender.com";
const container = document.getElementById("stories");

function loadStories() {
  fetch(`${API}/stories`)
    .then(res => res.json())
    .then(stories => {
      container.innerHTML = "";

      stories.forEach(story => {
        const div = document.createElement("div");
        div.className = "story";

        div.innerHTML = `
          <h2>${story.title}</h2>
          <div class="author">by ${story.author}</div>
          <p>${story.content}</p>
          <button class="like-btn">❤️ Like (${story.likes})</button>
        `;

        div.querySelector(".like-btn").onclick = () => likeStory(story._id);
        container.appendChild(div);
      });
    });
}

function likeStory(id) {
  fetch(`${API}/like/${id}`, { method: "POST" })
    .then(() => loadStories());
}

loadStories();
