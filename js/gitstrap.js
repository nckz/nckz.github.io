/* GitStrap.js 
 * requires:
 *  jQuery 1.12.0
 *  bootstrap 3.3.6
 *  showdown 1.3.0
 *  showdown/prettify-extension 1.3.0
 *  js-yaml-front-client 3.4.0
 *  google/code-prettify 9c373
 *  jmblog/color-themes-for-google-code-prettify be5aa
 */

/* GLOBAL ------------------------------------------------------------------ */

/* js */
var gs_jquery_url = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js";
var gs_bootstrap_url = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js";
var gs_showdown_url = "https://cdn.rawgit.com/showdownjs/showdown/1.3.0/dist/showdown.min.js";
var gs_showdown_prettify_url = "https://cdn.rawgit.com/showdownjs/prettify-extension/1.3.0/dist/showdown-prettify.min.js";
var gs_jsyaml_url = "https://cdn.rawgit.com/dworthen/js-yaml-front-matter/v3.4.0/dist/js-yaml-front-client.min.js";
var gs_googleprettify_url = "https://cdn.rawgit.com/google/code-prettify/9c3730f40994018a8ca9b786b088826b60d7b54a/src/prettify.js";
var gs_scripts = [gs_jquery_url, gs_bootstrap_url, gs_showdown_url, gs_jsyaml_url, gs_showdown_prettify_url, gs_googleprettify_url];

/* css */
var gs_default_theme_url = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css";
var gs_googleprettify_css_url = "https://cdn.rawgit.com/google/code-prettify/9c3730f40994018a8ca9b786b088826b60d7b54a/src/prettify.css";

/* configurable elements */
var gsConfig; //new Config('Config');
var gs_blog_keyword = 'GSBLOG';
var gs_post_path = 'posts';

/* object ids */
var gs_error_id = 'gs_error_id';
var gs_footer_id = 'gs_footer_id';
var gs_header_id = 'gs_header_id';
var gs_body_id = 'gs_body_id';
var gs_ribbon_id = 'gs_ribbon_id';
var gs_nav_title_id = 'gs_nav_title_id';
var gs_title_id = 'gs_title_id';
var gs_nav_placeholder_id = 'gs_nav_placeholder_id';
var gs_navbar_id = 'gs_navbar_id';
var gs_config_cnt = 0; // make sure the tag id is unique
var gs_ga_script_id = 'gs_ga_script_id';
var gs_pagination_links_id = 'gs_pagination_links_id';
var gs_pagination_div_id = 'gs_pagination_div_id';

/* Required JS ------------------------------------------------------------- */
/* This section will load all the required javascript determined above then
 * start the 'main' function. */
function getScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // most browsers
    script.onload = callback;
    // IE 6 & 7
    script.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            callback();
        }
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}

function loadAndExecuteScripts(aryScriptUrls, index, callback) {
    getScript(aryScriptUrls[index], function () {
        if(index + 1 <= aryScriptUrls.length - 1) {
            loadAndExecuteScripts(aryScriptUrls, index + 1, callback);
        } else {
            if(callback)
                callback(aryScriptUrls, index);
        }
    });
}

/* load js deps */
loadAndExecuteScripts(gs_scripts, 0, gs_jq_start);

/* GITSTRAP VERSION -------------------------------------------------------- */
/* This will change the url string to point to the selected version of
 * GitStrap. The version
 */
var gs_version = ''

/* HEAD TAG ---------------------------------------------------------------- */
var gs_html_head_tag = ' \
    <meta charset="utf-8"> \
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
    <!-- Google Analytics --> \
    <script id="gs_ga_script_id"></script> \
    <meta name="viewport" content="width=device-width, initial-scale=1">';

