import * as zmq from "zeromq";

async function runClient(port, filters)
{
    console.log("Collecting updates from weather server...");

    // Socket to talk to server
    var subscriber = new zmq.Subscriber();

    subscriber.connect(`tcp://localhost:${port}`);

    // Subscribe to zipcode, default is NYC, 10001
    // var filter = null;

    if (filters === null || filters.length === 0)
    {
        filters = ["10001"];
    }

    // process 100 updates
    var zip_temps = {};

    for (const filter of filters)
    {
        console.log(filter);
        subscriber.subscribe(filter + " ");

        zip_temps[filter] = {};

        zip_temps[filter].total_temp = 0;
        zip_temps[filter].temps = 0;
    }


    for await (const data of subscriber) 
    {
        var pieces      = data.toString().split(" ")
        , zipcode     = parseInt(pieces[0], 10)
        , temperature = parseInt(pieces[1], 10)
        , relhumidity = parseInt(pieces[2], 10);

        zip_temps[zipcode].temps += 1;
        zip_temps[zipcode].total_temp += temperature;

        if (zip_temps[zipcode].temps == 100)
        {
            console.log([
                "Average temperature for zipcode '",
                zipcode,
                "' was ",
                (zip_temps[zipcode].total_temp / zip_temps[zipcode].temps).toFixed(2),
                " ºC"].join(""));

            subscriber.unsubscribe(zipcode.toString() + " ");
            delete zip_temps[zipcode]; 
        }

        if (Object.keys(zip_temps).length == 0)
        {
            break;
        }
    }

    subscriber.close();
}

const filters = process.argv.slice(2);

runClient(5556, filters.length > 0 ? filters : []);