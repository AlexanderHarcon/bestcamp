/**
 * home.js
*/
(function ()
{
    //- faq
    attachEvents('.faqitem-header-js', "click", function(event)
    {
        event.preventDefault();

        toggleSlide(this, '', 'close-js', function ()
        {
            removeClass('opened-js');
        });
    });
}());

console.log('home.js');