/* BODY TAG ---------------------------------------------------------------- */
var gs_html_body_tag = ' \
 \
<!-- GitHub ribbon --> \
<a href="https://github.com/nckz/GitStrap"><img style="display: none; position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" id="gs_ribbon_id"></a> \
 \
<title id="gs_title_id">GitStrap</title> \
 \
<div class="container"> <!-- all page content --> \
    <!-- Navigation --> \
    <nav class="navbar"> \
        <div class="container-fluid"> \
            <div class="navbar-header"> \
                <button type="button" class="navbar-toggle" type="button" \
                    data-toggle="collapse" \
                    data-target="#gs_navbar_id"> \
                    &#9776; \
                </button> \
                <h2 class="text-muted" id="gs_nav_title_id">GitStrap</h2> \
            </div><!-- navbar-header --> \
            <div class="collapse navbar-collapse navbar-right" id="gs_navbar_id"> \
                <ul class="nav navbar-nav" id="gs_nav_placeholder_id"></ul> \
            </div> \
        </div><!-- container-fluid --> \
    </nav> \
    <!-- Error --> \
    <div class="jumbotron" id="gs_error_id" style="display: none; color: red;"></div> \
    <!-- Running Header --> \
    <div class="jumbotron" id="gs_header_id" style="display: none;"></div> \
    <!-- Markdown Content --> \
    <div id="gs_body_id"></div> \
    <!-- Pagination Links --> \
    <div id="gs_pagination_div_id" style="display: none;"> \
        <nav> \
        <ul class="pagination" id="gs_pagination_links_id"> \
        </ul> \
        </nav>  \
    </div> \
    <!-- Disqus Comments --> \
    <div id="disqus_thread"></div> \
    <!-- Running Footer--> \
    <hr> \
    <footer class="footer text-center" id="gs_footer_id" style="display: none;"> \
    </footer> \
</div> <!-- /container -->';

/* STYLE TAG --------------------------------------------------------------- */
var gs_html_style_tag = ' \
/* give an option for centering images */ \
img[alt=centerImage] { float: center; display: block; margin-left: auto; margin-right: auto } \
/* markdown extras - Use these "fitw<%>" attributes for the alt text to scale an image */ \
img[alt=fitwidth] { width: 100%; float: center; display: block; margin-left: auto; margin-right: auto } \
img[alt=fitw100] { width: 100%; float: center; display: block; margin-left: auto; margin-right: auto} \
img[alt=fitw75] { width: 75%; float: center; display: block; margin-left: auto; margin-right: auto} \
img[alt=fitw50] { width: 50%; float: center; display: block; margin-left: auto; margin-right: auto} \
img[alt=fitw25] { width: 25%; float: center; display: block; margin-left: auto; margin-right: auto} \
img[alt=fitw10] { width: 10%; float: center; display: block; margin-left: auto; margin-right: auto} \
 /* make an "active" tab */ \
 .non-active-nav { \
     -webkit-filter: opacity(75%); /* Chrome, Safari, Opera */ \
         filter: opacity(75%); \
 } ';

/* HELPER FUNCTIONS -------------------------------------------------------- */
/* determine if a string object is blank */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

/* add a style tag from a string */
function setStyleFromString(csstext) {
    var head  = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        style.stylesheet = csstext;
    } else {
        style.appendChild(document.createTextNode(csstext));
    }

    head.appendChild(style);
}

/* download a css file and install it as a stylesheet, then run the callback.*/
function getCSS(url, callback) {
    var setcss = function (csstext) {
        setStyleFromString(csstext);
        if(callback)
            callback();
    };

    getFile(url, setcss);
}

/* A file getter that will push the text of a file to the callback function and
 * generate and fetching errors to a tagged div on the index.html. */
function getFile(filename, callback, async) {
    var async = typeof async !== 'undefined' ?  async : true;

    /* If the config file can be downloaded send its text to the callback.
        */
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.status==200 && req.readyState==4) {
            callback(req.responseText);
        } else if((req.status==404 || req.status==403 || req.status==0) && req.readyState==4) {
            var err_txt = 'ERROR: '+req.status+', When requesting: "' + filename + '"';
            fillDiv(err_txt, gs_error_id);
            console.log(err_txt);
            $('body').fadeIn(667);
        }
    };

    req.open('GET',filename,async);
    req.send();

} // - getFile()

