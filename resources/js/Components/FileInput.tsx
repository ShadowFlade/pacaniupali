// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileImage, X } from 'lucide-react';
import { useCallback, useState } from 'react';

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
                className={`rounded-lg border-2 border-dashed transition-all duration-200 ease-in-out ${
                    dragActive
                        ? 'scale-102 border-primary bg-primary/5'
                        : 'border-muted-foreground/25'
                } ${preview ? 'p-2' : 'p-8'} `}
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
                    <div className="group relative">
                        <img
                            src={preview || '/placeholder.svg'}
                            alt="Preview"
                            className="h-48 w-full rounded-md object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 hover:text-white"
                                onClick={(e) => {
                                    setPreview(null);
                                    const input = e.target
                                        .closest('form')
                                        .querySelector(
                                            `[name="${inputName}"]`,
                                        ) as HTMLInputElement;
                                    if (input) input.value = '';
                                }}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label
                        htmlFor={inputName}
                        className="flex cursor-pointer flex-col items-center gap-2"
                    >
                        <div className="rounded-full bg-primary/10 p-3 text-primary">
                            <FileImage className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                                Нажмите чтобы загрузить или перетащите картинку
                                сюда
                            </p>
                            <p className="text-xs text-muted-foreground">
                                SVG, PNG, JPG or GIF (max. 2MB)
                            </p>
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
}
