import * as zmq from "zeromq";

function zeropad(num, pad) 
{
    return num.toString().padStart(pad, "0");
}

function rand(upper, extra) 
{
    const num = Math.abs(Math.round(Math.random() * upper));
    return num + (extra || 0);
}

async function runServer(port)
{
    const publisher = new zmq.Publisher();

    // Await is needed in this 0MQ version
    await publisher.bind(`tcp://*:${port}`);
    // According to 0MQ guide, doesn't work in Windows
    await publisher.bind("ipc://weather.ipc");

    while (true) 
    {
        // Get values that will fool the boss
        const zipcode     = rand(Math.pow(10, port % 10));
        const temperature = rand(90, -30);
        const relhumidity = rand(50, 10);
        const update      = `${zeropad(zipcode, port % 10)} ${temperature} ${relhumidity}`;
        await publisher.send(update);
    }
}

const args = process.argv.slice(2);

runServer(args.length > 0 ? args[0] : 5555);