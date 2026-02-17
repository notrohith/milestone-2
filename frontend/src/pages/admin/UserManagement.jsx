import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, Ban, CheckCircle, Trash2, Eye } from 'lucide-react';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import { getPendingUsers, approveUser, rejectUser } from '../../api/authApi';

const UserManagement = ({ filterStatus, filterRole }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Mock initial data if API fails or is empty for demo
    const MOCK_USERS = [
        { id: 1, name: 'Admin User', email: 'admin@rideshare.com', role: 'ADMIN', status: 'Approved', joined: '2024-01-01' },
        { id: 2, name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'DRIVER', status: 'Approved', joined: '2026-02-16', phone: '9876543210' },
        { id: 3, name: 'Michael Chen', email: 'm.chen99@example.com', role: 'PASSENGER', status: 'Approved', joined: '2026-02-15', phone: '8765432109' },
        { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'PASSENGER', status: 'Pending', joined: '2026-02-14', phone: '7654321098' },
        { id: 5, name: 'James Rodriguez', email: 'j.rodriguez@example.com', role: 'DRIVER', status: 'Approved', joined: '2026-02-13', phone: '6543210987' },
        { id: 6, name: 'David Kim', email: 'david.kim@example.com', role: 'PASSENGER', status: 'Blocked', joined: '2026-02-10', phone: '5432109876' },
    ];

    useEffect(() => {
        // Fetch real users here, for now using mock + pending
        const fetchUsers = async () => {
            try {
                // const response = await getPendingUsers();
                // Combine mock with API response
                setUsers(MOCK_USERS);
            } catch (error) {
                console.error("Failed to fetch users", error);
                setUsers(MOCK_USERS);
            }
        };
        fetchUsers();
    }, []);

    const handleAction = async (userId, action) => {
        // Optimistic update
        setUsers(prev => prev.map(u =>
            u.id === userId
                ? { ...u, status: action === 'approve' ? 'Approved' : action === 'reject' ? 'Blocked' : u.status }
                : u
        ));

        // Call API
        try {
            if (action === 'approve') await approveUser(userId);
            if (action === 'reject') await rejectUser(userId);
        } catch (e) {
            console.error(e);
            // Revert on failure if needed
        }
    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? (filterStatus === 'Pending' ? user.status === 'Pending' : true) : true;
        const matchesRole = filterRole ? user.role === filterRole : true;

        return matchesSearch && matchesStatus && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {filterRole ? `${filterRole.charAt(0) + filterRole.slice(1).toLowerCase()}s` : filterStatus ? `${filterStatus} Users` : 'All Users'}
                    </h2>
                    <p className="text-muted-foreground">Manage user accounts and permissions.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users..."
                            className="pl-8 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.role === 'ADMIN' ? 'default' : user.role === 'DRIVER' ? 'secondary' : 'outline'}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={`${user.status === 'Approved' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' :
                                                    user.status === 'Pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200' :
                                                        'bg-red-100 text-red-700 hover:bg-red-100 border-red-200'
                                                    }`}
                                                variant="outline"
                                            >
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.status === 'Pending' && (
                                                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700" onClick={() => handleAction(user.id, 'approve')}>
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span className="sr-only">Approve</span>
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700" onClick={() => handleAction(user.id, 'reject')}>
                                                    <Ban className="h-4 w-4" />
                                                    <span className="sr-only">Block</span>
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(user.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>

                                                {/* View Details Trigger */}
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openModal(user)}>
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">View</span>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <UserDetailsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} user={selectedUser} />
        </div>
    );
};

export default UserManagement;
