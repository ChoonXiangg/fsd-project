export const counties = [
    'Carlow',
    'Cavan',
    'Clare',
    'Cork',
    'Donegal',
    'Dublin',
    'Galway',
    'Kerry',
    'Kildare',
    'Kilkenny',
    'Laois',
    'Leitrim',
    'Limerick',
    'Longford',
    'Louth',
    'Mayo',
    'Meath',
    'Monaghan',
    'Offaly',
    'Roscommon',
    'Sligo',
    'Tipperary',
    'Waterford',
    'Westmeath',
    'Wexford',
    'Wicklow'
];

export const citiesByCounty = {
    Dublin: ['Dublin', 'Swords', 'Malahide', 'Balbriggan', 'Skerries'],
    Cork: ['Cork', 'Ballincollig', 'Carrigaline', 'Cobh', 'Midleton'],
    Limerick: ['Limerick', 'Newcastle West', 'Annacotty', 'Castleconnell'],
    Galway: ['Galway', 'Tuam', 'Ballinasloe', 'Loughrea', 'Oranmore'],
    Waterford: ['Waterford', 'Tramore', 'Dungarvan', 'Dunmore East'],
    Louth: ['Drogheda', 'Dundalk', 'Ardee'],
    Wicklow: ['Bray', 'Greystones', 'Arklow', 'Wicklow Town', 'Blessington'],
    Meath: ['Navan', 'Ashbourne', 'Ratoath', 'Dunboyne', 'Trim'],
    Clare: ['Ennis', 'Shannon', 'Kilrush'],
    Kilkenny: ['Kilkenny', 'Callan', 'Thomastown'],
    Carlow: ['Carlow', 'Tullow', 'Muine Bheag'],
    Kerry: ['Tralee', 'Killarney', 'Listowel', 'Castleisland'],
    Kildare: ['Naas', 'Newbridge', 'Celbridge', 'Leixlip', 'Maynooth'],
    Westmeath: ['Athlone', 'Mullingar', 'Moate'],
    Wexford: ['Wexford', 'Enniscorthy', 'Gorey', 'New Ross'],
    Donegal: ['Letterkenny', 'Buncrana', 'Ballybofey', 'Donegal Town'],
    Sligo: ['Sligo', 'Tubbercurry', 'Ballymote'],
    Tipperary: ['Clonmel', 'Nenagh', 'Thurles', 'Cashel', 'Tipperary Town'],
    Laois: ['Portlaoise', 'Portarlington', 'Mountmellick'],
    Offaly: ['Tullamore', 'Edenderry', 'Birr'],
    Cavan: ['Cavan', 'Virginia', 'Kingscourt'],
    Monaghan: ['Monaghan', 'Carrickmacross', 'Castleblayney'],
    Roscommon: ['Roscommon', 'Boyle', 'Castlerea'],
    Leitrim: ['Carrick-on-Shannon', 'Manorhamilton', 'Ballinamore'],
    Longford: ['Longford', 'Ballymahon', 'Granard'],
    Mayo: ['Castlebar', 'Ballina', 'Westport', 'Claremorris']
};

export const cities = Object.values(citiesByCounty).flat().sort();

export const propertyTypes = {
    Residential: [
        'Bungalow',
        'Apartment',
        'Semi-Detached House',
        'Terrace',
        'Residential Land'
    ],
    Commercial: [
        'Commercial Property',
        'Industrial Property',
        'Agricultural Land'
    ]
};

export const bedroomOptions = [
    'Studio',
    '1',
    '2',
    '3',
    '4',
    '5+'
];
