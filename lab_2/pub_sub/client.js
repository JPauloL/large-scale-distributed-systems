import * as zmq from "zeromq";

async function receiveWeatherUpdates(subscriber, results)
{
    for await (const data of subscriber) 
    {
        var pieces      = data.toString().split(" ")
        , zipcode     = parseInt(pieces[0], 10)
        , temperature = parseInt(pieces[1], 10)
        , relhumidity = parseInt(pieces[2], 10);

        results[zipcode].temps += 1;
        results[zipcode].total_temp += temperature;

        if (results[zipcode].temps == 100)
        {
            console.log([
                "Average temperature for zipcode '",
                zipcode,
                "' was ",
                (results[zipcode].total_temp / results[zipcode].temps).toFixed(2),
                " ºC"].join(""));

            subscriber.unsubscribe(zipcode.toString() + " ");
            delete results[zipcode];

            break;
        }

        if (Object.keys(results).length == 0)
        {
            break;
        }
    }
}

async function runClient(filters)
{
    console.log("Collecting updates from weather server...");

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
        // Socket to talk to server
        var subscriber = new zmq.Subscriber();

        subscriber.connect(`tcp://localhost:555${filter.toString().length.toString()}`);

        console.log(filter);
        subscriber.subscribe(filter + " ");

        zip_temps[filter] = {};

        zip_temps[filter].total_temp = 0;
        zip_temps[filter].temps = 0;

        // This works because there are no concurrent updates, otherwise some 
        // kind of synchronization would need to be put in place
        receiveWeatherUpdates(subscriber, zip_temps);
    }
}

const filters = process.argv.slice(2);

runClient(filters.length > 0 ? filters : []);