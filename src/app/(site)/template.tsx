export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden className="page-curtain" />
      <div className="page-enter">{children}</div>
    </>
  );
}
