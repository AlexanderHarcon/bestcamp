//
cmpSports
group_id / @CHUNK listGroups
sport_en / Sport EN
sport_de / Sport DE
sportlong_en / Long sport name EN
sportlong_de / Long sport name DE
ico / icon
desc_en / Description EN
desc_de / Description DE
banner / Banner
img / Images
imgalt_en / Images Alt EN
imgalt_de / Images Alt DE
@CHUNK listGroups

	//Sports groups
	cmpSportsGroups
	cmp_sports_groups
	group_en / Sport group EN
	group_de / Sport group DE
	//db_sportsGroups


//sports infrastructure
cmpSportInfrastr
cmp_sport_infrastr
sportinfra_en
sportinfra_de
facility_id
sport_id
covered
ico
//db_sportInfrastr
Infrastructure
@CHUNK listFacility
@CHUNK listSports
@CHUNK listCoverings / listbox-multiple
@CHUNK listMarkings
@CHUNK listOptions
@CHUNK listRentals
[
{"alias":"Facility"},
{"alias":"Sport"}
]
{"aftergetfields":"infrastrAftergetfields","aftersave":"infrastrAftersave"}



//sports facility
cmpSportFacility
cmp_sport_facility
type_id / @CHUNK listTypes
facility_en / Sport Facility EN
facility_de / Sport Facility DE
length / Length
width / Width
height / Height
depth / Depth
//db_sportFacility
add Facility
[{"alias":"Type"}]


//coverings
cmpSportCoverings
cmp_sport_coverings
covering_en
covering_de
covered
//db_sportCoverings

//marking
cmpSportMarking
cmp_sport_marking
marking_en
marking_de
//db_sportMarking

//facility options
cmpFacilityOptions
cmp_facility_options
option_en
option_de
//db_facilityOptions
facility Options

//facility rental
cmpFacilityRental
cmp_facility_rental
rental_en / Rental EN
rental_de / Rental DE
//db_facilityRental
facility Rental

//type facility
cmpFacilityTypes
cmp_facility_types
type_en / Facility Type EN
type_de / Facility Type DE
//db_facilityTypes

//sports infrastructure - Coverings
cmpInfrastrCoverings
cmp_infrastr_coverings
infrastr_id
covering_id

//sports infrastructure - Marking
cmpInfrastrMarking
cmp_infrastr_marking
infrastr_id
marking_id

//sports infrastructure - FacilityOptions
cmpInfrastrFcOptions
cmp_infrastr_fc_options
infrastr_id
option_id

//sports infrastructure - facility rental
cmpInfrastrFcRental
cmp_infrastr_fc_rental
infrastr_id
rental_id

&configs=db_sports||db_sportsGroups||db_sportInfrastr||db_sportFacility||db_facilityTypes||db_facilityOptions||db_facilityRental||db_sportCoverings||db_sportMarking

The image was not found and can’t be cropped. Please select a different image.


5075

&configs=db_sportsGroups||db_sportFacility||db_facilityTypes||db_sportCoverings||db_sportMarking||db_facilityOptions||db_facilityRental

