/* Add a value to an existing attribute. */
function appendAttribute(elem, name, value) {
    var attr = elem.getAttribute(name);
    if (attr == null) {
        elem.setAttribute(name, value);
    } else {
        elem.setAttribute(name, attr + " " + value);
    }
} // - appendAttribute()

/* Change the title div and 'title' tag to user config.*/
function setTitle(title) {
    document.getElementById(gs_title_id).innerHTML = title;
    document.getElementById(gs_nav_title_id).innerHTML = title;

    if (title == 'GitStrap') {
        document.getElementById(gs_ribbon_id).style.display = 'block';
    }
} // - setTitle()

/* Fill in the specified div innerHTML with the given text. */
function fillDiv(text, div){
    var node = document.getElementById(div);
    node.innerHTML = text;
    node.style.display = 'block';
}

/* parse input text using showdown plus plugins etc... */
function Showdown(text) {
    showdown_options = {
        parseImgDimensions: true,
        ghCodeBlocks: true,
        tables: true,
        extensions: ['prettify']
    }
    var converter = new showdown.Converter(showdown_options);
    return converter.makeHtml(text);
}

/* Download a markdown file, convert to HTML, then post to given div-id. */
function MarkdownToHTML(relpath, markdown_div)
{
    var callback = function (text) {
        html = Showdown(text);
        fillDiv(html, markdown_div);
        $('.linenums').removeClass('linenums');
        prettyPrint();
    };
    getFile(relpath, callback);
}

/* pass Markdown text as a string to convert to HTML, then post to given
 * div-id. */
function PrettyMarkdownTextToHTML(text, markdown_div)
{
    html = Showdown(text);
    fillDiv(html, markdown_div);
    $('.linenums').removeClass('linenums');
    prettyPrint();
}

/* download, translate and dump the text to the body tag */
function MarkdownFileToBody(filename)
{
    var callback = function (text) {
        //html = Showdown(text);
        fillDiv(text, gs_body_id);
    }
    getFile(filename, callback, true);
}

/* Download a post file (yaml + markdown), parse YAML, convert to HTML, then
 * post to given div-id. */
function PostToHTML(relpath, markdown_body) {
    var callback = function (text) {

        /* circumvent github's auto-meta parsing */
        text = text.replace("(((",'---');
        text = text.replace(")))",'---');

        /* write some HTML to format the data */
        var body = document.getElementById(markdown_body);
        var post_head = document.createElement('div');
        var post_body = document.createElement('div');
        body.appendChild(post_head);
        body.appendChild(post_body);

        if ((isBlank(text)) || (text == null) || (text == 'null') || (typeof text === 'undefined')) {
            post_head.innerHTML = 'Unable to load text for: '+relpath;
            return;
        }

        /* parse YAML header */
        var obj = jsyaml.loadFront(text)

        /* check for post meta data */
        var date = typeof obj.Date !== 'undefined' ?  obj.Date.toDateString() : '';
        var author = typeof obj.Author !== 'undefined' ?  obj.Author : '';
        var summary = typeof obj.Summary !== 'undefined' ?  obj.Summary : '';
        var title = typeof obj.Title !== 'undefined' ?  obj.Title : '';

        /* write some HTML to format the data */
        post_head.innerHTML = '<b>'+title+'</b><br> &nbsp; &nbsp; '+author+
                              ' | <small>'+date+'</small><br><br>';

        /* convert the unparsed content as markdown */
        post_body.innerHTML = Showdown(obj.__content);
        $('.linenums').removeClass('linenums');
        prettyPrint();
    };
    getFile(relpath, callback);
}

/* Google Analytics */
function sendGoogleAnalytics(ga_tracker_id) {

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments) },i[r].l=1*new Date();
      a=s.createElement(o),m=s.getElementById(gs_ga_script_id);a.async=1;
      a.src=g;m.parentNode.insertBefore(a,m)})
      (window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', ga_tracker_id, 'auto');
    ga('send', 'pageview');
}

