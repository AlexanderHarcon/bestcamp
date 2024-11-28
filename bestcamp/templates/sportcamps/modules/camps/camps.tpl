 {*
* < camps.html
*}
{*set $camps = 'camps'*}
 {set $products = 'pdoResources' | snippet : [
 'parents' => 0,
 'depth'   => 0,
 'limit'   => 0,
 'sortby' => 'id',
 'where' => [
    'country' => $country.id
 ],
 'class' => 'msProductData',
 'return'     => 'ids'
 ]}
 {set $camps = 'pdoResources' | snippet : [
 'parents' => 0,
 'depth'   => 0,
 'limit'   => 0,
 'sortby' => 'id',
 'select' => 'resource_id,title_en,title_de,features_ids,rating_id',
 'where' => [
    'sport_id' => $sport.id,
     'resource_id:IN' => $products | split
 ],
 'class' => 'cmpSportCamps',
 'return'     => 'data'
 ]}
 {*set $camps = $sport.id*}