'use client'
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
    const navigate=useNavigate();
    return (
        <motion.div className="max-w-5xl py-16 mt-40 md:pl-20 md:w-full max-md:mx-4 md:mx-auto flex flex-col md:flex-row max-md:gap-6 items-center justify-between text-left bg-linear-to-b from-pink-900 to-pink-950 rounded-2xl p-6 text-white"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            <div>
                <motion.h1 className="text-4xl md:text-[46px] md:leading-15 font-semibold bg-linear-to-r from-white to-pink-400 text-transparent bg-clip-text"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    Ready to go viral?
                </motion.h1>
                <motion.p className="bg-linear-to-r from-white to-pink-400 text-transparent bg-clip-text text-lg"
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}
                >
                    Join thousands of creators using AI  to boost their CTR.
                </motion.p>
            </div>
            <motion.button
                onClick={() => navigate("/generate")}
                className="relative overflow-hidden px-10 py-4 rounded-full text-sm font-semibold text-pink-950 bg-white mt-4 cursor-pointer group [animation:ctaGlow_1.5s_ease-in-out_infinite_alternate]"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
            >
                {/* shimmer sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                <span className="relative flex items-center gap-2">
                    Generate Free Thumbnail
                    <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    >
                        →
                    </motion.span>
                </span>
            </motion.button>
        </motion.div>
    );
}