# Start postgres db:
brew services start postgresql

# Run create tables query:
`psql -U mealsync_admin -d mealsync_db -f backend_server/queries/create_tables.sql`

# Run drop tables query:
`psql -U mealsync_admin -d mealsync_db -f backend_server/queries/drop_tables.sql`

# Note customization-groups and customization-options

Let's create some example entries for the new tables to demonstrate how these customizations would work for specific menu items in your restaurant. We'll use a hypothetical menu item, like a "Burger," and show how you could apply different types of customizations.

### Example Data Entries

1. **Menu Items Table**:
   Let's assume we have a menu item called "Classic Burger."

```sql
-- Insert a new menu item
INSERT INTO menu_items (category_id, name, description, price) 
VALUES (1, 'Classic Burger', 'A delicious beef patty with lettuce, tomato, and cheese', 8.99);
```

2. **Customization Groups Table**:
   We'll add two customization groups for this item:
   - **Group 1:** "Choose your size" (radio button selection)
   - **Group 2:** "Select toppings" (checkbox selection)

```sql
-- Insert customization groups for the Classic Burger
INSERT INTO customization_groups (menu_item_id, name, type) 
VALUES 
(1, 'Choose your size', 'radio'),
(1, 'Select toppings', 'checkbox');
```

3. **Customization Options Table**:
   Now, let's add customization options for each group:
   - **Group 1 Options (Size):** Small, Medium, Large
   - **Group 2 Options (Toppings):** Extra Cheese, Bacon, Avocado

```sql
-- Insert options for the 'Choose your size' group
INSERT INTO customization_options (group_id, name, additional_price, is_default) 
VALUES 
(1, 'Small', 0.00, TRUE),       -- Default size with no extra charge
(1, 'Medium', 1.00, FALSE),     -- Extra $1.00 for Medium size
(1, 'Large', 2.00, FALSE);      -- Extra $2.00 for Large size

-- Insert options for the 'Select toppings' group
INSERT INTO customization_options (group_id, name, additional_price, is_default) 
VALUES 
(2, 'Extra Cheese', 0.50, FALSE),  -- Extra $0.50 for Extra Cheese
(2, 'Bacon', 1.00, FALSE),         -- Extra $1.00 for Bacon
(2, 'Avocado', 1.50, FALSE);       -- Extra $1.50 for Avocado
```

### Example Scenario Breakdown

- **Classic Burger**:
  - Base price: **$8.99**

- **Customization Group: "Choose your size"** (radio button, mutually exclusive):
  - **Small** (default, no additional cost)
  - **Medium** (+$1.00)
  - **Large** (+$2.00)

- **Customization Group: "Select toppings"** (checkbox, multiple selections allowed):
  - **Extra Cheese** (+$0.50)
  - **Bacon** (+$1.00)
  - **Avocado** (+$1.50)

### Example Usage

When a customer orders a "Classic Burger," they will see the following options:

1. **Size Selection** (Radio buttons):
   - **Small** (default, $8.99)
   - **Medium** ($9.99)
   - **Large** ($10.99)

2. **Toppings Selection** (Checkboxes):
   - **Extra Cheese** (+$0.50)
   - **Bacon** (+$1.00)
   - **Avocado** (+$1.50)

If the customer selects:
- **Medium Size**: Additional $1.00
- **Extra Cheese** and **Avocado**: Additional $0.50 + $1.50

**Total Cost Calculation**:
- Base price: **$8.99**
- Medium Size: **+$1.00**
- Extra Cheese: **+$0.50**
- Avocado: **+$1.50**

**Total:** **$11.99**

### Conclusion

This example illustrates how you can set up various customization options using the revised schema. The new tables (`customization_groups` and `customization_options`) provide flexibility for defining different types of customizations, allowing you to manage complex scenarios easily.


Absolutely! Let's clarify what **groups** and **options** are in the context of your menu item customization, using more examples beyond a burger.

### What are Groups and Options?

1. **Customization Groups**:
   - These are the different categories of customizations you want to offer for a menu item.
   - Each group represents a different aspect or choice that the customer can customize.
   - Examples: "Choose your size," "Select toppings," "Choose your bread type," "Pick your spice level," etc.

2. **Customization Options**:
   - These are the individual choices available within each group.
   - Each option represents a specific choice the customer can make within a particular group.
   - Examples: For a "Choose your size" group, options could be "Small," "Medium," or "Large." For a "Pick your spice level" group, options could be "Mild," "Medium," "Hot," or "Extra Hot."

### Examples Beyond a Burger

Let's use a few different types of dishes to illustrate how groups and options might work:

#### 1. **Pizza**

- **Customization Group 1: "Choose Your Size"**
  - Options:
    - Small
    - Medium
    - Large

- **Customization Group 2: "Select Crust Type"**
  - Options:
    - Thin Crust
    - Thick Crust
    - Stuffed Crust

- **Customization Group 3: "Choose Toppings"** (Multiple selections allowed)
  - Options:
    - Pepperoni
    - Mushrooms
    - Onions
    - Green Peppers
    - Extra Cheese

#### 2. **Pasta**

- **Customization Group 1: "Select Pasta Type"**
  - Options:
    - Spaghetti
    - Fettuccine
    - Penne

- **Customization Group 2: "Choose Sauce"**
  - Options:
    - Marinara
    - Alfredo
    - Pesto
    - Bolognese

- **Customization Group 3: "Add Extra Ingredients"** (Multiple selections allowed)
  - Options:
    - Grilled Chicken
    - Meatballs
    - Vegetables
    - Parmesan Cheese

#### 3. **Salad**

- **Customization Group 1: "Choose Your Base"**
  - Options:
    - Romaine Lettuce
    - Spinach
    - Kale

- **Customization Group 2: "Pick Protein"**
  - Options:
    - Grilled Chicken
    - Tofu
    - Salmon

- **Customization Group 3: "Select Dressing"**
  - Options:
    - Caesar
    - Ranch
    - Balsamic Vinaigrette
    - Honey Mustard

#### 4. **Coffee**

- **Customization Group 1: "Choose Coffee Type"**
  - Options:
    - Espresso
    - Cappuccino
    - Latte
    - Americano

- **Customization Group 2: "Select Milk"**
  - Options:
    - Whole Milk
    - Skim Milk
    - Almond Milk
    - Oat Milk

- **Customization Group 3: "Choose Sweetener"**
  - Options:
    - Sugar
    - Honey
    - Stevia
    - No Sweetener

### Summary

- **Groups** define the different types of customizations available for a menu item.
- **Options** are the specific choices within each customization group.

These groups and options make your menu flexible, allowing customers to personalize their orders based on their preferences. Would you like further clarification or examples, or do you want to proceed with implementing specific functionality?