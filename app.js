//
// Yes this is ugly. I don't know JavaScript.
// Feel free to make a PR.
//

function App() {
    const intercitySearchURL = 'https://www.intercity.pl/en/site/for-passengers/information/journey-planner.html';
    const stations = [
        // Find more station IDs here:
        // https://rozklad-pkp.pl/station/search?term=[STATION-NAME]
        // {name: 'Berlin (all)',       id: '8096003'},
        // {name: 'Warszawa (all)',     id: '5196003'},
        // {name: 'Krakow (all)',       id: '5196001'},
        {name: 'Berlin Hauptbahnhof', id: '8011160'},
        {name: 'Berlin Ost',          id: '8010255'},
        {name: 'Warszawa Centralna',  id: '5100065'},
        {name: 'Warszawa Zachodnia',  id: '5100067'},
        {name: 'Krakow Główny',       id: '5100028'},
    ];


    const populateStations = function() {
        stations.forEach(function(station) {
            $('select').append(new Option(station.name, station.id));
        })
    }

    const loadFrameWithParams = function(searchString) {
        $('#intercity-frame')[0].src = intercitySearchURL + searchString;
    }

    const setButtonLoading = function(loading) {
        const buttonTitle = (loading == true) ? 'Loading…' : 'Search';
        $('#search').text(buttonTitle);
    }

    const updateUIFromURLParams = function() {
        const urlParams = new URLSearchParams(window.location.search);

        const start = urlParams.get('stid[0]');
        const end   = urlParams.get('stid[1]');
        const date  = urlParams.get('date');
        const time  = urlParams.get('time');

        // min date
        const now = new Date();
        const todayISO = now.toISOString().substr(0,10);
        $('#date').attr('min', todayISO);

        const tomorrow = new Date(now.getTime() + 24*3600*1000);
        const tomorrowISO = tomorrow.toISOString().substr(0,10);

        // Set UI from URL params, or use default values
        $('#start').val(start || stations[0].id);
        $('#end')  .val(end   || stations[2].id);
        $('#date') .val(date  || tomorrowISO)
        $('#time') .val(time  || '12:00');
    }
    
    $(document).ready(function() {
        populateStations();
        updateUIFromURLParams();
    })


    $('#search').on('click', function (e) {
        const urlParams = new URLSearchParams();
        urlParams.set('stid[0]', $('#start').val());
        urlParams.set('stid[1]', $('#end').val());
        urlParams.set('date', $('#date').val());
        urlParams.set('time', $('#time').val());
        urlParams.set('search', '1');

        const searchString = '?' + urlParams.toString();
        setButtonLoading(true);
        loadFrameWithParams(searchString);
    })

    $('#intercity-frame').on('load', function(e) {
        setButtonLoading(false);
    })
}
App();