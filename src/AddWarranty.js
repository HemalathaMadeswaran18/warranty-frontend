import React, { useState } from 'react';

const AddWarranty = ({ onAdd }) => {
    const [productName, setProductName] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [retailer, setRetailer] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        // Step 1: Send warranty data as JSON
        const warrantyRes = await fetch('http://localhost:8080/api/warranties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productName,
                serialNumber,
                purchaseDate,
                expiryDate,
                retailer
            })
        });

        if (!warrantyRes.ok) {
            alert("Failed to add warranty");
            return;
        }

        const newWarranty = await warrantyRes.json();

        // Step 2: Upload file if selected
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const fileUploadRes = await fetch(`http://localhost:8080/api/warranties/${newWarranty.id}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!fileUploadRes.ok) {
                alert("Warranty added, but failed to upload file.");
                return;
            }
        }

        onAdd(newWarranty);
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title mb-4">Add New Warranty</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" value={productName}
                                   onChange={e => setProductName(e.target.value)} placeholder="Product Name" required/>
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" value={serialNumber}
                                   onChange={e => setSerialNumber(e.target.value)} placeholder="Serial Number"
                                   required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
                            <input
                                id="purchaseDate"
                                type="date"
                                className="form-control"
                                value={purchaseDate}
                                onChange={e => setPurchaseDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                            <input
                                id="expiryDate"
                                type="date"
                                className="form-control"
                                value={expiryDate}
                                onChange={e => setExpiryDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" value={retailer}
                                   onChange={e => setRetailer(e.target.value)} placeholder="Retailer" required/>
                        </div>
                        <div className="mb-3">
                            <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])}/>
                        </div>
                        <button type="submit" className="btn btn-primary">Add Warranty</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddWarranty;