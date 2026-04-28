export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--fx-border)] bg-[var(--fx-surface)] py-[18px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-2 px-5 text-[0.77rem] text-[var(--fx-text-3)] sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="m-0">FexAPI</p>
        <p className="m-0">MIT Licensed • Built for frontend-first teams</p>
      </div>
    </footer>
  );
}
