"use client";

import { AppContext } from '@/contexts/AppProvider';
import clsx from "clsx";
import { Upload, X } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import { Button } from "./button";
import Image from 'next/image';

type ImageUploadProps = {
    file: File | null;
    onFileChange: (file: File | null) => void;
    maxSize?: number;
    accept?: string[];
    className?: string;
};

export function ImageUpload({
    file,
    onFileChange,
    maxSize = 1_000_000, // 1MB default
    accept = ["image/png", "image/jpeg", "image/jpg"],
    className,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const { showError } = useContext(AppContext) ?? { showError: () => { } };

    React.useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }, [file]);

    const validateFile = (file: File) => {
        if (!accept.includes(file.type)) {
            showError(`Format non supporté: ${file.type}`);
            return false;
        }
        if (file.size > maxSize) {
            showError(`Fichier trop volumineux. Max: ${maxSize} bytes.`);
            return false;
        }
        return true;
    };

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const selected = files[0] ?? null;
        if (selected && validateFile(selected)) {
            onFileChange(selected);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else {
            setDragActive(false);
        }
    };

    const openFileDialog = () => inputRef.current?.click();

    return (
        <div className={clsx("space-y-2", className)}>
            <input
                ref={inputRef}
                type="file"
                accept={accept.join(",")}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
                multiple={false}
            />
            <div
                onClick={openFileDialog}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={clsx(
                    "border-2 border-dashed rounded-full cursor-pointer flex flex-col items-center justify-center",
                    dragActive ? "border-primary bg-primary/10" : "border-gray-300",
                    "w-48 h-48 relative overflow-hidden"
                )}
            >
                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Preview"
                            className="object-cover w-full h-full rounded-full"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileChange(null);
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </>
                ) : (
                    <>
                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                            Glissez et déposez une image ici, ou cliquez pour sélectionner
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
