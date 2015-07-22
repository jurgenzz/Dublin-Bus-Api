# Dublin-Bus-Api
A quick webapp that scrapes rtpi.ie and gives you bus realtime API
# Get Started
clone and 
```
npm install
```
App runs on
```
http://localhost:8081
```
There is a quick example 'dash' (work in progress) that runs on angularjs and displays all the stuff

Access:
```
http://localhost:8081/dash/index#/home
```


#API

Call:
```
http://localhost:8081/bus/:stopNo
```
Example response:

```
{
    "timeNow": "13:07",
    "nextBus": [
        [
            "",
            "",
            ""
        ],
        [
            "1",
            "Shanard Road",
            "7 Mins"
        ],
        [
            "16",
            "Dublin Airport",
            "8 Mins"
        ],
        [
            "11",
            "Wadelai Pk",
            "12 Mins"
        ],
        [
            "16",
            "Dublin Airport",
            "18 Mins"
        ],
        [
            "1",
            "Shanard Road",
            "22 Mins"
        ],
        [
            "16",
            "Dublin Airport",
            "26 Mins"
        ],
        [
            "44",
            "DCU",
            "39 Mins"
        ],
        [
            "11",
            "Wadelai Pk",
            "40 Mins"
        ]
    ]
}
```

# To Do 

need to make this response pretty
