// --- Tab switch ---
function openTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-button").forEach(el => el.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");
}

// --- Upload file ---
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

// --- Recording with MediaRecorder ---
let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startRecord");
const stopBtn = document.getElementById("stopRecord");
const transcriptDiv = document.getElementById("transcript");

startBtn.addEventListener("click", async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("❌ Trình duyệt không hỗ trợ ghi âm");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      transcriptDiv.innerText = "⏳ Processing...";

      const response = await fetch("https://your-backend-url.onrender.com/process_file", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        transcriptDiv.innerText = result.transcript || result.full_text || "✅ Done";
      } else {
        transcriptDiv.innerText = "❌ Error processing recording";
      }
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    transcriptDiv.innerText = "🎙 Đang ghi âm...";

  } catch (err) {
    console.error("Error accessing microphone:", err);
    alert("❌ Không thể truy cập micro");
  }
});

stopBtn.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
});
