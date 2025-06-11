# car-dashboard
Real time car dashboard from OBD-II adapter

## Initial thoughts and project structure
I want to use web sockets and the OBD2 watch commands to read real time data from my car. For now I want 2 different screens. A screen that shows SPEED, RPM, GEAR SHIFT POSITION, and any other commmon driving essentials. The second dashboard will show engine live engine diagnostics such as BOOST, ENGINE PRESSURE and others. 

How many web sockets do I need to create? Do I need to create a web socket for each watch command or can I create a web socket for each dashboard.

I definitely only want to initialize one connection to the OBD that will be shared in the python server

OPTION 1:

                 |--- Watch(RPM)--------------->|
                 |--- Watch(SPEED) ------------>| ---> Web socket() -----> Client
                 |--- Watch(GEAR_POSITION) ---->|
OBD_connection --
                 |--- Watch(BOOST) ------------>|
                 |--- Watch(ENGINE_PRESSURE)--->| ---> Web socket() -----> Client

OPTION 2:

                 |--- Watch(RPM)--------------->| ---> Web socket() -----> Client
                 |--- Watch(SPEED) ------------>| ---> Web socket() -----> Client
                 |--- Watch(GEAR_POSITION) ---->| ---> Web socket() -----> Client
OBD_connection --
                 |--- Watch(BOOST) ------------>| ---> Web socket() -----> Client
                 |--- Watch(ENGINE_PRESSURE)--->| ---> Web socket() -----> Client

I am leaning towards option 2. The backend is supposed to be completely separate from the front end so each OBD watch command should be separated and operate on its own. The allows for more modularity in the future and customizability for the dashboard.

How do we control the race condition for when multiple connections are attempting to start and stop the OBD connection thread?
- RACE CONDITION NOTES

## Resources
https://python-obd.readthedocs.io/en/latest/