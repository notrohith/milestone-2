import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Car, Plus, X } from 'lucide-react';

export const AddVehicleModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        number: '',
        rcNumber: '',
        expiry: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
        setFormData({ make: '', model: '', number: '', rcNumber: '', expiry: '' }); // Reset
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl">
                <div className="bg-white p-6 h-full">
                    <DialogHeader className="mb-6 text-center">
                        <div className="mx-auto bg-orange-100 p-3 rounded-full mb-3 w-fit">
                            <Car className="w-6 h-6 text-orange-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900">Register a Vehicle</DialogTitle>
                        <p className="text-xs text-gray-500">Provide details to list your car.</p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="make" className="text-xs font-semibold text-gray-500">Manufacturer</Label>
                                <Input id="make" name="make" placeholder="e.g. Toyota" className="bg-slate-50 border-slate-200" value={formData.make} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="model" className="text-xs font-semibold text-gray-500">Vehicle Model</Label>
                                <Input id="model" name="model" placeholder="e.g. Camry" className="bg-slate-50 border-slate-200" value={formData.model} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="number" className="text-xs font-semibold text-gray-500">License Plate No.</Label>
                            <Input id="number" name="number" placeholder="e.g. KA-01-AB-1234" className="bg-slate-50 border-slate-200" value={formData.number} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rcNumber" className="text-xs font-semibold text-gray-500">Registration Cert. No.</Label>
                            <Input id="rcNumber" name="rcNumber" placeholder="RC Number" className="bg-slate-50 border-slate-200" value={formData.rcNumber} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expiry" className="text-xs font-semibold text-gray-500">Registration Valid Until</Label>
                            <Input id="expiry" name="expiry" type="date" className="bg-slate-50 border-slate-200 block w-full" value={formData.expiry} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500">Car Images (Max 4)</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
                                        <Plus className="w-4 h-4 mb-1" />
                                        <span className="text-[9px] font-medium">Upload</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400 text-center mt-1">
                                Tap to select images (Exterior, Interior, Side)
                            </p>
                        </div>

                        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-6 mt-4 shadow-lg shadow-orange-200">
                            Submit Car Details
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const ViewVehicleModal = ({ isOpen, onClose, vehicle }) => {
    if (!vehicle) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Car Information
                        </DialogTitle>
                        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {/* Placeholder Image */}
                        <div className="h-16 w-16 rounded-xl bg-white border flex items-center justify-center shadow-sm">
                            <Car className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                            <p className="text-sm font-semibold text-gray-500">{vehicle.number}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <Label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 block">Car Images</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                    <Car className="w-6 h-6 text-slate-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Make</p>
                            <p className="font-semibold text-gray-900">{vehicle.make}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Model</p>
                            <p className="font-semibold text-gray-900">{vehicle.model}</p>
                        </div>
                        <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">License Plate</p>
                            <p className="font-semibold text-gray-900 tracking-wider">{vehicle.number}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">RC No.</p>
                            <p className="text-xs font-semibold text-gray-900 break-all">{vehicle.rcNumber}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Valid Until</p>
                            <p className="font-semibold text-gray-900">{vehicle.expiry}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-end">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
