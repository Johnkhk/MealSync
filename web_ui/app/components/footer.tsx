import Image from 'next/image';

export function Footer({t}: {t: any}) {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left pb-4">
          {" "}{"Powered By"}{" "}
        </p>
        <div>
            <Image src="/Meal Sync horizontal.png" alt="logo" width={100} height={100} />
        </div>
      </div>
    </footer>
  )
}
