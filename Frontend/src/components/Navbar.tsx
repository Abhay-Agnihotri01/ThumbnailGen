import { MenuIcon, XIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Context";
import ContactModal from "./ContactModal";

export default function Navbar() {
    const{isLoggedIn,user,logout}=useAuth()
    const [isOpen, setIsOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to="/">
                    <img src="/logo.svg" alt="Logo" className="h-8.5 w-auto" />
                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link to="/" className="hover:text-pink-300 transition">
                        Home
                    </Link>
                    <Link to="/generate" className="hover:text-pink-300 transition">
                        Generate
                    </Link>

                    {
                     isLoggedIn?<Link to="/my-generation" className="hover:text-pink-300 transition">
                        My Generations</Link>:
                    <Link to="#" className="hover:text-pink-300 transition">
                       About
                    </Link>
                    }
                    
                    <button onClick={() => setIsContactOpen(true)} className="hover:text-pink-300 transition cursor-pointer">
                        Contact us
                    </button>
                    
                </div>
                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <div className="relative group"> 
                            {/* Avatar Button */}
                            <button className="flex items-center justify-center rounded-full size-9 bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/20 cursor-pointer border border-pink-400/30 hover:scale-105 active:scale-95 transition-all duration-200">
                                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </button>

                            {/* Dropdown Card */}
                            <div className="absolute right-0 top-full pt-2 opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                                <div className="bg-slate-950/95 border border-pink-950/80 backdrop-blur-md rounded-xl p-4 w-48 shadow-2xl flex flex-col gap-2.5">
                                    {/* User Details */}
                                    <div className="flex flex-col select-none">
                                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                                    </div>
                                    <div className="h-px bg-pink-950/60 my-0.5" />
                                    
                                    {/* Actions */}
                                    <button 
                                        onClick={() => logout()} 
                                        className="flex items-center gap-2 text-red-400 hover:text-white hover:bg-red-500/20 px-3 py-2 rounded-lg transition-all duration-150 text-xs font-semibold w-full text-left cursor-pointer"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button> 
                                </div>
                            </div>
                        </div>
                    ) : (
                    <button onClick={()=>navigate('/login')} className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full">
                    Get Started
                    </button> 
                    )}

                    <button onClick={() => setIsOpen(true)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                     </button>
                </div>
                
                
            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link onClick={()=>setIsOpen(false)} to="/" >
                        Home
                    </Link>
                    <Link onClick={()=>setIsOpen(false)} to="/generate" >
                        Generate
                    </Link>
                    {isLoggedIn?<Link onClick={()=>setIsOpen(false)} to="/my-generation" >
                        My Generations</Link>
                        :
                    <Link onClick={()=>setIsOpen(false)} to="#" >
                        About
                    </Link>
                
                }
                    
                    <button onClick={() => { setIsOpen(false); setIsContactOpen(true); }} className="hover:text-pink-300 transition cursor-pointer">
                       Contact us
                    </button>
                    {isLoggedIn?<button onClick={()=>{setIsOpen(false);logout()}} className="bg-white/20 border-2 border-white/10 px-5 py-1.5 rounded">
                                Logout </button>
                    :<Link onClick={()=>setIsOpen(false)} to="#">
                        Login
                    </Link>}
                    
                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}