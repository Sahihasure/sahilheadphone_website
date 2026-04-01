import os
import glob
from PIL import Image, ImageFilter, ImageEnhance

# Create directory for High-Quality frames
output_dir = "hq_frames"
os.makedirs(output_dir, exist_ok=True)

# Find all ezgif frames
frames = glob.glob("ezgif-frame-*.jpg")
frames.sort()

print(f"Enhancing {len(frames)} frames to maximum capacity (4x AI-style Upscale)...")

for frame_path in frames:
    filename = os.path.basename(frame_path)
    try:
        with Image.open(frame_path) as img:
            # 1. Upscale by 3x using high-quality Lanczos resampling
            new_size = (img.width * 3, img.height * 3)
            img_hq = img.resize(new_size, resample=Image.Resampling.LANCZOS)
            
            # 2. Sharpen heavily to remove blur from upscaling (Unsharp Mask)
            img_hq = img_hq.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
            
            # 3. Enhance Contrast perfectly for the dark theme
            enhancer = ImageEnhance.Contrast(img_hq)
            img_hq = enhancer.enhance(1.2)
            
            # Save the hyper-detailed frame
            output_path = os.path.join(output_dir, filename)
            img_hq.save(output_path, quality=95)
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Successfully enhanced all frames!")