/* Disqus Comments */
function showDisqusComments(DISQUS_SHORTNAME) {
    /*
    var disqus_config = function () {
        this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    (function() {  // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        
        s.src = '//'+DISQUS_SHORTNAME+'.disqus.com/embed.js';
        
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
}

/* OBJECTS ----------------------------------------------------------------- */
/* Config object
 * 'Config' file parser object */
function Config(filename) {

    var self = this;

    this.filename = filename
    this.title = "";      // string
    this.nav_items = [];  // list of string, filenames/nav-tab-titles
    this.nav_items_bname = []; // list of nav items with chosen blog index name
    this.theme = "";      // string theme-name or url
    this.header = "";     // string filename
    this.footer = "";     // string filename
    this.blog_items = []; // list of strings, filenames of posts
    this.requested_page = ""; // the client requested page based on url query
    this.post_active = false; // signal if a post is active, set by determineActivePage().
    this.ga_tracker_id = "false"; // Google Analytics Tracker ID
    this.disqus_shortname = "false"; // Disqus Site Shortname
    this.pagination = 0; // number of posts per page (0 means all posts on one)
    this.requested_blog_index_page = 1; // the URL query 'p='
    this.sitemap_active = false; // determine if the sitemap will be displayed

    this.parseFile = function (text) {

        /* Split the config file into options using the DOM. */
        var options = [];
        var converter = new showdown.Converter();
        var dummy = document.createElement('html');
        dummy.innerHTML = converter.makeHtml(text);
        code = dummy.getElementsByTagName('code');
        for( i=0; i<code.length;i++) {
            if (code[i].innerHTML.match(/^&gt;\S+/)) {
                /* remove '>' and replace new-line/line-breaks with a space */
                options.push(code[i].innerHTML.replace(/^&gt;/, '').replace(/\r?\n|\r/g,' ').trim());
            }
        }

        /*  1: title 
         *  2: nav filenames
         *  3: theme name or url
         *  4: header filename
         *  5: footer filename
         *  6: blog filenames
         *  7: code highlighting
         *  8: google analytics
         *  9: disqus shortname
         *  10: pagination
         */
        self.title = options[0];
        self.nav_items = options[1].split(/\s+/); // split on whitespace
        self.theme = self.resolveBootstrapThemeURL(options[2]);
        self.header = options[3];
        self.footer = options[4];
        self.blog_items = options[5].split(/\s+/); // split on whitespace
        self.code_theme = self.resolvePrettifyThemeURL(options[6]);
        self.ga_tracker_id = options[7];
        self.disqus_shortname = options[8];
        self.pagination = options[9];

        /* replace BLOG with blog name */
        self.nav_items_bname = self.nav_items.slice(); // copy
        var blog_index = self.nav_items_bname.indexOf(gs_blog_keyword);
        self.nav_items_bname[blog_index] = self.blog_items[0];

        self.determineActivePage();

    }; // - parseFile()

    this.headerIsActive = function() {
        return self.header != 'false';
    };

    this.footerIsActive = function() {
        return self.footer != 'false';
    };

    this.gaIsActive = function() {
        return self.ga_tracker_id != 'false';
    };

    this.disqusIsActive = function() {
        return self.disqus_shortname != 'false';
    };

    this.determineActivePage = function() {
        /* This function verifies whether the url query resolves to an existing
         * page. If not, the landing page is selected. If there is both a
         * requested page and post, the page takes precedence. */

        /* check if the sitemap is requested */
        self.sitemap_active = (self.getURLParameter('sitemap') == 'true');

        /* check for requested posts */
        var post_found = 0;
        var post_index = -1;
        var req_post = self.getURLParameter('post');
        if (! (req_post == 'null' || req_post == null)) {
            post_index = self.blog_items.indexOf(req_post);
            if (post_index > 0) { /* skip the post-index-page title (elem 0) */
                post_found = 1;
            }
        }

        /* pages take precedence */
        var page_found = 0;
        var page_index = -1;
        var reqPage = self.getURLParameter('page');
        if (! (reqPage == 'null' || reqPage == null)) {
            page_index = self.nav_items_bname.indexOf(reqPage);
            if (page_index >= 0) {
                page_found = 1;
            }

            /* if pagination is required then get the requested params */
            if (self.paginationIsActive()) {
                /* save any pagination query and check bounds */
                self.requested_blog_index_page = parseInt(self.getURLParameter('p'));
                if (!Number.isInteger(self.requested_blog_index_page)) {
                    self.requested_blog_index_page = 1;
                }
                if (self.requested_blog_index_page < 1) {
                    self.requested_blog_index_page = 1;
                }
            }
        }

        /* select page */
        active_page = self.nav_items_bname[0]; /* default landing page */
        if (post_found) {
            active_page = self.blog_items[post_index];
            self.post_active = true;
        }
        if (page_found) {
            active_page = self.nav_items_bname[page_index];
            self.post_active = false;
        }

        self.requested_page = active_page;
    };

    this.numBlogIndexPages = function() {
        return Math.ceil((self.blog_items.length-1) / self.pagination);
    };

    /* Parse the query string for 'name'. */
    this.getURLParameter = function(name) {
        return decodeURI((RegExp(name + '=' +
            '(.+?)(&|$)').exec(location.search)||[,null])[1]);
    };

    /* Return true if the user choose to blog, else false. */
    this.isBlog = function() {
        return (self.nav_items.indexOf(gs_blog_keyword) >= 0);
    };

    /* Return true if the blog index was requested */
    this.blogIndexIsActive = function() {
        if (self.isBlog()) {
            if (self.requested_page == self.blog_items[0]) {
                return true;
            }
        }
        return false;
    };

    this.paginationIsActive = function() {
        return ((self.pagination > 0) && (self.pagination <
                    (self.blog_items.length - 1))); // count the index page
    };

    this.postIsActive = function() {
        return self.post_active;
    };

    this.sitemapIsActive = function() {
        return self.sitemap_active;
    };

    this.valid_url = function(url) {
        return /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url);
    };

    this.resolvePrettifyThemeURL = function(theme) {

        /* determine where the theme is from */
        var who = 'jmblog';
        switch(theme) {
            case 'desert':
            case 'doxy':
            case 'sons-of-obsidian':
            case 'sunburst':
                who = 'google';
            break;
        }

        /* check for theme name or url */
        var direct_url = theme;
        var name_url = '';
        if (who == 'google') {
            name_url = 'https://cdn.rawgit.com/google/code-prettify/9c3730f40994018a8ca9b786b088826b60d7b54a/styles/' + theme + '.css';
        } else {
            name_url = 'https://cdn.rawgit.com/jmblog/color-themes-for-google-code-prettify/be5aa6fee61ad73f5a34ffb65099c8d1b3917602/dist/themes/' + theme + '.min.css';
        }

        /* check if this looks like a url */
        var theme_url = '';

        /* see if the user specifies the full url */
        if (self.valid_url(direct_url)) {
            theme_url = direct_url;
        }
        /* see if the user specified a bootswatch name */
        else if (self.valid_url(name_url)) {
            theme_url = name_url;
        }else{
            theme_url = gs_googleprettify_css_url;
        }

        return theme_url;
    };

    this.resolveBootstrapThemeURL = function(theme) {
        /* check for theme name or url */
        var direct_url = theme;
        var name_url = 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/' +
            theme + '/bootstrap.min.css';

        /* check if this looks like a url */
        var theme_url = '';

        /* see if the user specifies the full url */
        if (self.valid_url(direct_url)) {
            theme_url = direct_url;
        }
        /* see if the user specified a bootswatch name */
        else if (self.valid_url(name_url)) {
            theme_url = name_url;
        } else {
            theme_url = gs_default_theme_url;
        }

        return theme_url;
    };

    /* Initialize with Config data. This is the first required step for setting
     * up the website. -It is therefore required to be synchronous. */
    getFile(self.filename, self.parseFile, false);

} // - Config()

