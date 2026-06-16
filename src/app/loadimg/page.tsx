"use client"

import { postImg } from "@/services/img";
import { useState, useRef } from "react";

const LoadImg = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null
        setFile(selected)
        setPreview(selected ? URL.createObjectURL(selected) : null)
    }

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("se llamo el form", { title, description })
        console.log("el archivo",file)

        try{
                const resp = await postImg(title, description, file)
                console.log(resp)

        } catch (err){
            console.error(err)
        }

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-1">Carga de imágenes</h1>
                <p className="text-slate-400 text-sm mb-8">Sube tu imagen a Cloudinary</p>

                <form onSubmit={submitForm} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-300 text-sm font-medium">Título</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Escribe un título..."
                            className="bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-300 text-sm font-medium">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe la imagen..."
                            rows={3}
                            className="bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-300 text-sm font-medium">Imagen</label>
                        <div
                            onClick={() => inputRef.current?.click()}
                            className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition group"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="max-h-48 rounded-lg object-contain"
                                />
                            ) : (
                                <>
                                    <svg className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 mb-3 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <p className="text-slate-400 text-sm group-hover:text-slate-300 transition">
                                        Haz clic para seleccionar
                                    </p>
                                    <p className="text-slate-600 text-xs mt-1">PNG, JPG, WEBP hasta 10MB</p>
                                </>
                            )}
                        </div>
                        {file && (
                            <p className="text-slate-400 text-xs mt-1 truncate">
                                {file.name} — {(file.size / 1024).toFixed(1)} KB
                            </p>
                        )}
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>



                    <button
                        type="submit"
                        className="mt-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
                    >
                        Subir imagen
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoadImg;
