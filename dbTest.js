// This is a testing file, not a part of the project

const net = require('net');
const socket = new net.Socket();

socket.connect(4047, 'localhost', () => {
    console.log('Connected to server');
});

socket.on('data', (data) => {
    if (!data) {
        console.log('No data received');

        socket.end();
    } else {
        const message = data.toString();
        if (message.includes('auth') && JSON.parse(data).auth) {
            const credentials = {
                password: 'your_db_password',
                database: 'your_db_name'
            };
            let auth = JSON.parse(data).auth;

            if (auth == "required") {
                socket.write(JSON.stringify({
                    auth: credentials
                }));
            } else {
                const nonBuffer = Buffer.from(message).toString();
                auth = JSON.parse(nonBuffer).auth;
                isQuery = JSON.parse(nonBuffer).query;

                if (auth && !isQuery) {
                    console.log('Authentication successful');

                    socket.write(JSON.stringify({
                        database: credentials.database,
                        query: `
                            IF TABLE EXISTS your_table_name THEN
                                SELECT * FROM your_table_name
                            ELSE
                                CREATE TABLE your_table_name (id INT PRIMARY KEY, name VARCHAR(255))
                            END IF
                        `
                    }));
                } else if (isQuery) {
                    console.log('Query successful', JSON.parse(nonBuffer).data);
                } else {
                    console.log('Authentication failed', nonBuffer);
                    socket.end();
                }
            }
        } else {
            console.log('Authentication failed', message);
            socket.end();
        }
    }
});