import axios from 'axios';
import { useState } from 'react';

function App() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(''); // New state for the file name
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : ''); // Set the file name
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/extract-info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setInfo(response.data);
        } catch (err) {
            setError('Error uploading file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container flex flex-col items-center p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-black">Document Data Extractor</h1>
            <input type="file" onChange={handleFileChange} className="mb-4 border border-gray-300 p-2" />
            {fileName && <p className="text-black">Selected File: {fileName}</p>} {/* Display selected file name */}
            <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">Upload</button>
            {loading && <p className="text-black">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {info && (
                <div className="info mt-4 p-4 bg-white rounded shadow-md">
                    <h2 className="text-xl font-semibold text-black">Extracted Information</h2>
                    <p className="text-black">Name: {info.name}</p>
                    <p className="text-black">Expiration Date: {info.validity_nt}</p>
                    <p className="text-black">Document Number: {info.document_number}</p>
                </div>
            )}
        </div>
    );
}

export default App;