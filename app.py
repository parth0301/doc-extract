from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import re

app = Flask(__name__)
CORS(app)

reader = easyocr.Reader(['en'])

@app.route('/extract-info', methods=['POST'])
def extract_info():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    result = reader.readtext(file.read())

    full_text = " ".join([detection[1] for detection in result])

    # Define regex patterns for fields
    name_pattern = r"Name:\s*(.+)"
    validity_pattern = r"Validity\(NT\)\s*([\d-]+)"
    document_number_pattern = r"(MH03\s*\d+)"

    info = {
        "name": re.search(name_pattern, full_text),
        "validity_nt": re.search(validity_pattern, full_text),
        "document_number": re.search(document_number_pattern, full_text)
    }

    # Extracting data
    info["name"] = info["name"].group(1).strip() if info["name"] else None
    info["validity_nt"] = info["validity_nt"].group(1).strip() if info["validity_nt"] else None
    info["document_number"] = info["document_number"].group(1).strip() if info["document_number"] else None

    return jsonify(info)

if __name__ == '__main__':
    app.run(debug=True)