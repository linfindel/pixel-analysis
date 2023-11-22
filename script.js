function uploadFile() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
        let file = input.files[0]; // Get the first selected file
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let fileURL = e.target.result;
                document.getElementById("img").onload = processImage; // Trigger processImage after the image loads
                document.getElementById("img").src = fileURL;
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };
    input.click();
}

function openLink() {
    document.getElementById("export").style.display = "flex";

    var imageURL = prompt("URL:");
    if (imageURL) {
        document.getElementById("img").onload = processImage; // Trigger processImage after the image loads
        document.getElementById("img").src = imageURL;
    }
}

function processImage() {
    // Get the image element
    const imgElement = document.getElementById('img');
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set the canvas dimensions to match the image
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    // Draw the image onto the canvas
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Get the pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Store pixel colors for analysis
    const pixelColors = [];
    
    // Loop through pixel data
    for (let i = 0; i < pixels.length; i += 4) {
        // Extract RGB values from pixel data
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];

        // Store the color as a string representation of RGB values
        const color = `rgb(${red}, ${green}, ${blue})`;
        pixelColors.push(color);
    }

    // Perform statistical analysis on 'pixelColors' to find mean, mode, median, least common color, etc.
    const colorCounts = {}; // Object to count occurrences of each color
    let sumRed = 0,
        sumGreen = 0,
        sumBlue = 0;

    for (let i = 0; i < pixelColors.length; i++) {
        const color = pixelColors[i];
        // Count occurrences of each color
        colorCounts[color] = (colorCounts[color] || 0) + 1;

        // Extract RGB values for mean calculation
        const [red, green, blue] = color.match(/\d+/g).map(Number);
        sumRed += red;
        sumGreen += green;
        sumBlue += blue;
    }

    const totalCount = pixelColors.length;
    const meanRed = Math.round(sumRed / totalCount);
    const meanGreen = Math.round(sumGreen / totalCount);
    const meanBlue = Math.round(sumBlue / totalCount);
    const meanColor = `rgb(${meanRed}, ${meanGreen}, ${meanBlue})`;

    // Calculate mode color
    let maxCount = 0;
    let modeColor = '';
    for (const color in colorCounts) {
        if (colorCounts[color] > maxCount) {
            maxCount = colorCounts[color];
            modeColor = color;
        }
    }

    // Calculate median color
    pixelColors.sort();
    const medianColorIndex = Math.floor(totalCount / 2);
    const medianColor = pixelColors[medianColorIndex];

    // Find least common color
    let leastCommonCount = totalCount;
    let leastCommonColor = '';
    for (const color in colorCounts) {
        if (colorCounts[color] < leastCommonCount) {
            leastCommonCount = colorCounts[color];
            leastCommonColor = color;
        }
    }

    // Display the statistical color properties on the webpage (You can modify this part as needed)
    document.getElementById('mean').innerText = meanColor;
    document.getElementById('mode').innerText = modeColor;
    document.getElementById('median').innerText = medianColor;
    document.getElementById('least-common').innerText = leastCommonColor;

    document.getElementById('mean').style.backgroundColor = meanColor;
    document.getElementById('mode').style.backgroundColor = modeColor;
    document.getElementById('median').style.backgroundColor = medianColor;
    document.getElementById('least-common').style.backgroundColor = leastCommonColor;

    if (calculateContrastRatio(meanColor) < 4.5) {
        document.getElementById("mean").style.color = "black";
    }

    else {
            document.getElementById("mean").style.color = "white";
    }



    if (calculateContrastRatio(modeColor) < 4.5) {
        document.getElementById("mode").style.color = "black";
    }

    else {
            document.getElementById("mode").style.color = "white";
    }



    if (calculateContrastRatio(medianColor) < 4.5) {
        document.getElementById("median").style.color = "black";
    }

    else {
            document.getElementById("median").style.color = "white";
    }



    if (calculateContrastRatio(leastCommonColor) < 4.5) {
        document.getElementById("least-common").style.color = "black";
    }

    else {
            document.getElementById("least-common").style.color = "white";
    }
}

function getRelativeLuminance(rgb) {
    // Extract RGB values from the string representation of an RGB color
    const [r, g, b] = rgb.match(/\d+/g).map(Number);

    // Calculate relative luminance
    const sRGB = [r, g, b].map(c => c / 255).map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function calculateContrastRatio(background) {
    var foreground = "#ffffff";

    if (foreground && background) {
        // Calculate contrast ratio
        const fgRgb = "rgb(255, 255, 255)";
        const bgRgb = background;
    
        const fgLuminance = getRelativeLuminance(fgRgb);
        const bgLuminance = getRelativeLuminance(bgRgb);
    
        var contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

        return contrastRatio;
    }
}