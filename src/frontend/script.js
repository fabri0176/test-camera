const video = document.getElementById('video');
const startCameraBtn = document.getElementById('startCamera');
const captureBtn = document.getElementById('captureBtn');
const imageUpload = document.getElementById('imageUpload');
const uploadBtn = document.getElementById('uploadBtn');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const resultDiv = document.getElementById('result');

let stream = null;

startCameraBtn.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    captureBtn.disabled = false;
    startCameraBtn.disabled = true;
  } catch (err) {
    console.error("Error al acceder a la cámara: ", err);
    resultDiv.innerHTML = `<p style="color: red;">Error al acceder a la cámara: ${err.message}</p>`;
  }
});

captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const imageData = canvas.toDataURL('image/png');
  
  preview.src = imageData;
  preview.classList.remove('d-none');
  
  sendImageToServer(imageData);
});

uploadBtn.addEventListener('click', () => {
  const file = imageUpload.files[0];
  if (!file) {
    resultDiv.innerHTML = '<p style="color: red;">Por favor selecciona una imagen</p>';
    return;
  }

  uploadBtn.disabled = true;
  resultDiv.innerHTML = `
    <div class="d-flex align-items-center">
      <strong>Cargando...</strong>
      <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
    </div>
  `;

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.classList.remove('d-none');
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append('image', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    uploadBtn.disabled = false;

    if (data.error) {
      resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
      if (data.details) {
        resultDiv.innerHTML += `<p>Detalles: ${data.details}</p>`;
      }
    } else {
      displayAnalysisResults(data.analysis);
    }
  })
  .catch(error => {
    uploadBtn.disabled = false;

    console.error('Error:', error);
    resultDiv.innerHTML = `<p style="color: red;">Error al subir la imagen: ${error.message}</p>`;
  });
});

function sendImageToServer(imageData) {
  resultDiv.innerHTML = '<p>Procesando imagen...</p>';
  
  fetch('/capture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: imageData })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
      if (data.details) {
        resultDiv.innerHTML += `<p>Detalles: ${data.details}</p>`;
      }
    } else {
      displayAnalysisResults(data.analysis);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    resultDiv.innerHTML = `<p style="color: red;">Error al procesar la imagen: ${error.message}</p>`;
  });
}

function displayAnalysisResults(analysis) {
  if (analysis.error) {
    resultDiv.innerHTML = `<p style="color: red;">Error en el análisis: ${analysis.error}</p>`;
    return;
  }
  
  resultDiv.innerHTML = `
    <p><strong>Número de personas detectadas:</strong> ${analysis.personCount}</p>
    <p><strong>Descripción:</strong> ${analysis.description || 'No disponible'}</p>
  `;
}