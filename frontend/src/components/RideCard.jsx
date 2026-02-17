import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RideCard = ({ ride }) => {
    const navigate = useNavigate();

    // Format date and time
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                                {ride.source || ride.sourceCity}
                                <span className="text-slate-400">→</span>
                                {ride.destination || ride.destinationCity}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(ride.startTime || ride.departureTime)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatTime(ride.startTime || ride.departureTime)}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-teal-600">
                                ₹{ride.pricePerSeat || ride.price || 0}
                            </span>
                            <p className="text-xs text-slate-500">per seat</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-3 border-t border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                {ride.driverName || 'Driver'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>★ 4.8</span>
                                <span>•</span>
                                <span>{ride.availableSeats} seats left</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50 p-4 flex justify-between items-center">
                <div className="text-xs text-slate-500">
                    {ride.status === 'SCHEDULED' ? 'Scheduled' : ride.status}
                </div>
                <Button
                    onClick={() => navigate(`/rides/${ride.id}`)}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
};

export default RideCard;
