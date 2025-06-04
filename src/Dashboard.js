// Dashboard.js

import AddWarranty from './AddWarranty';
import React, { useEffect, useState } from 'react';

const Dashboard = ({ onLogout }) => {
    const [warranties, setWarranties] = useState([]);
    const [editWarranty, setEditWarranty] = useState(null);

    useEffect(() => {
        fetchWarranties();
    }, []);

    const fetchWarranties = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/api/warranties', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setWarranties(data))
            .catch(err => console.error('Error fetching warranties:', err));
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this warranty?");
        if (!confirmed) return;

        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:8080/api/warranties/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            setWarranties(warranties.filter(w => w.id !== id));
        } else {
            alert('Failed to delete');
        }
    };

    const handleEdit = (warranty) => {
        setEditWarranty({ ...warranty });
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/warranties/${editWarranty.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editWarranty)
        });

        if (res.ok) {
            alert('Warranty updated successfully');
            setEditWarranty(null);
            fetchWarranties();
        } else {
            alert('Update failed');
        }
    };

    const downloadFile = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/warranties/${id}/download`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'receipt.pdf'; // Customize if needed
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download receipt.');
            console.error(err);
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Your Warranties</h1>
                <button className="btn btn-outline-danger" onClick={onLogout}>Logout</button>
            </div>
            <div className="row">
                {warranties.map(warranty => (
                    <div key={warranty.id} className="col-md-4 mb-4">
                        <div
                            className="card h-100 p-3 mb-5 bg-white rounded"
                            style={{
                                boxShadow: '0 4px 8px rgba(0, 123, 255, 0.4)', // light blue shadow
                                transition: 'box-shadow 0.3s ease-in-out'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 123, 255, 0.6)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.4)'}
                        >
                            <div className="card-body">
                                <h4 className="card-title">{warranty.productName}</h4>
                                <p className="card-text">Serial: {warranty.serialNumber}</p>
                                <p className="card-text">Purchase: {warranty.purchaseDate}</p>
                                <p className="card-text">Expiry: {warranty.expiryDate}</p>
                                <p className="card-text">Retailer: {warranty.retailer}</p>
                                {warranty.documentPath && (
                                    <button
                                        className="btn btn-primary btn-sm mb-2"
                                        onClick={() => downloadFile(warranty.id)}
                                    >
                                        Download Receipt
                                    </button>
                                )}
                                <div>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(warranty)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(warranty.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editWarranty && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h3 className="card-title mb-3">Edit Warranty</h3>
                        <input
                            type="text"
                            className="form-control mb-3"
                            value={editWarranty.productName}
                            onChange={(e) => setEditWarranty({ ...editWarranty, productName: e.target.value })}
                            placeholder="Product Name"
                        />
                        <input
                            type="text"
                            className="form-control mb-3"
                            value={editWarranty.serialNumber}
                            onChange={(e) => setEditWarranty({ ...editWarranty, serialNumber: e.target.value })}
                            placeholder="Serial Number"
                        />
                        <input
                            type="date"
                            className="form-control mb-3"
                            value={editWarranty.purchaseDate}
                            onChange={(e) => setEditWarranty({ ...editWarranty, purchaseDate: e.target.value })}
                            placeholder="Purchase Date"
                        />
                        <input
                            type="date"
                            className="form-control mb-3"
                            value={editWarranty.expiryDate}
                            onChange={(e) => setEditWarranty({ ...editWarranty, expiryDate: e.target.value })}
                            placeholder="Expiry Date"
                        />
                        <input
                            type="text"
                            className="form-control mb-3"
                            value={editWarranty.retailer}
                            onChange={(e) => setEditWarranty({ ...editWarranty, retailer: e.target.value })}
                            placeholder="Retailer"
                        />
                        <div className="d-flex">
                            <button className="btn btn-success me-2" onClick={handleSaveEdit}>Save</button>
                            <button className="btn btn-secondary" onClick={() => setEditWarranty(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <AddWarranty onAdd={(newWarranty) => setWarranties([...warranties, newWarranty])} />
        </div>
    );
};

export default Dashboard;