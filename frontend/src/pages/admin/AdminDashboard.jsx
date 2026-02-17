import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Users, UserPlus, ShieldCheck, UserX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getPendingUsers } from '../../api/authApi'; // Assuming we can get all or filter
// Mock data for now if API is limited
import { format } from 'date-fns';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 120,
        pending: 15,
        approved: 98,
        blocked: 7
    });

    const data = [
        { name: 'Drivers', value: 45, color: '#3b82f6' }, // blue
        { name: 'Passengers', value: 75, color: '#8b5cf6' }, // violet
        { name: 'Pending', value: 15, color: '#f59e0b' }, // amber
        { name: 'Approved', value: 98, color: '#10b981' }, // emerald
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-muted-foreground">Manage users and applications.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">+20% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <UserPlus className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Action required</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.approved}</div>
                        <p className="text-xs text-muted-foreground">Active on platform</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blocked/Rejected</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.blocked}</div>
                        <p className="text-xs text-muted-foreground">Terminated accounts</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Registrations */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recently Registered</CardTitle>
                        <CardDescription>Latest users joining the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                { name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'DRIVER', date: '2026-02-16', status: 'Approved' },
                                { name: 'Michael Chen', email: 'm.chen99@example.com', role: 'PASSENGER', date: '2026-02-15', status: 'Approved' },
                                { name: 'Emily Davis', email: 'emily.davis@example.com', role: 'PASSENGER', date: '2026-02-14', status: 'Pending' },
                                { name: 'James Rodriguez', email: 'j.rodriguez@example.com', role: 'DRIVER', date: '2026-02-13', status: 'Approved' },
                            ].map((user, i) => (
                                <div className="flex items-center" key={i}>
                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs ${user.role === 'DRIVER' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user.status === 'Approved' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                        <span className="text-xs text-muted-foreground">{user.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
