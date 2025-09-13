const apiBase = "https://api-gateway-yourdomain.com";

// Upload file
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      // Lắng nghe transcript realtime qua SSE
      const transcriptBox = document.getElementById("transcriptBox");
      const eventSource = new EventSource(`${apiBase}/transcript/${data.job_id}`);
      eventSource.onmessage = (event) => {
        const p = document.createElement("p");
        p.textContent = event.data;
        transcriptBox.appendChild(p);
        transcriptBox.scrollTop = transcriptBox.scrollHeight;
      };
    });
  }
});
