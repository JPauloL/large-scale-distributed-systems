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

async function runServer(proxy_port, n)
{
    const publisher = new zmq.Publisher();

    // Await is needed in this 0MQ version
    publisher.connect(`tcp://localhost:${proxy_port}`);

    while (true) 
    {
        // Get values that will fool the boss
        const zipcode     = rand(Math.pow(10, n));
        const temperature = rand(90, -30);
        const relhumidity = rand(50, 10);
        const update      = `${zeropad(zipcode, n)} ${temperature} ${relhumidity}`;
        await publisher.send(update);
    }
}

const args = process.argv.slice(2);

runServer(5555, args.length > 0 ? args[0] : 5);