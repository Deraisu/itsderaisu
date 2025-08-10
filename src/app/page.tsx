'use client';

import React, { useState } from 'react';

export default function Page() {
    const [question, setQuestion] = useState('');

    const handleSubmit = () => {
        if (question.trim() === '') {
            alert('Silakan masukkan pertanyaan Anda');
            return;
        }
        // Here you can add AJAX call or whatever processing you need
        console.log('Pertanyaan yang dikirim:', question);
        setQuestion('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: '#e5f5e0',
            minHeight: '100vh',
            margin: 0,
            padding: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: 30,
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: 600
            }}>
                <h1 style={{
                    color: '#2e7d32',
                    textAlign: 'center',
                    marginBottom: 20,
                    fontSize: 24
                }}>
                    Silakan Ajukan Pertanyaan Anda
                </h1>
                <div style={{
                    display: 'flex',
                    marginBottom: 20
                }}>
                    <input
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pertanyaan Anda di sini..."
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: '6px 0 0 6px',
                            fontSize: 16,
                            color: '#333',
                            backgroundColor: '#f8f9fa',
                            transition: 'all 0.3s ease'
                        }}
                    />
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0 6px 6px 0',
                            cursor: 'pointer',
                            fontSize: 16,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#3e8e41')}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#4caf50')}
                    >
                        Kirim
                    </button>
                </div>
                <div style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: 14,
                    marginTop: 20
                }}>
                    Pertanyaan Anda akan diproses dan dijawab secepatnya
                </div>
            </div>
        </div>
    );
}

