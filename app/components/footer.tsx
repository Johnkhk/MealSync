export function Footer({t}: {t: any}) {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {t.message1 + " "}
          <a
            href="/legal"
            className="font-medium underline underline-offset-4"
          >
            {t.terms}
          </a>
          {/* {" "}{t.footer_message_1}{" "} */}
          {" "}{"Powered By"}{" "}
        </p>
      </div>
    </footer>
  )
}
