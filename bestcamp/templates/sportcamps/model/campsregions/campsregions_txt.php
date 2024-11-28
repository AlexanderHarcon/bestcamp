// preview Images
@CHUNK propertyPrevImages

// cmpLocations
db_locations
@CHUNK listLocations

// cmpInformersTypes
db_informersTypes
@CHUNK listInformers

&configs=db_countries||db_regions||db_cities||db_locations||db_informersTypes

//back db_cities
{"aftergetfields":"aftergetfieldsRegion"}
<?php



