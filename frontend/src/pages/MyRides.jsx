import { useState } from "react";
import { Car, MapPin, Calendar, Users, DollarSign } from "lucide-react";
// Navbar is already in App.js
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const mockDriverRides = [
    {
        id: "1",
        source: "Mumbai",
        destination: "Pune",
        startTime: "2026-02-10T09:00:00",
        pricePerKm: 5,
        availableSeats: 2,
        totalSeats: 4,
        status: "scheduled",
    },
    {
        id: "2",
        source: "Delhi",
        destination: "Agra",
        startTime: "2026-02-08T08:00:00",
        pricePerKm: 6,
        availableSeats: 1,
        totalSeats: 3,
        status: "completed",
    },
];

const mockRiderRides = [
    {
        id: "1",
        source: "Bangalore",
        destination: "Chennai",
        startTime: "2026-02-11T10:00:00",
        fare: 750,
        joinPoint: "Koramangala",
        dropPoint: "T Nagar",
        status: "scheduled",
    },
    {
        id: "2",
        source: "Hyderabad",
        destination: "Vijayawada",
        startTime: "2026-02-07T07:00:00",
        fare: 450,
        joinPoint: "Secunderabad",
        dropPoint: "Benz Circle",
        status: "completed",
    },
];

const statusColors = {
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    ongoing: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-gray-100 text-gray-700 border-gray-200",
};

const statusLabels = {
    scheduled: "Scheduled",
    ongoing: "Ongoing",
    completed: "Completed",
};

export default function MyRidesPage() {
    const { user } = useAuth();
    const userRole = user?.role?.toLowerCase() || "rider";

    const [driverRides] = useState(mockDriverRides);
    const [riderRides] = useState(mockRiderRides);

    const handleStartRide = (rideId) => {
        toast.success("Ride started successfully!");
    };

    const handleCompleteRide = (rideId) => {
        toast.success("Ride completed successfully!");
    };

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2 text-slate-900">My Rides</h1>
                    <p className="text-slate-500">
                        {userRole === "driver"
                            ? "Manage your offered rides"
                            : "Track your booked rides"}
                    </p>
                </div>

                {userRole === "driver" ? (
                    <DriverRidesView
                        rides={driverRides}
                        onStartRide={handleStartRide}
                        onCompleteRide={handleCompleteRide}
                    />
                ) : (
                    <RiderRidesView rides={riderRides} />
                )}
            </div>
        </div>
    );
}

function DriverRidesView({
    rides,
    onStartRide,
    onCompleteRide
}) {
    return (
        <Tabs defaultValue="scheduled" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-200">
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled" className="mt-6">
                <RidesList
                    rides={rides.filter(r => r.status === "scheduled")}
                    onStartRide={onStartRide}
                    onCompleteRide={onCompleteRide}
                />
            </TabsContent>

            <TabsContent value="ongoing" className="mt-6">
                <RidesList
                    rides={rides.filter(r => r.status === "ongoing")}
                    onStartRide={onStartRide}
                    onCompleteRide={onCompleteRide}
                />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
                <RidesList
                    rides={rides.filter(r => r.status === "completed")}
                    onStartRide={onStartRide}
                    onCompleteRide={onCompleteRide}
                />
            </TabsContent>
        </Tabs>
    );
}

function RidesList({
    rides,
    onStartRide,
    onCompleteRide
}) {
    if (rides.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                    <Car className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No rides found</h3>
                <p className="text-slate-500 text-sm">
                    You don't have any rides in this category
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rides.map((ride) => (
                <Card key={ride.id} className="p-6 border border-slate-200 shadow-sm bg-white">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-slate-900">{ride.source}</h3>
                                <span className="text-slate-400">→</span>
                                <h3 className="text-lg font-semibold text-slate-900">{ride.destination}</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(ride.startTime).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <DollarSign className="w-4 h-4" />
                                    <span>₹{ride.pricePerKm}/km</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Users className="w-4 h-4" />
                                    <span>{ride.availableSeats}/{ride.totalSeats} seats</span>
                                </div>
                                <div>
                                    <Badge className={statusColors[ride.status]}>
                                        {statusLabels[ride.status]}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {ride.status === "scheduled" && (
                            <Button onClick={() => onStartRide(ride.id)} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                                Start Ride
                            </Button>
                        )}
                        {ride.status === "ongoing" && (
                            <Button onClick={() => onCompleteRide(ride.id)} className="flex-1 bg-green-600 text-white hover:bg-green-700">
                                Complete Ride
                            </Button>
                        )}
                        {ride.status === "completed" && (
                            <Button variant="outline" disabled className="flex-1">
                                Completed
                            </Button>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}

function RiderRidesView({ rides }) {
    return (
        <Tabs defaultValue="scheduled" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-200">
                <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="completed">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled" className="mt-6">
                <RiderRidesList rides={rides.filter(r => r.status === "scheduled")} />
            </TabsContent>

            <TabsContent value="ongoing" className="mt-6">
                <RiderRidesList rides={rides.filter(r => r.status === "ongoing")} />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
                <RiderRidesList rides={rides.filter(r => r.status === "completed")} />
            </TabsContent>
        </Tabs>
    );
}

function RiderRidesList({ rides }) {
    if (rides.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                    <Car className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No rides found</h3>
                <p className="text-slate-500 text-sm">
                    You haven't booked any rides yet
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rides.map((ride) => (
                <Card key={ride.id} className="p-6 border border-slate-200 shadow-sm bg-white">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-slate-900">{ride.source}</h3>
                                <span className="text-slate-400">→</span>
                                <h3 className="text-lg font-semibold text-slate-900">{ride.destination}</h3>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(ride.startTime).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin className="w-4 h-4" />
                                    <span>Pickup: {ride.joinPoint}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin className="w-4 h-4" />
                                    <span>Drop: {ride.dropPoint}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <Badge className={statusColors[ride.status]}>
                                {statusLabels[ride.status]}
                            </Badge>
                            <div className="mt-3">
                                <p className="text-xs text-slate-500">Total Fare</p>
                                <p className="text-2xl font-bold text-teal-600">₹{ride.fare}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
