'use client'
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
    XIcon, UserIcon, MailIcon, PhoneIcon, 
    FileTextIcon, MapPinIcon, PaperclipIcon, 
    SendIcon, CheckCircle2Icon, UploadCloudIcon 
} from "lucide-react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        subject: "",
        message: "",
        location: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            // Prevent scrolling on the background
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const validateForm = () => {
        const tempErrors: { [key: string]: string } = {};
        if (!formData.fullName.trim()) tempErrors.fullName = "Full name is required";
        if (!formData.email.trim()) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Please enter a valid email address";
        }
        if (!formData.message.trim()) tempErrors.message = "Message is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);

        // Reset form after a delay and close modal
        setTimeout(() => {
            setIsSuccess(false);
            setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                subject: "",
                message: "",
                location: "",
            });
            setFile(null);
            onClose();
        }, 3000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div 
                        className="relative w-full max-w-2xl bg-slate-950/95 border border-pink-950 p-6 md:p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] z-10"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Glow effect matching index.css styles */}
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Close Button */}
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all duration-200"
                        >
                            <XIcon size={18} />
                        </button>

                        <div>
                            <AnimatePresence mode="wait">
                                {!isSuccess ? (
                                    <motion.div
                                        key="form-container"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">Get in Touch</h2>
                                            <p className="text-slate-400 text-sm mt-1">Have any questions? Fill out the details below and we will get back to you shortly.</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Full Name */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                                                        Full Name <span className="text-pink-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                                        <input 
                                                            type="text" 
                                                            name="fullName"
                                                            value={formData.fullName}
                                                            onChange={handleInputChange}
                                                            placeholder="John Doe" 
                                                            className={`w-full bg-pink-950/20 border ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-pink-500'} rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200`}
                                                        />
                                                    </div>
                                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                                                        Email Address <span className="text-pink-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                                        <input 
                                                            type="email" 
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            placeholder="john@example.com" 
                                                            className={`w-full bg-pink-950/20 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-pink-500'} rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200`}
                                                        />
                                                    </div>
                                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Phone Number */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                        Phone Number <span className="text-slate-500 font-normal">(Optional)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                                        <input 
                                                            type="tel" 
                                                            name="phoneNumber"
                                                            value={formData.phoneNumber}
                                                            onChange={handleInputChange}
                                                            placeholder="+1 (555) 000-0000" 
                                                            className="w-full bg-pink-950/20 border border-slate-800 focus:border-pink-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Country / Location */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                        Country / Location <span className="text-slate-500 font-normal">(Optional)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                                        <input 
                                                            type="text" 
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            placeholder="United States" 
                                                            className="w-full bg-pink-950/20 border border-slate-800 focus:border-pink-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subject */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                    Subject <span className="text-slate-500 font-normal">(Optional)</span>
                                                </label>
                                                <div className="relative">
                                                    <FileTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                                    <input 
                                                        type="text" 
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleInputChange}
                                                        placeholder="How can we help you?" 
                                                        className="w-full bg-pink-950/20 border border-slate-800 focus:border-pink-500 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
                                                    />
                                                </div>
                                            </div>

                                            {/* Message */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                                                    Message <span className="text-pink-500">*</span>
                                                </label>
                                                <textarea 
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    placeholder="Type your message here..." 
                                                    className={`w-full bg-pink-950/20 border ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-pink-500'} rounded-lg p-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 resize-none`}
                                                />
                                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                            </div>

                                            {/* File Attachment */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                    File Attachment <span className="text-slate-500 font-normal">(Optional)</span>
                                                </label>
                                                <div 
                                                    onDragOver={handleDragOver}
                                                    onDrop={handleDrop}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="border border-dashed border-slate-800 hover:border-pink-500/50 rounded-lg p-4 bg-pink-950/5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                                                >
                                                    <input 
                                                        type="file" 
                                                        ref={fileInputRef}
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                    {file ? (
                                                        <div className="flex items-center gap-2 text-pink-400">
                                                            <PaperclipIcon size={18} />
                                                            <span className="text-xs font-medium truncate max-w-xs">{file.name}</span>
                                                            <span className="text-[10px] text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <UploadCloudIcon className="size-6 text-slate-500 group-hover:text-pink-400 transition-colors" />
                                                            <p className="text-xs text-slate-400">
                                                                <span className="text-pink-400 font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-[10px] text-slate-600">Supported formats: PDF, DOCX, PNG, JPG (Max 5MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 active:scale-[0.98]"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Sending Message...
                                                    </>
                                                ) : (
                                                    <>
                                                        <SendIcon size={16} />
                                                        Send Message
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success-container"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="py-12 flex flex-col items-center justify-center text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        >
                                            <CheckCircle2Icon className="size-16 text-emerald-500 mb-6" />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                                        <p className="text-slate-400 text-sm max-w-sm">
                                            Thank you for contacting us, <span className="text-pink-400 font-medium">{formData.fullName}</span>. We will review your message and reply to <span className="text-pink-400 font-medium">{formData.email}</span> as soon as possible.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
