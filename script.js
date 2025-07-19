class ImageEditor {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.fileInput = document.getElementById("fileInput");
    this.uploadBtn = document.getElementById("uploadBtn");
    this.downloadBtn = document.getElementById("downloadBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.cropBtn = document.getElementById("cropBtn");

    // Control elements
    this.filterControls = document.getElementById("filterControls");
    this.cropControls = document.getElementById("cropControls");
    this.imageInfo = document.getElementById("imageInfo");
    this.filterValue = document.getElementById("filterValue");
    this.valueDisplay = document.getElementById("valueDisplay");
    this.applyFilter = document.getElementById("applyFilter");
    this.cancelFilter = document.getElementById("cancelFilter");
    this.applyCrop = document.getElementById("applyCrop");
    this.cancelCrop = document.getElementById("cancelCrop");

    // Image info elements
    this.imageSize = document.getElementById("imageSize");
    this.imageDimensions = document.getElementById("imageDimensions");
    this.imageFormat = document.getElementById("imageFormat");

    // Canvas overlay
    this.canvasOverlay = document.getElementById("canvasOverlay");
    this.uploadPrompt = document.getElementById("uploadPrompt");

    // State variables
    this.originalImage = null;
    this.currentImage = null;
    this.currentFilter = null;
    this.isCropping = false;
    this.cropStart = null;
    this.cropEnd = null;
    this.rotation = 0;
    this.flipH = false;
    this.flipV = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupCanvas();
  }

  bindEvents() {
    // File upload events
    this.uploadBtn.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.handleFileUpload(e));
    this.uploadPrompt.addEventListener("click", () => this.fileInput.click());

    // Download and reset
    this.downloadBtn.addEventListener("click", () => this.downloadImage());
    this.resetBtn.addEventListener("click", () => this.resetImage());

    // Filter buttons
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.showFilterControls(e.target.dataset.filter)
      );
    });

    // Adjustment buttons
    document.querySelectorAll("[data-adjustment]").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.applyAdjustment(e.target.dataset.adjustment)
      );
    });

    // Crop functionality
    this.cropBtn.addEventListener("click", () => this.startCrop());
    this.applyCrop.addEventListener("click", () => this.executeCrop());
    this.cancelCrop.addEventListener("click", () => this.cancelCropMode());

    // Filter controls
    this.filterValue.addEventListener("input", (e) => {
      this.valueDisplay.textContent = e.target.value;
      this.previewFilter();
    });

    this.applyFilter.addEventListener("click", () => this.executeFilter());
    this.cancelFilter.addEventListener("click", () => this.cancelFilterMode());

    // Canvas events for cropping
    this.canvas.addEventListener("mousedown", (e) => this.handleCropStart(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleCropMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.handleCropEnd(e));

    // Touch events for mobile
    this.canvas.addEventListener("touchstart", (e) => this.handleCropStart(e));
    this.canvas.addEventListener("touchmove", (e) => this.handleCropMove(e));
    this.canvas.addEventListener("touchend", (e) => this.handleCropEnd(e));

    // Drag and drop
    this.canvasOverlay.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.canvasOverlay.style.borderColor = "#6366F1";
      this.canvasOverlay.style.backgroundColor = "rgba(99, 102, 241, 0.1)";
    });

    this.canvasOverlay.addEventListener("dragleave", (e) => {
      e.preventDefault();
      this.canvasOverlay.style.borderColor = "#6366F1";
      this.canvasOverlay.style.backgroundColor = "rgba(99, 102, 241, 0.05)";
    });

    this.canvasOverlay.addEventListener("drop", (e) => {
      e.preventDefault();
      this.canvasOverlay.style.borderColor = "#6366F1";
      this.canvasOverlay.style.backgroundColor = "rgba(99, 102, 241, 0.05)";

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        this.loadImage(files[0]);
      }
    });
  }

  setupCanvas() {
    // Set initial canvas size
    this.canvas.width = 800;
    this.canvas.height = 600;

    // Clear canvas
    this.ctx.fillStyle = "#f8fafc";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      this.loadImage(file);
    }
  }

  loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.originalImage = img;
        this.currentImage = img;
        this.displayImage();
        this.updateImageInfo(file);
        this.hideUploadPrompt();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  displayImage() {
    if (!this.currentImage) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate dimensions to fit canvas
    const canvasAspect = this.canvas.width / this.canvas.height;
    const imageAspect = this.currentImage.width / this.currentImage.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imageAspect > canvasAspect) {
      // Image is wider than canvas
      drawWidth = this.canvas.width;
      drawHeight = this.canvas.width / imageAspect;
      offsetX = 0;
      offsetY = (this.canvas.height - drawHeight) / 2;
    } else {
      // Image is taller than canvas
      drawHeight = this.canvas.height;
      drawWidth = this.canvas.height * imageAspect;
      offsetX = (this.canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    // Apply transformations
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate((this.rotation * Math.PI) / 180);
    this.ctx.scale(this.flipH ? -1 : 1, this.flipV ? -1 : 1);
    this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);

    // Draw image
    this.ctx.drawImage(
      this.currentImage,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );

    this.ctx.restore();

    // Apply current filter if any
    if (this.currentFilter) {
      this.applyFilterToCanvas();
    }
  }

  updateImageInfo(file) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    this.imageSize.textContent = `${sizeInMB} MB`;
    this.imageDimensions.textContent = `${this.originalImage.width} × ${this.originalImage.height}`;
    this.imageFormat.textContent = file.type.split("/")[1].toUpperCase();
    this.imageInfo.style.display = "block";
  }

  hideUploadPrompt() {
    this.canvasOverlay.style.display = "none";
  }

  showFilterControls(filterType) {
    this.currentFilter = filterType;
    this.filterControls.style.display = "block";
    this.cropControls.style.display = "none";

    // Set appropriate range for filter
    const ranges = {
      brightness: { min: 0, max: 200, default: 100 },
      contrast: { min: 0, max: 200, default: 100 },
      saturation: { min: 0, max: 200, default: 100 },
      blur: { min: 0, max: 20, default: 0 },
      grayscale: { min: 0, max: 100, default: 0 },
      sepia: { min: 0, max: 100, default: 0 },
      invert: { min: 0, max: 100, default: 0 },
    };

    const range = ranges[filterType];
    this.filterValue.min = range.min;
    this.filterValue.max = range.max;
    this.filterValue.value = range.default;
    this.valueDisplay.textContent = range.default;

    this.previewFilter();
  }

  previewFilter() {
    if (!this.currentImage || !this.currentFilter) return;

    this.displayImage();
    this.applyFilterToCanvas();
  }

  applyFilterToCanvas() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const data = imageData.data;
    const value = parseInt(this.filterValue.value);

    switch (this.currentFilter) {
      case "brightness":
        this.applyBrightness(data, value);
        break;
      case "contrast":
        this.applyContrast(data, value);
        break;
      case "saturation":
        this.applySaturation(data, value);
        break;
      case "blur":
        this.applyBlur(imageData, value);
        break;
      case "grayscale":
        this.applyGrayscale(data, value);
        break;
      case "sepia":
        this.applySepia(data, value);
        break;
      case "invert":
        this.applyInvert(data, value);
        break;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  applyBrightness(data, value) {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * factor); // Red
      data[i + 1] = Math.min(255, data[i + 1] * factor); // Green
      data[i + 2] = Math.min(255, data[i + 2] * factor); // Blue
    }
  }

  applyContrast(data, value) {
    const factor = (value + 100) / 100;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128));
      data[i + 1] = Math.min(
        255,
        Math.max(0, (data[i + 1] - 128) * factor + 128)
      );
      data[i + 2] = Math.min(
        255,
        Math.max(0, (data[i + 2] - 128) * factor + 128)
      );
    }
  }

  applySaturation(data, value) {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = Math.min(255, Math.max(0, gray + factor * (data[i] - gray)));
      data[i + 1] = Math.min(
        255,
        Math.max(0, gray + factor * (data[i + 1] - gray))
      );
      data[i + 2] = Math.min(
        255,
        Math.max(0, gray + factor * (data[i + 2] - gray))
      );
    }
  }

  applyBlur(imageData, value) {
    // Simple box blur
    const radius = Math.floor(value);
    if (radius <= 0) return;

    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const newData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0,
          count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const idx = (ny * width + nx) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              a += data[idx + 3];
              count++;
            }
          }
        }

        const idx = (y * width + x) * 4;
        newData[idx] = r / count;
        newData[idx + 1] = g / count;
        newData[idx + 2] = b / count;
        newData[idx + 3] = a / count;
      }
    }

    imageData.data.set(newData);
  }

  applyGrayscale(data, value) {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i] * (1 - factor) + gray * factor;
      data[i + 1] = data[i + 1] * (1 - factor) + gray * factor;
      data[i + 2] = data[i + 2] * (1 - factor) + gray * factor;
    }
  }

  applySepia(data, value) {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;

      data[i] = r * (1 - factor) + Math.min(255, tr) * factor;
      data[i + 1] = g * (1 - factor) + Math.min(255, tg) * factor;
      data[i + 2] = b * (1 - factor) + Math.min(255, tb) * factor;
    }
  }

  applyInvert(data, value) {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * (1 - factor) + (255 - data[i]) * factor;
      data[i + 1] = data[i + 1] * (1 - factor) + (255 - data[i + 1]) * factor;
      data[i + 2] = data[i + 2] * (1 - factor) + (255 - data[i + 2]) * factor;
    }
  }

  executeFilter() {
    this.filterControls.style.display = "none";
    this.currentFilter = null;
  }

  cancelFilterMode() {
    this.filterControls.style.display = "none";
    this.currentFilter = null;
    this.displayImage();
  }

  applyAdjustment(type) {
    switch (type) {
      case "rotate-left":
        this.rotation -= 90;
        break;
      case "rotate-right":
        this.rotation += 90;
        break;
      case "flip-horizontal":
        this.flipH = !this.flipH;
        break;
      case "flip-vertical":
        this.flipV = !this.flipV;
        break;
    }

    this.displayImage();
  }

  startCrop() {
    this.isCropping = true;
    this.cropControls.style.display = "block";
    this.filterControls.style.display = "none";
    this.canvas.style.cursor = "crosshair";
  }

  handleCropStart(e) {
    if (!this.isCropping) return;

    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    this.cropStart = { x, y };
    this.cropEnd = { x, y };
  }

  handleCropMove(e) {
    if (!this.isCropping || !this.cropStart) return;

    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    this.cropEnd = { x, y };
    this.drawCropOverlay();
  }

  handleCropEnd(e) {
    if (!this.isCropping) return;

    e.preventDefault();
    // Crop area is already set in handleCropMove
  }

  drawCropOverlay() {
    if (!this.cropStart || !this.cropEnd) return;

    this.displayImage();

    const x = Math.min(this.cropStart.x, this.cropEnd.x);
    const y = Math.min(this.cropStart.y, this.cropEnd.y);
    const width = Math.abs(this.cropEnd.x - this.cropStart.x);
    const height = Math.abs(this.cropEnd.y - this.cropStart.y);

    // Draw semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Clear crop area
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillRect(x, y, width, height);
    this.ctx.globalCompositeOperation = "source-over";

    // Draw crop border
    this.ctx.strokeStyle = "#6366F1";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);
  }

  executeCrop() {
    if (!this.cropStart || !this.cropEnd) return;

    const x = Math.min(this.cropStart.x, this.cropEnd.x);
    const y = Math.min(this.cropStart.y, this.cropEnd.y);
    const width = Math.abs(this.cropEnd.x - this.cropStart.x);
    const height = Math.abs(this.cropEnd.y - this.cropStart.y);

    // Create new canvas for cropped image
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    croppedCanvas.width = width;
    croppedCanvas.height = height;

    // Draw cropped portion
    croppedCtx.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);

    // Create new image from cropped canvas
    const croppedImage = new Image();
    croppedImage.onload = () => {
      this.currentImage = croppedImage;
      this.displayImage();
      this.cancelCropMode();
    };
    croppedImage.src = croppedCanvas.toDataURL();
  }

  cancelCropMode() {
    this.isCropping = false;
    this.cropControls.style.display = "none";
    this.cropStart = null;
    this.cropEnd = null;
    this.canvas.style.cursor = "default";
    this.displayImage();
  }

  resetImage() {
    if (this.originalImage) {
      this.currentImage = this.originalImage;
      this.rotation = 0;
      this.flipH = false;
      this.flipV = false;
      this.currentFilter = null;
      this.filterControls.style.display = "none";
      this.cropControls.style.display = "none";
      this.displayImage();
    }
  }

  downloadImage() {
    if (!this.currentImage) return;

    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = this.canvas.toDataURL();
    link.click();
  }
}

// Initialize the image editor when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ImageEditor();
});
