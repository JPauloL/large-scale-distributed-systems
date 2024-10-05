import * as zmq from "zeromq";

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

async function runClient(ports)
{  
    console.log('Connecting to hello world server…');

    //  Socket to talk to server
    const sock = new zmq.Request();

    for (let port of ports)
    {
        console.log(port)
        sock.connect(`tcp://localhost:${port}`);
    }
  
    for (let i = 0; i < 10; i++) 
        {
        console.log('Sending Hello ', i);
        await sock.send(`Hello ${i}`);

        const [result] = await sock.receive();
        console.log('Received ', result.toString(), i);
    }
}

const ports = process.argv.slice(2);

runClient(ports.length > 0 ? ports : [5555]);