# real-time-whiteboard(currently still under development)
course assignment for ELEC-E7320 - Internet Protocols

# A simple demo link
https://real-time-white-board.herokuapp.com/

# How to run the app
Run these commands in terminal:
## clone repository and install dependencies
1. git clone https://github.com/HaibiPeng/real-time-whiteboard.git
### In one ternimal:
2. cd real-time-whiteboard/client
3. npm install
4. npm audit fix(and add **--force** opion at the end if needed)
### In another terminal:
5. cd real-time-whiteboard/server
6. npm install
7. npm audit fix(and add **--force** opion at the end if needed)

## run the app
### In client ternimal:
1. npm start
### In server ternimal:
2. npm run dev(using nodemon) **or** node index.js
### In the browser:
3. Enter http://localhost:3000 and press enter, and you should see the Join page
4. Enter your username and click JOIN
5. Start drawing!
