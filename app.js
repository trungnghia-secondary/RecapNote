// Tab switching
<section class="upload-section">
  <div class="tabs">
    <button class="tab-button active" onclick="openTab('fileTab')">📂 Tải file</button>
    <button class="tab-button" onclick="openTab('recordTab')">🎤 Ghi âm</button>
  </div>

// Upload form
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

// Recording
let mediaRecorder;
let audioChunks = [];

document.getElementById("recordBtn").addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    const recordTranscript = document.getElementById("recordTranscript");
    recordTranscript.innerText = "⏳ Processing...";

    const response = await fetch("https://your-backend-url.onrender.com/process_file", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      recordTranscript.innerText = result.transcript || result.full_text || "✅ Done";
    } else {
      recordTranscript.innerText = "❌ Error processing audio";
    }
  };

  mediaRecorder.start();
  document.getElementById("recordBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;
});

document.getElementById("stopBtn").addEventListener("click", () => {
  mediaRecorder.stop();
  document.getElementById("recordBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
});
