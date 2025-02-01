let streamStarted = false;

// Start Camera when needed
function startCamera() {
    if (streamStarted) return;

    const video = document.getElementById("video");

    if (!video) {
        console.error("Video element not found!");
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.classList.remove("hidden");
            streamStarted = true;
        })
        .catch(err => console.error("Error accessing camera", err));
}
function capturePhoto() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const photo = document.getElementById("photo");

    if (!video.srcObject) {
        alert("Camera is not started!");
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Set image source
    photo.src = canvas.toDataURL("image/png");
    photo.classList.remove("hidden");
}

function generateID() {
    const name = document.getElementById("name");
    const age = document.getElementById("age");
    const address = document.getElementById("address");
    const bloodGroup = document.getElementById("bloodGroup");
    const photo = document.getElementById("photo");
    const video = document.getElementById("video");

    if (!name.value || !age.value || !address.value || !bloodGroup.value || !photo.src) {
        alert("Please fill all fields and capture a photo.");
        return;
    }

    const idCanvas = document.getElementById("idCanvas");
    const idCtx = idCanvas.getContext("2d");
    idCanvas.width = 350;
    idCanvas.height = 600;

    // Load ID Card Background
    const bg = new Image();
    bg.src = "idCade.jpeg";  // Use a background image (640x960)
    bg.onload = function () {
        idCtx.drawImage(bg, 0, 0, idCanvas.width, idCanvas.height);

        // Add User Image (Centered)
        const userImg = new Image();
        userImg.src = photo.src;
        userImg.onload = function () {
            const imgSize = 150;
            const borderWidth = 2;
            const borderColor = 'white';
            const x = (idCanvas.width - imgSize) / 2;
            const y = 100;
            
            // Draw the white border
            idCtx.beginPath();
            idCtx.rect(x - borderWidth, y - borderWidth, imgSize + 2 * borderWidth, imgSize + 2 * borderWidth);
            idCtx.lineWidth = borderWidth;
            idCtx.strokeStyle = borderColor;
            idCtx.stroke();
            idCtx.closePath();
            
            // Draw the image inside the border
            idCtx.drawImage(userImg, x, y, imgSize, imgSize);

            // Add White Text (Centered)
            idCtx.font = "bold 20px Arial";
            idCtx.fillStyle = "white";
            idCtx.textAlign = "left";

            let textX = 50;
            let textY = 320; // Below the photo
            idCtx.fillText(`Name: ${name.value}`, textX, textY );
            idCtx.fillText(`Age: ${age.value}`, textX, textY + 40);
            idCtx.fillText(`Address: ${address.value}`, textX, textY + 80);
            idCtx.fillText(`Blood Group: ${bloodGroup.value}`, textX, textY + 120);

            // Clear input fields after generating the ID card
            name.value = "";
            age.value = "";
            address.value = "";
            bloodGroup.value = "";
            photo.src = "";
            photo.classList.add("hidden");

            // Stop the camera stream
            if (video.srcObject) {
                let tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                video.srcObject = null;
                video.classList.add("hidden");
                streamStarted = false;
            }
        };
    };
}
//Download ID Card
function downloadID() {
    const idCanvas = document.getElementById("idCanvas");
    const link = document.createElement("a");
    link.download = "ID_Card.png";
    link.href = idCanvas.toDataURL("image/png");
    link.click();
} 