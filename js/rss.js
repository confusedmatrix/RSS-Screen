// List the feeds you want to use here
var feeds = [
    'http://digg.com/rss/top.rss',
    'https://news.ycombinator.com/rss',
    'http://www.reddit.com/.rss'
];

$(document).ready(function() {

    var x2js = new X2JS(); // XML to JSON (and vice versa) library
    var items = []; // master items
    var completed = 0; // number of feed donwloads completed
    var current = 0; // index of current feed item

    // download feeds and add individual items to master items
    feeds.forEach(function(feed) {
        $.get('get-feed.php', {feed: feed}, function(xml_str) {

            // convert xml to json
            var json = x2js.xml_str2json(xml_str);

            if (!json.rss) {
                
                console.log('Could not fetch RSS feed or malformed feed for: ' + feed);

            } else {

                // add source to each item and add each item to master items
                json.rss.channel.item.forEach(function(item) {
                    item.site = json.rss.channel.title;
                    items.push(item);
                });

            }

            completed += 1;

        });
    });

    // check all feeds have completed downloading
    var t = setInterval(checkAJAXCompleted, 100);
    var s;
    function checkAJAXCompleted() {
        if (completed == feeds.length) {
            clearInterval(t);

            // randomise order of the items
            items = shuffle(items);

            // load the first item and start interval to load subsequent items
            loadItem();
            s = setInterval(run, 10 * 1000);
        }
    }

    // fade out previous item and load the next one
    function run() {
        $('a').fadeOut(800, function() {
            $(this).remove();
        });
        loadItem();
    }

    // fade in each subsequent item when called
    function loadItem() {
        if (current >= items.length) current = 0;
        if (current < 0) current = items.length -1;
        var item = items[current];

        var vertical = Math.round(Math.random()) ? 'top' : 'bottom';
        var horizontal = Math.round(Math.random()) ? 'left' : 'right';

        var elm = document.createElement('a');
        $(elm).addClass('title')
              .prop('href', item.link)
              .css(vertical, (Math.floor(Math.random() * window.innerHeight))/2)
              .css(horizontal, (Math.floor(Math.random() * window.innerWidth))/2)
              .text(item.title)
              .fadeIn(800)
              .appendTo($('body'));

        $(elm).append('<br />');

        var attr = document.createElement('span');
        $(attr).text(item.site)
               .addClass('attr')
               .fadeIn(1500)
               .appendTo($(elm));

        current += 1;
    }

    // handle keypress events (skip back or forward through items)
    $(document).on('keydown', function(e) {
        
        key = e.which;
        // 37 = left arrow, 39 right arrow
        if (key == 37 || key == 39) {

            if (key == 37) current -=2;
            
            clearInterval(s);

            run();
            s = setInterval(run, 10 * 1000);

        }
    });
    
});

// utility shuffle function 
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}