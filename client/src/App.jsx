import React, { useState, useEffect } from 'react';

const App = () => {
    const [inputValue, setInputValue] = useState('');
    const [strings, setStrings] = useState([]);

    useEffect(() => {
        fetchStrings();
    }, []);

    const fetchStrings = async () => {
        try {
            const response = await fetch(`/api/strings`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setStrings(data);
            } else {
                console.error('Expected an array but received:', data);
            }
        } catch (error) {
            console.error('Error fetching strings:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue) return;

        try {
            const response = await fetch(`/api/strings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: inputValue }),
            });
            const newString = await response.json();
            if (newString && newString.value) {
                setStrings([...strings, newString]);
            }
            setInputValue('');
        } catch (error) {
            console.error('Error submitting string:', error);
        }
    };

    return (
        <div>
            <h1>String Submitter</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <h2>Submitted Strings</h2>
            <ul>
                {strings.map((string, index) => (
                    <li key={index}>{string.value}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
