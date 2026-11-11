/**
 * Browser-compatible image compressor utility.
 * Resizes and compresses images using HTML5 Canvas to prevent LocalStorage quota overflow.
 */
export const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    // If not running in browser, return fallback string representation
    if (typeof window === 'undefined' || typeof FileReader === 'undefined') {
      return resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    }

    if (!file || !(file instanceof Blob || file instanceof File)) {
      if (typeof file === 'string' && file.startsWith('data:image')) {
        return resolve(file); // Already base64
      }
      return reject(new Error('Invalid image file provided.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Process array of image files or data URLs into compressed base64 array.
 */
export const compressImagesList = async (filesOrDataUrls, maxCount = 5) => {
  const selected = Array.from(filesOrDataUrls).slice(0, maxCount);
  const compressed = [];

  for (const item of selected) {
    try {
      if (typeof item === 'string' && item.startsWith('data:image')) {
        compressed.push(item);
      } else {
        const res = await compressImage(item);
        compressed.push(res);
      }
    } catch (e) {
      console.warn('Image compression warning:', e.message);
    }
  }

  return compressed;
};
