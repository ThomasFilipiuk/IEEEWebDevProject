interface Category {
    name: string;
    menuItems: MenuItem[];
}

interface MenuItem {
    name: string;
    description: string;
    attributes: Attribute[];
    portion: string;
    calories: number | undefined;
    nutritionalInfo: NutritionalInfo;
}

interface Attribute {
    name: string;
    description: string;
}

interface NutritionalInfo {
    ingredients: string[];
    nutrients: Nutrient[];
}

interface Nutrient {
    name: string;
    value: string;
}

export { Category, MenuItem, Attribute, NutritionalInfo, Nutrient }