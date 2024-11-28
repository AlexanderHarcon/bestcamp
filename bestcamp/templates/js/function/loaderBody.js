/**
 * for lazy loading css and js
 */
function loaderBody(uri, callback, types)
{
    const type = types || 'script';
    if (uri)
    {
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
        }
    }
    else
    {
        if (!callback) return;
        callback();
    }
}