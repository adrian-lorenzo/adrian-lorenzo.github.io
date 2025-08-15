interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="underline decoration-stone-400/60 underline-offset-4 hover:decoration-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded"
    >
      {children}
    </a>
  );
}
