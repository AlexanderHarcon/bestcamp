 {*
* < countries.html
*}
{set $countries = 'pdoResources' | snippet : [
    'parents' => $parents,
    'depth'   => 0,
    'limit'   => $limit,
    'includeTVs' => 'drop_contry,drop_region',
    'showUnpublished' => $access,
    'select' => 'id,uri,pagetitle',
    'where' => [
        'id:!=' => $res.id
    ]
    'tvPrefix' => '',
    'return'     => 'data'
]}