/* Sitemap object
 * Generates a simple sitemap text that can be pasted into a sitemap.txt file.
 */
function Sitemap(conf) {

    var self = this;

    this.conf = conf;
    this.baseurl = document.URL.split('?')[0];
    /* list the sitemap url */
    this.urls = [this.baseurl+'?sitemap=true'];
    this.text = '';

    this.listURLs = function() {

        /* get the full url for pages */
        for (index = 0; index < self.conf.nav_items.length; index++) {
            var item = self.conf.nav_items_bname[index]; // get link names
            self.urls.push(this.baseurl+'?page='+item);
        }

        /* get the full url for posts */
        for (index = 1; index < self.conf.blog_items.length; index++) {
            self.urls.push(this.baseurl+'?post='+self.conf.blog_items[index]);
        }
    };
    this.listURLs();

    this.generateText = function() {
        for (index = 0; index < self.urls.length; index++) {
            self.text += self.urls[index] + '<br>';
        }
    };
    this.generateText();

    this.links = function() {
        var lst = '';
        for (index = 0; index < self.urls.length; index++) {
            lst += '<a href='+self.urls[index]+'>'+self.urls[index]+'</a><br>';
        }
        return lst;
    };
}

/* Nav object 
 * Populates navbar based on user config. */
function Nav(conf) {

    var self = this;

    this.conf = conf;
    this.navbar_obj = document.getElementById(gs_nav_placeholder_id);

    /* The nav is a <ul> with items <li> and page links <a>. */
    this.genNavListTags = function() {

        for (index = 0; index < self.conf.nav_items.length; index++) {

            var li = document.createElement('li');
            var a  = document.createElement('a');
            var item = self.conf.nav_items_bname[index]; // get link names

            /* Select active page and nav buttons. Make nav items non-active
             * by default. */
            appendAttribute(a, 'class', 'non-active-nav');

            /* make the nav tab show up as 'active' by excluding it from
             * the non-active-nav class. */
            if (self.conf.requested_page == item) {
                a.removeAttribute('class');
                appendAttribute(li, 'class', 'active');
            }

            appendAttribute(li, 'id', 'navitem');
            appendAttribute(li, 'class', 'nav-item');

            /* setup nav links for each button */
            appendAttribute(a, 'class', 'nav-link');
            appendAttribute(a, 'href', '?page='+item+'#');
            appendAttribute(a, 'data-toggle','tab');

            /* make sure the ribbon doesn't get in the way */
            appendAttribute(a, 'style', 'z-index: 1000;');

            /* set nav button name */
            a.innerHTML = item;

            li.appendChild(a);
            self.navbar_obj.appendChild(li);
        }
    };
    this.genNavListTags();

} // - Nav()

