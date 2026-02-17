import { useState } from "react";
import { createRide } from "../../api/rideApi";
import { useNavigate } from "react-router-dom";

const CreateRide = () => {
    const [formData, setFormData] = useState({
        sourceCity: "",
        destinationCity: "",
        startTime: "",
        pricePerSeat: "",
        totalSeats: 1,
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createRide(formData);
            alert("Ride created successfully!");
            navigate("/my-rides");
        } catch (error) {
            console.error("Error creating ride", error);
            alert("Failed to create ride");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Create a Ride</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded max-w-lg">
                <div className="mb-4">
                    <label className="block mb-1">Source City</label>
                    <input name="sourceCity" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Destination City</label>
                    <input name="destinationCity" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Start Time</label>
                    <input type="datetime-local" name="startTime" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Price per Seat ($)</label>
                    <input type="number" name="pricePerSeat" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Total Seats</label>
                    <input type="number" name="totalSeats" onChange={handleChange} className="w-full border p-2 rounded" min="1" required />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Publish Ride</button>
            </form>
        </div>
    );
};

export default CreateRide;
