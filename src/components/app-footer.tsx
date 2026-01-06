export default function AppFooter() {
  // note for mt-auto to push footer to bottom of page we had to make the
  // layout div a flex column and make it take the full height of the screen
  return (
    <footer className="mt-auto border-t border-black/5 py-5">
      <small className="opacity-50">
        &copy; 2025 PetSoft. All rights reserved.
      </small>
    </footer>
  );
}
