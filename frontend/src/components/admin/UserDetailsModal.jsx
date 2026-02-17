import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { FileText, Calendar, MapPin, Mail, Phone, Hash } from 'lucide-react';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
    // If no user is selected, don't render
    if (!user && !isOpen) return null;

    // Hardcoded "Rohith" data as requested for the "view", 
    // combined with the selected user's status for context if needed, 
    // or just strictly following the "instead of hafil give details as rohith" instruction.
    // I will use a mix: visual data is Rohith, but we keep the ID from the passed user if available for realism in a real app, 
    // or just fully mock it if that's the specific request. 
    // Given "give details as rohith", I will use a display object.

    // Randomize some values for "random values" requirement
    const randomRating = (3.5 + Math.random() * 1.5).toFixed(1);
    const randomRides = Math.floor(Math.random() * 50) + 1;
    const randomCO2 = Math.floor(Math.random() * 100) + 20;

    const displayUser = {
        name: "Rohith",
        email: "rohith.demo@example.com",
        phone: "+91 98765 43210",
        role: user ? user.role : 'PASSENGER',
        status: user ? user.status : 'Pending',
        id: user ? user.id : 'ROH-1234',
        joined: "2024-05-15",
        address: "123, Tech Park Road, Bengaluru, Karnataka, 560001",
        education: {
            highSchool: "St. Joseph's",
            secondary: "City PU College",
            undergrad: "Tech Institute of India"
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-0 overflow-hidden rounded-xl">
                {/* Custom Header Design */}
                <div className="bg-slate-50 p-6 border-b flex items-start justify-between">
                    <div className="flex gap-5 items-center">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-bold border-2 shadow-sm ${displayUser.role === 'DRIVER' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-blue-50 border-blue-200 text-blue-600'
                            }`}>
                            {displayUser.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{displayUser.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={displayUser.role === 'DRIVER' ? 'default' : 'outline'} className={`${displayUser.role === 'DRIVER' ? 'bg-orange-500 hover:bg-orange-600' : 'text-blue-600 border-blue-200'
                                    }`}>
                                    {displayUser.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">ID: {displayUser.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-8">
                    {/* Column 1 */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Details</h4>
                            <div className="space-y-4">
                                <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-400 mr-3 shadow-sm border">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                        <p className="text-sm font-medium text-gray-900">{displayUser.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-400 mr-3 shadow-sm border">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Mobile Number</p>
                                        <p className="text-sm font-medium text-gray-900">{displayUser.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-400 mr-3 shadow-sm border shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Residence</p>
                                        <p className="text-sm font-medium text-gray-900 leading-relaxed">
                                            {displayUser.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Overview</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <p className={`text-lg font-bold ${displayUser.status === 'Approved' ? 'text-green-600' : 'text-amber-600'
                                        }`}>{displayUser.status}</p>
                                </div>
                                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                                    <p className="text-xs text-muted-foreground">Member Since</p>
                                    <p className="text-lg font-bold text-gray-800">{displayUser.joined}</p>
                                </div>
                                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                                    <p className="text-xs text-muted-foreground">Rating</p>
                                    <p className="text-lg font-bold text-yellow-600 flex items-center gap-1">
                                        {randomRating} ★
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                                    <p className="text-xs text-muted-foreground">Impact</p>
                                    <p className="text-lg font-bold text-green-600">{randomCO2} kg CO2</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Verification Docs</h4>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 h-auto py-3 border-dashed hover:border-solid hover:bg-slate-50 transition-all">
                                    <div className="flex flex-col items-center gap-1">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-medium">Identity Proof</span>
                                    </div>
                                </Button>
                                <Button variant="outline" className="flex-1 h-auto py-3 border-dashed hover:border-solid hover:bg-slate-50 transition-all">
                                    <div className="flex flex-col items-center gap-1">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-medium">Tax Document</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section - Educational Background */}
                <div className="px-6 py-4 bg-slate-50 border-t">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Educational Background</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase">High School</p>
                            <p className="text-sm font-medium text-gray-900">{displayUser.education.highSchool}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase">Pre-University</p>
                            <p className="text-sm font-medium text-gray-900">{displayUser.education.secondary}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase">University</p>
                            <p className="text-sm font-medium text-gray-900">{displayUser.education.undergrad}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t">
                    <Button onClick={onClose} className="w-full sm:w-auto">Close Details</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsModal;
