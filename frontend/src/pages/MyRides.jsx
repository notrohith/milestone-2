import { useState, useEffect } from "react";
import { Car, MapPin, Calendar, Users, DollarSign } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const statusColors = {
    CREATED: "bg-blue-100 text-blue-700 border-blue-200",
    OPEN: "bg-indigo-100 text-indigo-700 border-indigo-200",
    STARTED: "bg-green-100 text-green-700 border-green-200",
    COMPLETED: "bg-gray-100 text-gray-700 border-gray-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels = {
    CREATED: "Created",
    OPEN: "Open",
    STARTED: "Ongoing",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

export default function MyRidesPage() {
    const { user } = useAuth();
    const userRole = user?.role?.toLowerCase() || "rider";

    const [driverRides, setDriverRides] = useState([]);
    const [riderRides, setRiderRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("scheduled"); // Assuming a default tab for driver/rider views

    useEffect(() => {
        if (!user?.email) return;
        fetchRides();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, activeTab]);

    const fetchRides = async () => {
        setLoading(true);
        try {
            // Get user's UUID from their auth email
            const { data: userData } = await supabase
                .from("users")
                .select("id")
                .eq("email", user.email)
                .limit(1);

            if (!userData || userData.length === 0) return;
            const uid = userData[0].id;

            if (userRole === "driver") {
                // Fetch rides created by this driver
                const { data, error } = await supabase
                    .from("rides")
                    .select("*")
                    .eq("driver_id", uid)
                    .order("start_time", { ascending: false });

                if (error) throw error;

                const formatted = data.map(r => ({
                    id: r.id,
                    source: r.source_city,
                    destination: r.destination_city,
                    startTime: r.start_time,
                    pricePerKm: r.price_per_seat, // displayed as per seat generally
                    availableSeats: r.available_seats,
                    totalSeats: r.total_seats,
                    status: r.status,
                }));
                setDriverRides(formatted);
            } else {
                // Fetch rides joined by this rider
                const { data, error } = await supabase
                    .from("ride_participants")
                    .select("*, rides(*)")
                    .eq("rider_id", uid);

                if (error) throw error;

                const formatted = data.map(p => ({
                    id: p.rides.id,
                    source: p.rides.source_city,
                    destination: p.rides.destination_city,
                    startTime: p.rides.start_time,
                    fare: p.fare_at_booking,
                    joinPoint: p.rides.source_city, // Fallback if no specific point
                    dropPoint: p.rides.destination_city,
                    status: p.rides.status,
                }));

                // Sort descending
                formatted.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                setRiderRides(formatted);
            }
        } catch (error) {
            console.error("Error fetching rides:", error);
            toast.error("Failed to load rides");
        } finally {
            setLoading(false);
        }
    };

    const handleStartRide = async (rideId) => {
        try {
            const { error } = await supabase
                .from("rides")
                .update({ status: "STARTED" })
                .eq("id", rideId);
            if (error) throw error;
            toast.success("Ride started successfully!");
            fetchRides();
        } catch (e) {
            toast.error("Failed to start ride");
        }
    };

    const handleCompleteRide = async (rideId) => {
        try {
            const { error } = await supabase
                .from("rides")
                .update({ status: "COMPLETED" })
                .eq("id", rideId);
            if (error) throw error;
            toast.success("Ride completed successfully!");
            fetchRides();
        } catch (e) {
            toast.error("Failed to complete ride");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 pt-[72px] max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 mt-4">
                    <h1 className="text-3xl font-semibold mb-2 text-slate-900">My Rides</h1>
                    <p className="text-slate-500">
                        {userRole === "driver"
                            ? "Manage your offered rides"
                            : "Track your booked rides"}
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-500">Loading your rides...</div>
                ) : userRole === "driver" ? (
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
    // Map OPEN/CREATED to scheduled, STARTED to ongoing
    return (
        <Tabs defaultValue="scheduled" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-200">
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled" className="mt-6">
                <RidesList
                    rides={rides.filter(r => r.status === "CREATED" || r.status === "OPEN")}
                    onStartRide={onStartRide}
                    onCompleteRide={onCompleteRide}
                />
            </TabsContent>

            <TabsContent value="ongoing" className="mt-6">
                <RidesList
                    rides={rides.filter(r => r.status === "STARTED")}
                    onStartRide={onStartRide}
                    onCompleteRide={onCompleteRide}
                />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
                <RidesList
                    rides={rides.filter(r => r.status === "COMPLETED")}
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
                                    <span>₹{ride.pricePerKm}/seat</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Users className="w-4 h-4" />
                                    <span>{ride.availableSeats}/{ride.totalSeats} seats</span>
                                </div>
                                <div>
                                    <Badge className={statusColors[ride.status] || statusColors.OPEN}>
                                        {statusLabels[ride.status] || ride.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {(ride.status === "CREATED" || ride.status === "OPEN") && (
                            <Button onClick={() => onStartRide(ride.id)} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                                Start Ride
                            </Button>
                        )}
                        {ride.status === "STARTED" && (
                            <Button onClick={() => onCompleteRide(ride.id)} className="flex-1 bg-green-600 text-white hover:bg-green-700">
                                Complete Ride
                            </Button>
                        )}
                        {ride.status === "COMPLETED" && (
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
                <RiderRidesList rides={rides.filter(r => r.status === "CREATED" || r.status === "OPEN")} />
            </TabsContent>

            <TabsContent value="ongoing" className="mt-6">
                <RiderRidesList rides={rides.filter(r => r.status === "STARTED")} />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
                <RiderRidesList rides={rides.filter(r => r.status === "COMPLETED")} />
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
                            <Badge className={statusColors[ride.status] || statusColors.OPEN}>
                                {statusLabels[ride.status] || ride.status}
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
