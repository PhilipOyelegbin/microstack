import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    content = data.get('content', '')
    
    # Lightweight pseudo-summarization logic (Take first 60 characters)
    summary = content[:60] + "..." if len(content) > 60 else content
    
    return jsonify({"summary": summary})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5001)))