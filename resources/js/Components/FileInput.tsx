import React, { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileImage, X } from 'lucide-react';

export default function FileInput({ label, inputName, setData }) {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const handleFile = useCallback((file: File | undefined) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    return (
        <div className="space-y-2">
            <Label htmlFor={inputName}>{label}</Label>
            <div
                className={`
                    border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out
                    ${dragActive
                    ? 'border-primary bg-primary/5 scale-102'
                    : 'border-muted-foreground/25'}
                    ${preview ? 'p-2' : 'p-8'}
                `}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    handleFile(file);
                }}
            >
                <input
                    id={inputName}
                    name={inputName}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        handleFile(e.target.files?.[0]);
                        setData(inputName, e.target.files?.[0]);
                    }}
                />
                {preview ? (
                    <div className="relative group">
                        <img
                            src={preview || '/placeholder.svg'}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-md"
                        />
                        <div
                            className="absolute inset-0 bg-black/40 opacity-0
                            group-hover:opacity-100 transition-opacity
                            rounded-md flex items-center justify-center"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-white hover:text-white hover:bg-white/20"
                                onClick={(e) => {
                                    setPreview(null);
                                    const input = e.target.closest('form')
                                        .querySelector(`[name="${inputName}"]`) as HTMLInputElement;
                                    if (input) input.value = '';
                                }}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label htmlFor={inputName}
                           className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            <FileImage className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                                Нажмите чтобы загрузить или перетащите картинку сюда
                            </p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG
                                or GIF (max. 2MB)</p>
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
}
