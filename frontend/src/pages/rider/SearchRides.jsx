import React, { useState } from "react";
import { Search } from "lucide-react";
import RideCard from "../../components/RideCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Mock data
const mockRides = [
    {
        id: "1",
        source: "Mumbai",
        destination: "Pune",
        startTime: "2026-02-10T09:00:00",
        pricePerSeat: 500,
        availableSeats: 2,
        totalSeats: 4,
        status: "SCHEDULED",
        driverName: "Rahul",
    },
    {
        id: "2",
        source: "Delhi",
        destination: "Jaipur",
        startTime: "2026-02-11T07:30:00",
        pricePerSeat: 600,
        availableSeats: 3,
        totalSeats: 4,
        status: "SCHEDULED",
        driverName: "Amit",
    },
    {
        id: "3",
        source: "Bangalore",
        destination: "Chennai",
        startTime: "2026-02-09T14:00:00",
        pricePerSeat: 700,
        availableSeats: 1,
        totalSeats: 3,
        status: "SCHEDULED",
        driverName: "Priya",
    },
    {
        id: "4",
        source: "Hyderabad",
        destination: "Bangalore",
        startTime: "2026-02-12T10:00:00",
        pricePerSeat: 550,
        availableSeats: 0,
        totalSeats: 4,
        status: "SCHEDULED",
        driverName: "Sneha",
    },
];

export default function SearchRides() {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [filteredRides, setFilteredRides] = useState(mockRides);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setHasSearched(true);

        const filtered = mockRides.filter((ride) => {
            const matchSource = !source || ride.source.toLowerCase().includes(source.toLowerCase());
            const matchDestination = !destination || ride.destination.toLowerCase().includes(destination.toLowerCase());
            return matchSource && matchDestination;
        });

        setFilteredRides(filtered);
    };

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <h1 className="text-2xl font-semibold mb-6 text-slate-800">Find Your Next Ride</h1>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="source">From</Label>
                                <Input
                                    id="source"
                                    type="text"
                                    placeholder="Enter source city"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    className="bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="destination">To</Label>
                                <Input
                                    id="destination"
                                    type="text"
                                    placeholder="Enter destination city"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800">
                            <Search className="w-4 h-4 mr-2" />
                            Search Rides
                        </Button>
                    </form>
                </div>

                {/* Results Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-800">
                            {hasSearched ? "Search Results" : "Available Rides"}
                        </h2>
                        <span className="text-sm text-slate-500">
                            {filteredRides.length} {filteredRides.length === 1 ? "ride" : "rides"} found
                        </span>
                    </div>

                    {filteredRides.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No rides found</h3>
                            <p className="text-slate-500 text-sm">
                                Try adjusting your search criteria
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredRides.map((ride) => (
                                <RideCard key={ride.id} ride={ride} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
