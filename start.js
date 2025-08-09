#!/usr/bin/env node

/**
 * Railway Deployment Entry Point
 * This file ensures Railway starts the backend server correctly
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting GymIA Backend Server...');

// Change to server directory and start the application
const serverPath = path.join(__dirname, 'server');
process.chdir(serverPath);

// Start the server
const server = spawn('npm', ['start'], {
  stdio: 'inherit',
  cwd: serverPath
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🛑 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});
