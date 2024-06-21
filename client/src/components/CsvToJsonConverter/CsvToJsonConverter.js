import { useState } from 'react';
import axios from 'axios';

const CsvToJsonConverter = ({ baseURL }) => {
    const [json, setJson] = useState(null); // State to hold the JSON response
    const [error, setError] = useState(null); // State to hold any error messages

    // Function to handle file upload and conversion
    const handleFileUpload = async (event) => {
        const file = event.target.files[0]; // Get the selected file from the input
        const formData = new FormData();
        formData.append('file', file); // Append the file to form data

        try {
            const response = await axios.post(`${baseURL}/convert`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setJson(response.data); // Update state with the received JSON data
        } catch (err) {
            setError(`Error uploading and converting file: ${err.message}`); // Set error message if the request fails
            console.error('Error uploading and converting file:', err.response || err); // Log detailed error
        }
    };

    return (
        <div>
            <h1>CSV to JSON Converter</h1>
            <input type="file" accept=".csv" onChange={handleFileUpload} /> {/* Input for selecting CSV file */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
            {json && <pre>{JSON.stringify(json, null, 2)}</pre>} {/* Display the converted JSON in a formatted way */}
        </div>
    );
};

export default CsvToJsonConverter;