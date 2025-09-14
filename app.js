// Tab switching
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Upload
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) return;

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  const transcriptDiv = document.getElementById("transcript");
  transcriptDiv.innerText = "⏳ Đang xử lý...";

  try {
    const response = await fetch("https://api-gateway-ovql.onrender.com/submit", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      transcriptDiv.innerText = result.transcript || "✅ Hoàn tất";
    } else {
      transcriptDiv.innerText = "❌ Lỗi khi xử lý file";
    }
  } catch (err) {
    transcriptDiv.innerText = "⚠️ Không thể kết nối server";
  }
});

// Recording
let mediaRecorder, audioChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const audioPlayback = document.getElementById("audioPlayback");

startBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioPlayback.src = audioUrl;
    audioPlayback.style.display = "block";

    // Gửi backend
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    document.getElementById("transcript").innerText = "⏳ Đang xử lý ghi âm...";

    try {
      const response = await fetch("https://api-gateway-ovql.onrender.com/submit", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        document.getElementById("transcript").innerText = result.transcript || "✅ Hoàn tất";
      } else {
        document.getElementById("transcript").innerText = "❌ Lỗi khi xử lý ghi âm";
      }
    } catch (err) {
      document.getElementById("transcript").innerText = "⚠️ Không thể kết nối server";
    }
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});
