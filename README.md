# Dublin-Bus-Api
A quick webapp that scrapes rtpi.ie and gives you bus realtime API
#####To get Started
clone and:
```
npm install
```
then:
```
node app.js
```

App runs on
```
http://localhost:8081
```

#### Example app

http://104.131.89.50:8081/


There is a quick example 'dash' as well (work in progress) that runs on angularjs and displays all the stuff


btw, need to fix controllers, if you are not running it locally, as the calls ar made to localhost.

###API

#####Get all bus routes

http://104.131.89.50:8081/stops

```
/stops
```
Here, to scrape this one, takes a while, so i am not using it in production. When making this call, the response is written to `output.json` and you can serve a static file with bus routes.
In the example 'dash', i am serving up a file in `/public/files/buses.json`.

#####Example response `/stops`

```
{
    "busNo": [
        {
            "route": "1",
            "destination": "Santry (Shanard Rd.) Towards Sandymount (St. John's Church)"
        },
        {
            "route": "4 ",
            "destination": "From Harristown Towards Monkstown Avenue "
        }
    ]
}
```
#####Get all stops from a route
```
/route/:route/:direction
```

where `:route` is a bus number and `:direction` is either `I` for 'inbound' or `O` for outbound
#####Example response `/route/1/O`

http://104.131.89.50:8081/route/1/O

```
{
    "info": [
        {
            "stopNr": "226",
            "stopName": "Shanard Road, Shanard Avenue"
        },
        {
            "stopNr": "228",
            "stopName": "Shanliss Rd, Oldtown Avenue"
        }
    ]
}
````
#####Get real time bus info for a specific stop
```
/bus/:stopNo
```
where `:stopNo` is the number.



#####Example response `bus/748`

http://104.131.89.50:8081/bus/748

```

{
    "timeNow": "11:03",
    "bus": [
        {
            "busNo": "25B",
            "destination": "Merrion Sq",
            "timeDue": "4 Mins"
        },
        {
            "busNo": "39",
            "destination": "Burlington Road",
            "timeDue": "5 Mins"
        }
    ]
}
```

Thats about it at the moment.

##### Working on:

At the moment i am adding luas RTPI here as well. App at the moment might run into some errors.
At the moment available calls:

```
/luas/:stopName/:direction
```

Where `:stopName` is stops shortname. You can find them in `/files/red.json` and `/files/green.json`. 
`:direction` is not working at the moment, but is required to do the call, you can put there whatever you want.

####Example response `/luas/BAL/I`

http://104.131.89.50:8081/luas/BAL/I

```
{
  "inbound": [
    {
      "first": {
        "duemins": "6",
        "destination": "St. Stephen's Green"
      },
      "second": {
        "duemins": "18",
        "destination": "St. Stephen's Green"
      }
    }
  ],
  "outbound": [
    {
      "first": {
        "duemins": "1",
        "destination": "Brides Glen"
      },
      "second": {
        "duemins": "10",
        "destination": "Brides Glen"
      }
    }
  ]
}
```

##### By the way:

This project of mine is in no way affiliated with Dublin Bus or the providers of the RTPI service.

I can't guarantee anything. May break at any time.
