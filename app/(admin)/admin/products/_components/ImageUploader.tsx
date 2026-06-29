"use client"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { X, ImagePlus, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { promises } from "dns"

interface Image {
  url: string;
  publicId: string
}

interface Props {
  images: Image[];
  onChange: (images: Image[]) => void
}

export default function ImageUploader({ images, onChange }: Props) {

  const [uploading, setUploading] = useState(false)

  const uploadToCloudinary = async (file: File): Promise<Image> => {
    const formData = new FormData();
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    formData.append("folder", "feelgood/products")

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData

      }
    )

    const data = await res.json()
    return {
      url: data.secure_url,
      publicId: data.public_id
    }

  }


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 6) {
      toast.error("only max 6 images allowed ")
      return;
    }
    try {
      setUploading(true)
      const uploaded = await Promise.all(acceptedFiles.map(uploadToCloudinary));
      onChange([...images, ...uploaded])

    } catch (error) {
      toast.error("Image upload failed");

    } finally {
      setUploading(false)
    }

  }, [images, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    disabled: uploading
  })

  const removeImage =  (publicId: string) => {

    onChange(images.filter((img) => img.publicId !== publicId))

  }

  
  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="w-6 h-6" />
            <p className="text-sm">Drop images here or click to browse</p>
            <p className="text-xs">PNG, JPG, WEBP up to 5MB · Max 6 images</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={img.publicId} className="relative group aspect-square rounded-md overflow-hidden border">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
              <button
                onClick={() => removeImage(img.publicId)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5
                  opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}