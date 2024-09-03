import Link from "next/link";

export default function Page({
  params,
}: {
  params: { restaurant_id: string };
}) {
  const restaurant_id = params.restaurant_id;
  return (
    <div className="flex flex-col justify-center items-center p-24">
      <Link
        href={`/dashboard/restaurants/${restaurant_id}/edit-menu`}
        className="bg-blue-100"
      >
        <p>Edit Menu</p>
      </Link>
      {/* <Link href={`/portal/${restaurant_id}/analytics`}>
        <p>Edit Menu</p>
      </Link> */}
    </div>
  );
}
