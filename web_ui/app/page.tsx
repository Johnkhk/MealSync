import Image from "next/image";

export default function Home() {
  // TODO fetch some stuff serverside
  
  return (
    <main className="w-screen h-screen bg-white">
      <div className="bg-red-300 font-monofett text-4xl flex flex-col items-center">
        <Image src="/Meal Sync.png" alt="logo" width={100} height={100} />
      </div>
    </main>
  );
}