/* PageNav object 
 * Populates pagination navbar based on user config. */
function PageNav(conf) {

    var self = this;

    this.conf = conf;
    this.pagination_ul = document.getElementById(gs_pagination_links_id);
    this.pagination_div = document.getElementById(gs_pagination_div_id);

    /* The nav is a <ul> with items <li> and page links <a>. */
    this.genNavListTags = function() {

        /* get number of pages */
        var numPages = self.conf.numBlogIndexPages();     
        var blogTitle = self.conf.blog_items[0];
        var reqPage = self.conf.requested_blog_index_page;

        /* setup "previous page" button */
        if (reqPage > 1) {
            var li = document.createElement('li');
            var a  = document.createElement('a');
            appendAttribute(a, 'href', '?page='+blogTitle+'&p='+(reqPage-1)+'#');
            a.innerHTML = "&laquo;";
            li.appendChild(a);
            self.pagination_ul.appendChild(li);
        }

        /* setup numbered page links */
        for (index = 1; index <= numPages; index++) {
            var li = document.createElement('li');
            var a  = document.createElement('a');

            appendAttribute(a, 'href', '?page='+blogTitle+'&p='+index+'#');

            /* set nav button name */
            if (index == reqPage) {
                a.innerHTML = "<em><b>"+index+"</b></em>";
            } else {
                a.innerHTML = index;
            }

            li.appendChild(a);
            self.pagination_ul.appendChild(li);
        }

        /* setup "next page" button */
        if (reqPage < numPages) {
            var li = document.createElement('li');
            var a  = document.createElement('a');
            appendAttribute(a, 'href', '?page='+blogTitle+'&p='+(reqPage+1)+'#');
            a.innerHTML = "&raquo;";
            li.appendChild(a);
            self.pagination_ul.appendChild(li);
        }

        this.pagination_div.style.display = 'block';
    };

    /* The nav is a <ul> with items <li> and page links <a>. */
    this.genPostNavListTags = function() {

        /* get current post */
        var reqPost = self.conf.getURLParameter('post');
        var index = self.conf.blog_items.indexOf(reqPost);

        /* setup "previous page" button */
        if (index > 1) {
            var li = document.createElement('li');
            var a  = document.createElement('a');
            appendAttribute(a, 'href', '?post='+self.conf.blog_items[index-1]);
            a.innerHTML = "&laquo;";
            li.appendChild(a);
            self.pagination_ul.appendChild(li);
        }

        /* setup "next page" button */
        if (index < (self.conf.blog_items.length-1)) {
            var li = document.createElement('li');
            var a  = document.createElement('a');
            appendAttribute(a, 'href', '?post='+self.conf.blog_items[index+1]);
            a.innerHTML = "&raquo;";
            li.appendChild(a);
            self.pagination_ul.appendChild(li);
        }

        this.pagination_div.style.display = 'block';
    };

} // - PageNav()

