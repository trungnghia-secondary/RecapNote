document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch("http://localhost:5000/submit_job", { method: "POST", body: formData });
  const data = await res.json();
  const jobId = data.job_id;

  const transcriptBox = document.getElementById("transcript");
  transcriptBox.innerHTML = "<i>⏳ Đang xử lý...</i>";

  const socket = io("http://localhost:5000");
  socket.on("partial_transcript", (msg) => {
    if (msg.job_id === jobId) {
      transcriptBox.innerHTML += "<br>" + msg.text;
    }
  });
  socket.on("job_done", (msg) => {
    if (msg.job_id === jobId) {
      transcriptBox.innerHTML += "<hr><b>✅ Tóm tắt:</b> " + msg.result.summary;
    }
  });
});
