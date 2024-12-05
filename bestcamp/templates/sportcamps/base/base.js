/**
 * base.js
*/
// function handling events for one or more selected items
function attachEvents(elementList, eventName, handlerFunction)
{
    if (elementList === null) return false;

    if(typeof elementList === "string") elementList = document.querySelectorAll(elementList);

    if (elementList.length)
    {
        for(let i = 0; i < elementList.length; i++) elementList[i].addEventListener(eventName, handlerFunction);
    }
    else
    {
        if(typeof elementList.length === 'number') return false;

        elementList.addEventListener(eventName, handlerFunction);
    }
}
/**
 * Replacement jQuery slideToggle
 * @param btn - control element
 * @param block - selector(string) or element or empty
 * @param classname - string
 * @param fnopen - function works when maximizing the content window
 * @param fnclose - function works when minimizing the content window
 */
function toggleSlide(btn, block, classname, fnopen, fnclose)
{
    let content;

    if (typeof block === "string" && block !== '') content = document.querySelector(block);

    let height;

    if (block === '')
    {
        content = btn.nextElementSibling;
    }

    if (!content.classList.contains(classname))
    {
        content.classList.add(classname);
        btn.classList.add(classname);
        height = content.clientHeight + 'px';
        content.style.height = '0px';

        setTimeout(function ()
        {
            content.style.height = height;
        }, 0);

        content.addEventListener('transitionend', function ()
        {
            content.style.removeProperty('height');

            if (typeof fnopen === "function")
            {
                fnopen();
                //console.log(content);
            }

        }, { once: true });
    }
    else
    {
        height = content.clientHeight + 'px';
        content.style.height = height;

        setTimeout(function ()
        {
            content.style.height = '0px';
        }, 0);

        content.addEventListener('transitionend', function ()
        {
            content.style.removeProperty('height');
            content.classList.remove(classname);
            btn.classList.remove(classname);

            if (typeof fnclose === "function")
            {
                fnclose();
            }

        }, { once: true });
    }
}
/**
 * Removing classes and other actions on elements
 * @param classname
 * @param callback function (fires for each found element after the class is removed)
 */
function removeClass(classname, callback)
{
    const opened = document.querySelectorAll('.' + classname);
    for (let i = 0; i < opened.length; i++)
    {
        opened[i].classList.remove(classname);

        if (typeof callback === "function")
        {
            callback(opened[i]);
        }
    }
}
/**
 * for lazy loading css and js
 */
function loaderBody(uri, callback, types)
{
    let old;
    if (uri)
    {
        old = document.querySelector('[href="'+ uri +'"], [src="'+ uri +'"]');
    }

    if (!callback && old) return;

    if (callback && (!uri || old))
    {
        callback();
        return;
    }

    if (!uri) return;

    const type = types || 'script';
    const el = document.createElement(type);

    if (type === 'link')
    {
        el.rel = "stylesheet";
        el.href = uri;
    }
    else
    {
        el.src = uri;
    }

    document.body.appendChild(el);

    if (!callback) return;
    el.onload = () =>
    {
        callback();
    };
}

const sportcamps = {
    templates: 'assets/templates/',
    js: 'assets/templates/js/'
};

(function ()
{
    const menutopbtn = document.getElementById('menutop-btn');

    //- Menu top Button mobile
    attachEvents(menutopbtn, "click", function()
    {
        if (document.defaultView.getComputedStyle(menutopbtn, null).display !== 'none')
        {
            document.body.classList.remove('menuopen-js');

            if (menutopbtn.querySelector('input').checked)
                document.body.classList.add('menuopen-js');
        }
    });

    //- submenu
    attachEvents('.menu-el--folder-js', "click", function(event)
    {
        event.preventDefault();

        if (document.defaultView.getComputedStyle(menutopbtn, null).display !== 'none')
        {
            toggleSlide(this, '', 'opened-js');
        }
        else
        {
            if (!this.parentElement.classList.contains("visible-js"))
            {
                removeClass('visible-js');
            }

            this.parentElement.classList.toggle("visible-js");
        }
    });
}());
