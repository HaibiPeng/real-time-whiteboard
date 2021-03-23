# real-time-whiteboard
Course assignment for ELEC-E7320 - Internet Protocols

# Option 2 by Group X

# How to run the app
Run these commands in terminal:
## clone repository and install dependencies
1. git clone --branch final-version https://github.com/HaibiPeng/real-time-whiteboard.git
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
2. npm run dev <password> **or** node index.js <password>
* Note: The <password> is used to connect to the whiteboard at the Join page
### In the browser:
3. Enter http://localhost:3000 and press enter, and you should see the Join page
4. Enter your username and click JOIN
5. Start drawing!
