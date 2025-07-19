# Image Editor Pro

[![GitHub stars](https://img.shields.io/github/stars/fadelrazh/image-editor?style=social)](https://github.com/fadelrazh/image-editor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/fadelrazh/image-editor?style=social)](https://github.com/fadelrazh/image-editor/network/members)
[![GitHub issues](https://img.shields.io/github/issues/fadelrazh/image-editor)](https://github.com/fadelrazh/image-editor/issues)
[![GitHub license](https://img.shields.io/github/license/fadelrazh/image-editor)](https://github.com/fadelrazh/image-editor/blob/master/LICENSE)
[![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Made with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Made with JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub last commit](https://img.shields.io/github/last-commit/fadelrazh/image-editor)](https://github.com/fadelrazh/image-editor/commits/master)
[![GitHub repo size](https://img.shields.io/github/repo-size/fadelrazh/image-editor)](https://github.com/fadelrazh/image-editor)

A professional image editing web application built with HTML, CSS, and JavaScript. Edit your images directly in the browser with powerful tools and filters.

## 🎨 Features

### File Operations

- **Upload Images**: Drag and drop or click to upload images
- **Download**: Save edited images in PNG format
- **Reset**: Restore original image at any time

### Image Filters

- **Brightness**: Adjust image brightness (0-200%)
- **Contrast**: Enhance or reduce contrast (0-200%)
- **Saturation**: Control color intensity (0-200%)
- **Blur**: Apply blur effect (0-20px radius)
- **Grayscale**: Convert to black and white (0-100%)
- **Sepia**: Apply vintage sepia effect (0-100%)
- **Invert**: Invert image colors (0-100%)

### Image Adjustments

- **Rotate Left**: Rotate image 90° counterclockwise
- **Rotate Right**: Rotate image 90° clockwise
- **Flip Horizontal**: Mirror image horizontally
- **Flip Vertical**: Mirror image vertically

### Advanced Tools

- **Crop Tool**: Select and crop specific areas of the image
- **Real-time Preview**: See filter effects instantly
- **Image Information**: Display file size, dimensions, and format

## 🚀 Getting Started

### Prerequisites

- Modern web browser with HTML5 Canvas support
- No additional dependencies required

### Installation

1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start editing images!

### Usage

#### Uploading Images

1. Click the "Upload Image" button or drag an image onto the canvas
2. Supported formats: JPG, PNG, GIF, WebP, etc.

#### Applying Filters

1. Click any filter button in the "Filters" section
2. Adjust the slider to control the filter intensity
3. Click "Apply" to confirm or "Cancel" to discard changes

#### Making Adjustments

1. Use the adjustment buttons to rotate or flip the image
2. Changes are applied immediately

#### Cropping Images

1. Click the "Crop" button
2. Drag on the canvas to select the crop area
3. Click "Apply Crop" to confirm or "Cancel" to discard

#### Downloading

1. Click the "Download" button to save your edited image
2. Images are saved in PNG format

## 🎯 Color Scheme

The application uses a consistent color scheme:

- **Primary**: #6366F1 (Indigo)
- **Secondary**: #E0E7FF (Indigo-100)
- **Accent**: #14B8A6 (Teal) / #F59E0B (Amber)
- **Background**: Gradient from #E0E7FF to #f8fafc

## 📱 Responsive Design

The image editor is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic markup and canvas element
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript ES6+**: Class-based architecture
- **Canvas API**: Image manipulation and drawing
- **File API**: File upload and processing

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features

- Efficient canvas rendering
- Optimized image processing algorithms
- Memory management for large images
- Touch-friendly interface

## 📁 Project Structure

```
image-editor/
├── index.html          # Main HTML file
├── style.css           # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🔧 Customization

### Adding New Filters

To add a new filter:

1. Add the filter button to the HTML:

```html
<button class="tool-btn" data-filter="your-filter">
  <i class="fas fa-icon"></i>
  Your Filter
</button>
```

2. Add the filter logic to the JavaScript:

```javascript
case 'your-filter':
    this.applyYourFilter(data, value);
    break;
```

3. Implement the filter method:

```javascript
applyYourFilter(data, value) {
    // Your filter logic here
}
```

### Modifying Colors

Update the CSS custom properties in `style.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #e0e7ff;
  --accent-color: #14b8a6;
}
```

## 🐛 Troubleshooting

### Common Issues

**Image not loading**

- Check file format compatibility
- Ensure file size is reasonable (< 10MB recommended)
- Try refreshing the page

**Filters not working**

- Make sure JavaScript is enabled
- Check browser console for errors
- Try a different browser

**Download not working**

- Check browser download settings
- Ensure popup blockers are disabled
- Try right-clicking the download button

## 📄 License

This project is created for educational purposes. Feel free to use and modify as needed.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

If you encounter any issues or have questions, please open an issue in the project repository.

---

**Made with ❤️ for learning purposes**
