import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Mail, Phone, MapPin, User, Shield, Star, Car, Leaf, Edit, LogOut, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

const Profile = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // In a real app, use useAuth() to get the actual user. 
    // For this specific request, we mock "Rohith" with random values.
    const { user: authUser, signOut } = useAuth();
    const navigate = useNavigate();

    // Use actual user data where available, fallback to defaults
    const user = {
        name: authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || "User",
        role: authUser?.role || "PASSENGER",
        email: authUser?.email || "user@example.com",
        phone: authUser?.user_metadata?.phoneNumber || authUser?.phone || "Not provided",
        address: "Thoraipakkam, OMR\nChennai, Tamil Nadu, 600097",
        memberSince: authUser?.created_at ? new Date(authUser.created_at).getFullYear() : "2024",
        stats: {
            rating: 4.9,
            rides: 12,
            responseRate: "100%",
            co2Saved: "120kg"
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-foreground bg-background antialiased">
            <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 pt-16">
                <div className="container mx-auto max-w-5xl py-8 px-4">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Sidebar / Left Column */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Profile Card */}
                            <Card className="overflow-hidden border-none shadow-xl rounded-3xl">
                                <div className="h-32 bg-gradient-to-r from-orange-400 to-amber-500 relative">
                                    {/* Abstract Shapes for "distinct" look */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full -ml-5 -mb-5"></div>
                                </div>
                                <div className="px-6 pb-6 relative">
                                    {/* Profile Picture Removed */}

                                    <div className="mt-6 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                            <Badge variant="outline" className="uppercase text-[10px] tracking-widest border-orange-200 text-orange-600 bg-orange-50">
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">Member since {user.memberSince}</p>
                                    </div>

                                    <div className="mt-8 space-y-5">
                                        <div className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                                                <p className="text-gray-700 truncate">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition-colors">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-semibold uppercase">Mobile</p>
                                                <p className="text-gray-700">{user.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 text-sm group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition-colors shrink-0">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-semibold uppercase">Address</p>
                                                <p className="text-gray-700 leading-snug">{user.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <Button className="flex-1 bg-gray-900 text-white hover:bg-gray-800" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Main Content / Right Column */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                            <Star className="w-6 h-6 fill-current" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{user.stats.rating}</p>
                                            <p className="text-sm text-gray-500">Average Rating</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Car className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{user.stats.rides}</p>
                                            <p className="text-sm text-gray-500">Total Rides</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{user.stats.responseRate}</p>
                                            <p className="text-sm text-gray-500">Response Rate</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{user.stats.co2Saved}</p>
                                            <p className="text-sm text-gray-500">CO2 Saved</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-auto py-4 justify-start px-6 rounded-xl border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-all group">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <Key className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Change Password</p>
                                        <p className="text-xs text-gray-500">Update your security credentials</p>
                                    </div>
                                </Button>

                                <Button variant="outline" className="h-auto py-4 justify-start px-6 rounded-xl border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-all group">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <Edit className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">Edit Profile</p>
                                        <p className="text-xs text-gray-500">Modify your personal details</p>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Profile;