/* BlogIndex object 
 * Populates the blog index page. 
 *  -eventually pagination.
 */
function BlogIndex(conf) {

    var self = this;

    this.conf = conf;

    this.genBlogIndex = function() {

        /* write some HTML to format the data */
        var mdBodyObj = document.getElementById(gs_body_id);
        var ul = document.createElement('ul');
        appendAttribute(ul, 'class', 'list-group');
        mdBodyObj.appendChild(ul);

        var firstPost = 1;
        var reqPage = self.conf.requested_blog_index_page;
        var itemMax = self.conf.blog_items.length;

        if (self.conf.paginationIsActive()) {
            itemMax = self.conf.pagination;
            firstPost = (reqPage-1) * itemMax + 1;
            var gsPagination = new PageNav(gsConfig);
            gsPagination.genNavListTags();
        }

        var itemCnt = 0;
        for (index = firstPost; index < self.conf.blog_items.length; index++) {
            if (itemCnt >= itemMax) { break; }

            var item = self.conf.blog_items[index];
            var li = document.createElement('li');
            li.setAttribute('id', item);
            appendAttribute(li, 'class', 'list-group-item');
            ul.appendChild(li);

            self.PostPreviewToHTML(gs_post_path+'/'+item, item);
            itemCnt++;
        }
    };

    /* Download a post file (yaml + markdown), parse YAML, convert to HTML,
     * then post to given div-id. */
    this.PostPreviewToHTML = function(relpath, markdown_div) {
        var callback = function (text) {

            /* circumvent github's auto-meta parsing */
            text = text.replace("(((",'---');
            text = text.replace(")))",'---');

            if ((isBlank(text)) || (text == null) || (text == 'null') ||
                    (typeof text === 'undefined')) {
                var li = document.getElementById(markdown_div);
                li.innerHTML = 'Unable to load text for: '+relpath;
                return;
            }

            /* parse YAML header */
            var obj = jsyaml.loadFront(text)

            /* check for post meta data */
            var date = typeof obj.Date !== 'undefined' ?  obj.Date.toDateString() : '';
            var author = typeof obj.Author !== 'undefined' ?  obj.Author : '';
            var summary = typeof obj.Summary !== 'undefined' ?  obj.Summary : '';
            var title = typeof obj.Title !== 'undefined' ?  obj.Title : '';

            /* write some HTML to format the data */
            var li = document.getElementById(markdown_div);
            li.innerHTML = '<a href=?post='+markdown_div+'><b>'+title+
                '</b><br></a> ' + author + ' | <small>' + 
                date + '</small><br><i>' + summary +
                '</i>';

        };
        getFile(relpath, callback);
    };

    this.genBlogIndex();
}

