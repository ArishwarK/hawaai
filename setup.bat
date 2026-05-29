@echo off
cd C:\Users\ARISHWAR\.gemini\antigravity\scratch
echo Creating vite app...
call npm create vite@latest hawaiian-app -- --template react
cd hawaiian-app
echo Installing dependencies...
call npm install
call npm install react-router-dom framer-motion lucide-react
call npm install -D tailwindcss postcss autoprefixer
call npx.cmd tailwindcss init -p
echo Setup completely finished.
