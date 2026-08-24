export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </div>
  );
}
