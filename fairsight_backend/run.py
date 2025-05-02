#!/usr/bin/env python
"""
Run script for the FairSight backend server.
"""

import os
import subprocess
import sys
import webbrowser

def main():
    """Run the FairSight backend server."""
    print("Starting FairSight Backend Server...")
    
    # Activate the virtual environment
    if sys.platform == 'win32':
        activate_script = os.path.join('venv', 'Scripts', 'activate')
    else:
        activate_script = os.path.join('venv', 'bin', 'activate')
    
    # Check if we need to run migrations
    print("Checking for pending migrations...")
    subprocess.run([sys.executable, 'manage.py', 'makemigrations'], check=True)
    subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
    
    # Run the server
    print("Starting server on http://localhost:8000/")
    subprocess.run([sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'])
    
if __name__ == '__main__':
    main() 