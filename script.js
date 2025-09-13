document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) return;

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  const transcriptDiv = document.getElementById("transcript");
  transcriptDiv.innerText = "⏳ Processing...";

  const response = await fetch("https://your-backend-url.onrender.com/process_file", {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    const result = await response.json();
    transcriptDiv.innerText = result.transcript || result.full_text || "✅ Done";
  } else {
    transcriptDiv.innerText = "❌ Error processing file";
  }
});