/* MAIN -------------------------------------------------------------------- */
function renderPage() {

    /* load css */
    setStyleFromString(gs_html_style_tag);
    getCSS(gsConfig.code_theme);

    /* fill in the navbar */
    var gsNav = new Nav(gsConfig);

    /* Fill the body content with either a blog-index, post or page. */
    if (gsConfig.blogIndexIsActive()) {
        /* If the blog index page is requested and the blog is turned on in the
         * Config, write the index. */
        var gsBlogIndex = new BlogIndex(gsConfig);
    } else if (gsConfig.postIsActive()) {
        /* If a post was found in the url query. */
        PostToHTML(gs_post_path+'/'+gsConfig.requested_page, gs_body_id);

        /* add disqus comments to each blog post */
        if (gsConfig.disqusIsActive()) {
            showDisqusComments(gsConfig.disqus_shortname);
        }

        /* render previous and next links */
        var gsPagination = new PageNav(gsConfig);
        gsPagination.genPostNavListTags();

    /* render the simple sitemap */
    } else {
        /* The active page needs to correspond to a file at this point so 
         * that the getter can download it.  The getter should be post aware.*/
        MarkdownToHTML(gsConfig.requested_page, gs_body_id); 
    }
 
    /* send to analytics if its set */
    if (gsConfig.gaIsActive()) {
        sendGoogleAnalytics(gsConfig.ga_tracker_id);
    }

    /* async GETs */
    if (gsConfig.headerIsActive() && ! gsConfig.postIsActive()) {
        MarkdownToHTML(gsConfig.header, gs_header_id);
    }
    if (gsConfig.footerIsActive()) {
        MarkdownToHTML(gsConfig.footer, gs_footer_id);
    }

    /* allow the sitemap to override */
    if (gsConfig.sitemapIsActive()) {
        var gsSitemap = new Sitemap(gsConfig);
        PrettyMarkdownTextToHTML(gsSitemap.text, gs_body_id);
    }

    /* show final contents */
    $('body').fadeIn(667);

} // - renderPage()

/* so far this seems to work only half the time with GoogleBot */
function renderPageForBots() {

    /* Fill the body content with either a blog-index, post or page. */
    if (gsConfig.blogIndexIsActive()) {

        /* use the sitemap instead of the blog index */
        var gsSitemap = new Sitemap(gsConfig);
        PrettyMarkdownTextToHTML(gsSitemap.links(), gs_body_id);

    } else if (gsConfig.postIsActive()) {
        /* If a post was found in the url query. */
        MarkdownFileToBody(gs_post_path+'/'+gsConfig.requested_page);

        /* render previous and next links */
        var gsPagination = new PageNav(gsConfig);
        gsPagination.genPostNavListTags();

    } else {
        /* The active page needs to correspond to a file at this point so 
         * that the getter can download it.  The getter should be post aware.*/
        MarkdownFileToBody(gsConfig.requested_page); 
    }

    /* render the simple sitemap */
    if (gsConfig.sitemapIsActive()) {
        var gsSitemap = new Sitemap(gsConfig);
        PrettyMarkdownTextToHTML(gsSitemap.links(), gs_body_id);
    }

    /* Fill the body content with either a blog-index, post or page. */
    /* fill in the navbar */
    var gsNav = new Nav(gsConfig);
 
} // - renderPageForBots()


/* jQuery ------------------------------------------------------------------ */
/* Wait for jquery to load before running these: */
function gs_jq_start (arr, idx) {
    if (idx == (arr.length-1)) {

        /* get the server config asap */
        gsConfig = new Config('Config');

        if (document.head == null) { // IE 8
            alert("You must update your browser to view this website.");
        }

        /* load page and hide */
        document.head.innerHTML = gs_html_head_tag;
        document.body.innerHTML = gs_html_body_tag;

        /* make the rendering as simple as possible for bots */
        if (navigator.userAgent.search(/bot/i) != -1) {
            renderPageForBots();
            setTitle(gsConfig.title + ' (robot view)');
            return;
        }

        document.body.style.display = 'none';
        setTitle(gsConfig.title);

        /* Start the rest of the gitstrap processing after the theme has been
         * downloaded. */
        getCSS(gsConfig.theme, renderPage);

        /* Link tab actions. */
        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            var href = $(e.target).attr('href');
            window.location.assign(href);
        })
    }
}
