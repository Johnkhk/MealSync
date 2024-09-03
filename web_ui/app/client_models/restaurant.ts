interface Customizations {
  [key: string]: {
    [key: string]: number;
  };
}

interface MenuItem {
  menu_item_id: string;
  name: string;
  price: number;
  description: string;
  customizations: Customizations;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

interface Restaurant {
  created_at: string;
  email: string;
  id: number;
  location: string;
  name: string;
  phone_number: string;
  website: string;
}

export type { Restaurant, MenuCategory, MenuItem, Customizations };

// mealsync/12324/5/websocket_hash
// mealsync/[restaurant_id]/[table_id]
