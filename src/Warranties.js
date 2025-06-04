import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Warranties = () => {
    const [warranties, setWarranties] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/warranties', {
            headers: {
                Authorization: 'Bearer <YOUR_JWT_TOKEN>'
            }
        })
            .then(response => setWarranties(response.data))
            .catch(error => console.error('Error fetching warranties:', error));
    }, []);

    return (
        <div>
            <h2>Your Warranties</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
                {warranties.map(w => (
                    <div key={w.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', width: '250px' }}>
                        <h3>{w.productName}</h3>
                        <p><strong>Serial:</strong> {w.serialNumber}</p>
                        <p><strong>Purchase Date:</strong> {w.purchaseDate}</p>
                        <p><strong>Expiry Date:</strong> {w.expiryDate}</p>
                        <p><strong>Retailer:</strong> {w.retailer}</p>
                        {w.documentPath && (
                            <a
                                href={`http://localhost:8080/api/warranties/${w.id}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                📄 Download Document
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Warranties;