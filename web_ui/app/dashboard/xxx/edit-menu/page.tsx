import { CategoryForm } from "../../../components/add-category-form";
import { MenuItemForm } from "../../../components/menu-item-form";

export default function EditMenuPage() {
  // get categories
  // const categories = ["Appetizers", "Entrees", "Desserts"];
  return (
    <div className="flex h-screen w-screen">
      <MenuItemForm />
    </div>
  );
}
