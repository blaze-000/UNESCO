from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
from check_marketing.main import CheckMarketing
import queue
from threading import Thread
import json
import uuid
import time

app = Flask(__name__)
CORS(app)

# Store active sessions and their progress queues
active_sessions = {}

@app.route('/get_video/<video>', methods=['GET'])
def get_video(video):
    if not video:
        return jsonify({'status': 'failed to fetch video'}), 400
    
    return send_file(path_or_file=f"static/video/{video}.mp4", conditional=True)

@app.route('/start_verification', methods=['POST'])
def start_verification():
    """Start the verification process and return a session ID"""
    data = request.get_json()
    marketing_text = data.get("text")

    if not marketing_text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Generate unique session ID
    session_id = str(uuid.uuid4())
    
    # Create progress queue for this session
    progress_queue = queue.Queue()
    active_sessions[session_id] = {
        'queue': progress_queue,
        'text': marketing_text,
        'started': False
    }
    
    return jsonify({'session_id': session_id})

@app.route('/stream_progress/<session_id>', methods=['GET'])
def stream_progress(session_id):
    """Stream progress updates for a specific session"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session ID'}), 404
    
    session = active_sessions[session_id]
    progress_queue = session['queue']
    
    def generator():
        # Start the verification if not already started
        if not session['started']:
            session['started'] = True
            
            def progress_callback(message):
                progress_queue.put(message)
            
            def run_check():
                try:
                    result = CheckMarketing(session['text'], progress_callback)
                    progress_queue.put({'final_result': result})
                except Exception as e:
                    progress_queue.put({'error': str(e)})
                finally:
                    progress_queue.put(None)  
            
            Thread(target=run_check, daemon=True).start()

        # Stream the progress
        while True:
            try:
                # Use timeout to prevent blocking indefinitely
                message = progress_queue.get(timeout=30)
                
                if message is None:
                    # Cleanup session
                    if session_id in active_sessions:
                        del active_sessions[session_id]
                    break

                if isinstance(message, dict) and 'final_result' in message:
                    yield f"data: {json.dumps({'type': 'result', 'content': message['final_result']})}\n\n"
                elif isinstance(message, dict) and 'error' in message:
                    yield f"data: {json.dumps({'type': 'error', 'content': message['error']})}\n\n"
                else:
                    yield f"data: {json.dumps({'type': 'progress', 'content': str(message)})}\n\n"
                    
            except queue.Empty:
                # Send keep-alive message
                yield f"data: {json.dumps({'type': 'progress', 'content': 'Processing...'})}\n\n"
                continue
            except Exception as e:
                yield f"data: {json.dumps({'type': 'error', 'content': f'Stream error: {str(e)}'})}\n\n"
                break
    
    response = Response(generator(), mimetype='text/event-stream')
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['Connection'] = 'keep-alive'
    return response

# Cleanup old sessions periodically after 1 one
def cleanup_sessions():
    current_time = time.time()
    sessions_to_remove = []
    
    for session_id, session in active_sessions.items():
        # If session is older than 1 hour, mark for removal
        if current_time - session.get('created_at', current_time) > 3600:
            sessions_to_remove.append(session_id)
    
    for session_id in sessions_to_remove:
        if session_id in active_sessions:
            del active_sessions[session_id]

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)